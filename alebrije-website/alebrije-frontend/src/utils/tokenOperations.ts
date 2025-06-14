import { Connection, PublicKey, Transaction, clusterApiUrl } from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID, 
  Token
} from '@solana/spl-token';

// Demonstrate usage of isTokenProgramSupported and createInstructions
export class TokenProgramUtils {
  // Utility to check if a given program ID is the token program
  static isTokenProgramSupported(programId: PublicKey): boolean {
    return programId.equals(TOKEN_PROGRAM_ID);
  }

  // Utility to create burn and transfer instructions for testing/demonstration
  static createInstructions(
    tokenAccount: PublicKey, 
    mintAccount: PublicKey, 
    owner: PublicKey, 
    amount: number
  ) {
    // Create burn instruction
    const burnInstr = createBurnInstruction(
      tokenAccount, 
      mintAccount, 
      owner, 
      amount
    );

    // Create transfer instruction
    const transferInstr = createTransferInstruction(
      tokenAccount, 
      tokenAccount, 
      owner, 
      amount
    );

    return { 
      burnInstr, 
      transferInstr,
      // Add a method to validate token program
      validateTokenProgram: () => this.isTokenProgramSupported(TOKEN_PROGRAM_ID)
    };
  }
}

// ALBJ Token Mint Address - mainnet token address
export const TEST_ALBJ_MINT = new PublicKey('AHstXMQM3uWETKn3WaztgayZtQhB7iJiPTvqmVi7cbC'); // Current ALBJ token mint

export class TokenOperations {
  private connection: Connection;
  
  constructor(isTestMode: boolean = false) {
    // Use devnet for test mode, mainnet for production
    this.connection = new Connection(
      isTestMode ? clusterApiUrl('devnet') : clusterApiUrl('mainnet-beta'),
      'confirmed'
    );
  }

