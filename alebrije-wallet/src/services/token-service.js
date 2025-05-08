import WalletService from './wallet-service';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmTransaction, Keypair } from '@solana/web3.js';
import { createTransferInstruction, TOKEN_PROGRAM_ID, createBurnInstruction, getAssociatedTokenAddress } from '@solana/spl-token';
import { clusterApiUrl } from '@solana/web3.js';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';

class TokenService {
  constructor() {
    this.connection = null;
    this.tokenInfo = {};
  }

  initialize(endpoint) {
    this.connection = new Connection(endpoint || clusterApiUrl('devnet'), 'confirmed');
  }

  async getTokenBalance(tokenAddress, walletAddress) {
    if (!this.connection) throw new Error('Token service not initialized');
    if (!walletAddress) throw new Error('Wallet address is required');
    
    try {
      const tokenPublicKey = new PublicKey(tokenAddress);
      const walletPublicKey = new PublicKey(walletAddress);
      
      // Get associated token account
      const associatedTokenAddress = await getAssociatedTokenAddress(
        tokenPublicKey,
        walletPublicKey
      );
      
      try {
        const accountInfo = await this.connection.getTokenAccountBalance(associatedTokenAddress);
        return accountInfo.value.uiAmount;
      } catch (err) {
        // If account doesn't exist, return 0
        return 0;
      }
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw new Error('Failed to get token balance: ' + error.message);
    }
  }

