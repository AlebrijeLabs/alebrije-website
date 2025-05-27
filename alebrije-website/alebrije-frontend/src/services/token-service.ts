import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync, createTransferInstruction, createBurnInstruction } from '@solana/spl-token';

export interface TokenBalance {
  amount: number;
  decimals: number;
}

export async function getTokenBalance(mintAddress: PublicKey, walletAddress: PublicKey): Promise<TokenBalance> {
  try {
    const connection = new Connection(process.env.REACT_APP_SOLANA_RPC_URL || 'https://api.devnet.solana.com');
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletAddress, {
      mint: mintAddress,
    });

    if (tokenAccounts.value.length === 0) {
      return { amount: 0, decimals: 9 };
    }

    const { amount, decimals } = tokenAccounts.value[0].account.data.parsed.info.tokenAmount;
    return { amount: Number(amount), decimals };
  } catch (error) {
    console.error('Error getting token balance:', error);
    throw error;
  }
}

export async function transferTokens(
  from: PublicKey,
  to: PublicKey,
  amount: number,
  mint: PublicKey,
  connection: Connection
): Promise<string> {
  try {
    const fromATA = getAssociatedTokenAddressSync(mint, from);
    const toATA = getAssociatedTokenAddressSync(mint, to);
    
    const transaction = new Transaction().add(
      createTransferInstruction(
        fromATA,
        toATA,
        from,
        amount,
        [],
        TOKEN_PROGRAM_ID
      )
    );

    // Note: This needs to be signed and sent by the wallet
    return transaction.serialize().toString('base64');
  } catch (error) {
    console.error('Error transferring tokens:', error);
    throw error;
  }
}

export async function burnTokens(
  owner: PublicKey,
  amount: number,
  mint: PublicKey,
  connection: Connection
): Promise<string> {
  try {
    const ownerATA = getAssociatedTokenAddressSync(mint, owner);
    
    const transaction = new Transaction().add(
      createBurnInstruction(
        ownerATA,
        mint,
        owner,
        amount,
        [],
        TOKEN_PROGRAM_ID
      )
    );

    // Note: This needs to be signed and sent by the wallet
    return transaction.serialize().toString('base64');
  } catch (error) {
    console.error('Error burning tokens:', error);
    throw error;
  }
} 