  async burnTokens(
    walletPublicKey: PublicKey,
    amount: number,
    signTransaction: (transaction: Transaction) => Promise<Transaction>
  ): Promise<{ success: boolean; signature?: string; error?: string }> {
    try {
      console.log('🔥 Starting token burn operation...');
      console.log('Amount to burn:', amount);
      console.log('Wallet:', walletPublicKey.toString());

      // Get associated token account for the wallet
      const tokenAccount = await getAssociatedTokenAddress(
        TEST_ALBJ_MINT,
        walletPublicKey
      );

      console.log('Token account:', tokenAccount.toString());

      // Check if token account exists and has enough balance
      const accountInfo = await this.connection.getTokenAccountBalance(tokenAccount);
      if (!accountInfo || !accountInfo.value || accountInfo.value.uiAmount === null) {
        throw new Error('No ALBJ tokens found in wallet');
      }

      if (accountInfo.value.uiAmount < amount) {
        throw new Error(`Insufficient balance. Available: ${accountInfo.value.uiAmount} ALBJ`);
      }

      // Get mint info for decimals
      const mintInfo = await getMint(this.connection, TEST_ALBJ_MINT);
      
      // Create burn instruction using the checked version for better safety
      const burnInstruction = createBurnCheckedInstruction(
        tokenAccount,
        TEST_ALBJ_MINT,
        walletPublicKey,
        amount * Math.pow(10, mintInfo.decimals), // Convert to token units
        mintInfo.decimals
      );

      // Create transaction
      const transaction = new Transaction().add(burnInstruction);
      
      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = walletPublicKey;

      console.log('📝 Transaction created, requesting signature...');

      // Sign transaction
      const signedTransaction = await signTransaction(transaction);

      console.log('✍️ Transaction signed, sending...');

      // Send transaction
      const signature = await this.connection.sendRawTransaction(
        signedTransaction.serialize(),
        { skipPreflight: false }
      );

      console.log('📤 Transaction sent:', signature);

      // Confirm transaction
      await this.connection.confirmTransaction(signature, 'confirmed');

      console.log('✅ Burn successful!');

      return { success: true, signature };
    } catch (error) {
      console.error('❌ Burn failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async transferTokens(
    walletPublicKey: PublicKey,
    recipientAddress: string,
    amount: number,
    signTransaction: (transaction: Transaction) => Promise<Transaction>
  ): Promise<{ success: boolean; signature?: string; error?: string }> {
    try {
      console.log('🚀 Starting token transfer operation...');
      console.log('Amount to transfer:', amount);
      console.log('From:', walletPublicKey.toString());
      console.log('To:', recipientAddress);

      // Validate recipient address
      const recipientPublicKey = new PublicKey(recipientAddress);

      // Get token accounts
      const senderTokenAccount = await getAssociatedTokenAddress(
        TEST_ALBJ_MINT,
        walletPublicKey
      );

      const recipientTokenAccount = await getAssociatedTokenAddress(
        TEST_ALBJ_MINT,
        recipientPublicKey
      );

      // Check sender balance
      const senderAccountInfo = await this.connection.getTokenAccountBalance(senderTokenAccount);
      if (!senderAccountInfo || !senderAccountInfo.value || senderAccountInfo.value.uiAmount === null) {
        throw new Error('No ALBJ tokens found in sender wallet');
      }

      if (senderAccountInfo.value.uiAmount < amount) {
        throw new Error(`Insufficient balance. Available: ${senderAccountInfo.value.uiAmount} ALBJ`);
      }

      // Get mint info for decimals
      const mintInfo = await getMint(this.connection, TEST_ALBJ_MINT);

      // Create transfer instruction using the checked version for better safety
      const transferInstruction = createTransferCheckedInstruction(
        senderTokenAccount,
        TEST_ALBJ_MINT,
        recipientTokenAccount,
        walletPublicKey,
        amount * Math.pow(10, mintInfo.decimals),
        mintInfo.decimals
      );

      // Create transaction
      const transaction = new Transaction().add(transferInstruction);
      
      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = walletPublicKey;

      console.log('📝 Transfer transaction created, requesting signature...');

      // Sign transaction
      const signedTransaction = await signTransaction(transaction);

      console.log('✍️ Transaction signed, sending...');

      // Send transaction
      const signature = await this.connection.sendRawTransaction(
        signedTransaction.serialize(),
        { skipPreflight: false }
      );

      console.log('📤 Transaction sent:', signature);

      // Confirm transaction
      await this.connection.confirmTransaction(signature, 'confirmed');

      console.log('✅ Transfer successful!');

      return { success: true, signature };
    } catch (error) {
      console.error('❌ Transfer failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async getTokenBalance(walletPublicKey: PublicKey): Promise<number> {
    try {
      const tokenAccount = await getAssociatedTokenAddress(
        TEST_ALBJ_MINT,
        walletPublicKey
      );

      const accountInfo = await this.connection.getTokenAccountBalance(tokenAccount);
      return accountInfo?.value?.uiAmount || 0;
    } catch (error) {
      console.error('Error getting token balance:', error);
      return 0;
    }
  }

  async getTransactionHistory(walletPublicKey: PublicKey): Promise<any[]> {
    try {
      const signatures = await this.connection.getSignaturesForAddress(
        walletPublicKey,
        { limit: 10 }
      );

      const transactions = await Promise.all(
        signatures.map(async (sig) => {
          const tx = await this.connection.getTransaction(sig.signature);
          return {
            signature: sig.signature,
            slot: sig.slot,
            blockTime: sig.blockTime,
            transaction: tx
          };
        })
      );

      return transactions;
    } catch (error) {
      console.error('Error getting transaction history:', error);
      return [];
    }
  }

  // Optional: Add a method demonstrating token program utilities
  async validateTokenProgram(programId: PublicKey): Promise<boolean> {
    try {
      // Demonstrate usage of isTokenProgramSupported
      const isSupported = TokenProgramUtils.isTokenProgramSupported(programId);
      
      // Additional validation logic can be added here
      console.log(`Validating Token Program: ${programId.toString()}`);
      console.log(`Is Supported: ${isSupported}`);

      return isSupported;
    } catch (error) {
      console.error('Token program validation error:', error);
      return false;
    }
  }
} 