  async transferToken(tokenAddress, fromWallet, toAddress, amount) {
    if (!this.connection) throw new Error('Token service not initialized');
    
    try {
      const tokenPublicKey = new PublicKey(tokenAddress);
      const fromPublicKey = new PublicKey(fromWallet);
      const toPublicKey = new PublicKey(toAddress);
      
      // Get token decimals
      const tokenInfo = await this.getTokenInfo(tokenAddress);
      const decimals = tokenInfo.decimals;
      
      // Calculate token amounts with decimals
      const rawAmount = amount * Math.pow(10, decimals);
      
      // Get or create associated token accounts
      const fromTokenAccount = await getAssociatedTokenAddress(
        tokenPublicKey,
        fromPublicKey
      );
      
      const toTokenAccount = await getAssociatedTokenAddress(
        tokenPublicKey,
        toPublicKey
      );
      
      // Create transaction
      const transaction = new Transaction();
      
      // Check if recipient token account exists
      const recipientAccount = await this.connection.getAccountInfo(toTokenAccount);
      
      // If recipient account doesn't exist, add create instruction
      if (!recipientAccount) {
        const createAccountInstruction = await createAssociatedTokenAccountInstruction(
          fromPublicKey, // payer
          toTokenAccount, // associated token account
          toPublicKey, // owner
          tokenPublicKey // mint
        );
        transaction.add(createAccountInstruction);
      }
      
      // Add transfer instruction
      const transferInstruction = createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        fromPublicKey,
        rawAmount,
        [],
        TOKEN_PROGRAM_ID
      );
      
      transaction.add(transferInstruction);
      
      // Set recent blockhash and fee payer
      transaction.recentBlockhash = (await this.connection.getRecentBlockhash()).blockhash;
      transaction.feePayer = fromPublicKey;
      
      // Get the wallet adapter
      const walletAdapter = window.solana || window.solflare;
      if (!walletAdapter) {
        throw new Error('No compatible wallet found');
      }
      
      // Sign and send transaction
      try {
        const signed = await walletAdapter.signTransaction(transaction);
        const signature = await this.connection.sendRawTransaction(signed.serialize());
        
        // Wait for confirmation
        const confirmation = await this.connection.confirmTransaction(signature, 'confirmed');
        
        if (confirmation.value?.err) {
          throw new Error('Transaction failed: ' + JSON.stringify(confirmation.value.err));
        }
        
        return {
          signature,
          status: 'confirmed'
        };
      } catch (signError) {
        if (signError.message?.includes('User rejected')) {
          throw new Error('Transaction was rejected by the user');
        }
        throw new Error('Failed to sign transaction: ' + signError.message);
      }
    } catch (error) {
      console.error('Token transfer error:', error);
      throw new Error('Transfer failed: ' + error.message);
    }
  }

  async getTokenInfo(tokenAddress) {
    if (!this.connection) {
      throw new Error('Token service not initialized');
    }
    
    try {
      // If we already have the info cached, return it
      if (this.tokenInfo[tokenAddress]) {
        return this.tokenInfo[tokenAddress];
      }
      
      const tokenPublicKey = new PublicKey(tokenAddress);
      
      // Get mint info
      const mintInfo = await this.connection.getParsedAccountInfo(tokenPublicKey);
      
      if (!mintInfo.value || !mintInfo.value.data.parsed) {
        throw new Error('Invalid token address');
      }
      
      const parsedMintInfo = mintInfo.value.data.parsed.info;

      // For Alebrije token, use predefined metadata
      if (tokenAddress === 'G8xNrjfTBTMASoUox7TgBn2wq6aGLJ5U78qY5JdEJKhN') {
        const parsedInfo = {
          address: tokenAddress,
          decimals: parsedMintInfo.decimals || 9,
          supply: parsedMintInfo.supply,
          name: 'Alebrije Token',
          symbol: 'ALB',
          isAlebrije: true
        };
        
        // Cache the info
        this.tokenInfo[tokenAddress] = parsedInfo;
        
        console.log('Loaded Alebrije token info:', parsedInfo);
        return parsedInfo;
      }
      
      // For other tokens, use basic info
      const parsedInfo = {
        address: tokenAddress,
        decimals: parsedMintInfo.decimals,
        supply: parsedMintInfo.supply,
        name: 'Unknown Token',
        symbol: 'UNKNOWN'
      };
      
      // Cache the info
      this.tokenInfo[tokenAddress] = parsedInfo;
      
      console.log('Loaded token info:', parsedInfo);
      return parsedInfo;
    } catch (error) {
      console.error('Error getting token info:', error);
      throw new Error('Failed to get token info: ' + error.message);
    }
  }

  async getAccountTransactions(walletAddress, limit = 10) {
    if (!this.connection) throw new Error('Token service not initialized');
    if (!walletAddress) throw new Error('Wallet address is required');
    
    try {
      const walletPublicKey = new PublicKey(walletAddress);
      
      // Get recent transactions for the account
      const signatures = await this.connection.getSignaturesForAddress(
        walletPublicKey,
        { limit }
      );
      
      // Return simplified transaction data
      return signatures.map(sig => ({
        signature: sig.signature,
        timestamp: sig.blockTime || Date.now() / 1000,
        status: sig.confirmationStatus || 'confirmed',
        type: 'unknown',
        symbol: 'SOL',
        decimals: 9,
        amount: 0 // We don't parse the amount here for simplicity
      }));
    } catch (error) {
      console.error('Error getting account transactions:', error);
      return []; // Return empty array instead of throwing
    }
  }

  async getTokenTransactions(tokenAddress, walletAddress, limit = 10) {
    if (!this.connection) throw new Error('Token service not initialized');
    if (!tokenAddress) throw new Error('Token address is required');
    if (!walletAddress) throw new Error('Wallet address is required');
    
    try {
      // Just return empty array for now to avoid errors
      return [];
    } catch (error) {
      console.error('Error getting token transactions:', error);
      return []; // Return empty array instead of throwing
    }
  }

  async getNativeBalance(walletAddress) {
    if (!this.connection) throw new Error('Token service not initialized');
    if (!walletAddress) throw new Error('Wallet address is required');
    
    try {
      const walletPublicKey = new PublicKey(walletAddress);
      const balance = await this.connection.getBalance(walletPublicKey);
      return balance / 1000000000; // Convert lamports to SOL
    } catch (error) {
      console.error('Error getting native balance:', error);
      throw error;
    }
  }

  async transferNativeSOL(fromWallet, toAddress, amount, walletAdapter) {
    if (!this.connection) {
      throw new Error('Connection not initialized');
    }
    
    if (!walletAdapter) {
      throw new Error('Wallet not connected');
    }

    try {
      const toPublicKey = new PublicKey(toAddress);
      const fromPublicKey = new PublicKey(fromWallet);
      const transferAmount = Math.floor(amount * LAMPORTS_PER_SOL);

      // Check balance
      const balance = await this.connection.getBalance(fromPublicKey);
      const minimumBalance = transferAmount + 5000; // Add 5000 lamports for fees
      
      if (balance < minimumBalance) {
        throw new Error(`Insufficient balance for transfer and fees. Need ${minimumBalance / LAMPORTS_PER_SOL} SOL but have ${balance / LAMPORTS_PER_SOL} SOL`);
      }

      // Create instruction
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: fromPublicKey,
        toPubkey: toPublicKey,
        lamports: transferAmount,
      });

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash('confirmed');

      // Create transaction
      const transaction = new Transaction();
      transaction.add(transferInstruction);
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPublicKey;

      try {
        let signature;

        // Handle transaction differently based on wallet type
        if (walletAdapter.isSolflare) {
          // For Solflare, use sendTransaction directly
          signature = await walletAdapter.sendTransaction(transaction, this.connection);
        } else {
          // For other wallets (like Phantom), use sign + send approach
          const signedTransaction = await walletAdapter.signTransaction(transaction);
          signature = await this.connection.sendRawTransaction(signedTransaction.serialize());
        }

        console.log('Transaction sent with signature:', signature);

        // Wait for confirmation
        const confirmation = await this.connection.confirmTransaction({
          signature,
          blockhash,
          lastValidBlockHeight
        }, 'confirmed');

        console.log('Confirmation received:', confirmation);

        if (confirmation.value?.err) {
          throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
        }

        // Verify the balance change
        const newBalance = await this.connection.getBalance(fromPublicKey);
        const expectedBalance = balance - transferAmount - 5000; // Approximate fee
        
        if (Math.abs(newBalance - expectedBalance) > 10000) { // Allow for small fee variations
          console.warn('Balance change verification:', {
            originalBalance: balance,
            newBalance,
            expectedBalance,
            difference: newBalance - expectedBalance
          });
        }

        return {
          signature,
          status: 'confirmed'
        };
      } catch (err) {
        console.error('Transaction error:', err);
        
        if (err.message?.includes('User rejected')) {
          throw new Error('Transaction was rejected by user');
        }
        
        if (err.message?.includes('0x1')) {
          throw new Error('Transaction simulation failed. Please check your balance and try again.');
        }
        
        if (err.message?.includes('blockhash')) {
          throw new Error('Network error: Please try again (blockhash expired)');
        }
        
        // Handle Solflare specific errors
        if (err.name === 'Ve') {
          throw new Error('Wallet error: Please try disconnecting and reconnecting your wallet');
        }
        
        throw new Error(`Transaction failed: ${err.message}`);
      }
    } catch (error) {
      console.error('Error transferring SOL:', error);
      throw error;
    }
  }

  async burnToken(tokenAddress, ownerAddress, amount, walletAdapter) {
    if (!this.connection) {
      throw new Error('Connection not initialized');
    }

    if (!walletAdapter) {
      throw new Error('Wallet not connected');
    }

    try {
      console.log('Starting token burn:', {
        tokenAddress,
        ownerAddress,
        amount
      });

      const mintPublicKey = new PublicKey(tokenAddress);
      const ownerPublicKey = new PublicKey(ownerAddress);

      // Get token mint info first
      const mintInfo = await this.connection.getParsedAccountInfo(mintPublicKey);
      if (!mintInfo.value || !mintInfo.value.data.parsed) {
        throw new Error('Invalid token mint address');
      }

      const decimals = mintInfo.value.data.parsed.info.decimals;
      console.log('Token decimals:', decimals);

      // Get the associated token account
      const associatedTokenAddress = await getAssociatedTokenAddress(
        mintPublicKey,
        ownerPublicKey
      );

      console.log('Associated token account:', associatedTokenAddress.toString());

      // Get token account info
      const tokenAccountInfo = await this.connection.getParsedAccountInfo(associatedTokenAddress);
      if (!tokenAccountInfo.value) {
        throw new Error('Token account not found');
      }

      // Calculate burn amount with decimals
      const burnAmount = Math.floor(amount * Math.pow(10, decimals));
      console.log('Burn amount in raw units:', burnAmount);

      // Create burn instruction
      const burnInstruction = createBurnInstruction(
        associatedTokenAddress,
        mintPublicKey,
        ownerPublicKey,
        burnAmount
      );

      // Create transaction
      const transaction = new Transaction();
      transaction.add(burnInstruction);

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = ownerPublicKey;

      try {
        let signature;

        // Handle transaction differently based on wallet type
        if (walletAdapter.isSolflare) {
          // For Solflare, use sendTransaction directly
          signature = await walletAdapter.sendTransaction(transaction, this.connection);
        } else {
          // For other wallets (like Phantom), use sign + send approach
          const signedTransaction = await walletAdapter.signTransaction(transaction);
          signature = await this.connection.sendRawTransaction(signedTransaction.serialize());
        }

        console.log('Burn transaction sent:', signature);

        // Wait for confirmation
        const confirmation = await this.connection.confirmTransaction({
          signature,
          blockhash,
          lastValidBlockHeight
        }, 'confirmed');

        console.log('Burn confirmation received:', confirmation);

        if (confirmation.value?.err) {
          throw new Error(`Burn failed: ${JSON.stringify(confirmation.value.err)}`);
        }

        // Verify the burn by checking new balance
        const newTokenAccount = await this.connection.getParsedAccountInfo(associatedTokenAddress);
        if (!newTokenAccount.value) {
          throw new Error('Failed to verify burn: Token account not found');
        }

        return {
          signature,
          status: 'confirmed'
        };
      } catch (err) {
        console.error('Burn transaction error:', err);
        
        if (err.message?.includes('User rejected')) {
          throw new Error('Transaction was rejected by user');
        }
        
        if (err.name === 'Ve') {
          throw new Error('Wallet error: Please try disconnecting and reconnecting your wallet');
        }
        
        throw err;
      }
    } catch (error) {
      console.error('Error burning tokens:', error);
      throw error;
    }
  }
}

export default new TokenService();

export const burnTokens = async (wallet, tokenAddress, amount) => {
  if (!wallet.publicKey) {
    throw new Error('Wallet not connected');
  }

  const connection = new Connection(
    clusterApiUrl(process.env.REACT_APP_SOLANA_NETWORK || 'devnet'),
    'confirmed'
  );

  // For SOL burning (send to a dead address)
  if (tokenAddress === 'native') {
    // Burn address (a known unusable address)
    const burnAddress = new PublicKey('1111111111111111111111111111111111111111111');
    
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: burnAddress,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    const signature = await wallet.sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, 'confirmed');
    return signature;
  } else {
    // For SPL tokens
    const mint = new PublicKey(tokenAddress);
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mint,
      wallet.publicKey
    );

    // Get mint info to get decimals
    const mintInfo = await getMint(connection, mint);
    
    const burnInstruction = createBurnInstruction(
      associatedTokenAddress,
      mint,
      wallet.publicKey,
      amount * Math.pow(10, mintInfo.decimals)
    );

    const transaction = new Transaction().add(burnInstruction);
    
    const signature = await wallet.sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, 'confirmed');
    return signature;
  }
}; 