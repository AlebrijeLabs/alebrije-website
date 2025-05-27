import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export async function getTokenBalance(mintAddress: PublicKey, walletAddress: PublicKey): Promise<number> {
  try {
    const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com');
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletAddress, {
      mint: mintAddress,
    });

    if (tokenAccounts.value.length === 0) {
      return 0;
    }

    const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
    return balance;
  } catch (error) {
    console.error('Error getting token balance:', error);
    throw error;
  }
}

export async function transferTokens(from: PublicKey, to: PublicKey, amount: number, mint: PublicKey): Promise<string> {
  try {
    const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com');
    // Implementation for token transfer
    // This is a placeholder - actual implementation would use @solana/spl-token
    throw new Error('Transfer not implemented yet');
  } catch (error) {
    console.error('Error transferring tokens:', error);
    throw error;
  }
}

export async function burnTokens(owner: PublicKey, amount: number, mint: PublicKey): Promise<string> {
  try {
    const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com');
    // Implementation for token burning
    // This is a placeholder - actual implementation would use @solana/spl-token
    throw new Error('Burn not implemented yet');
  } catch (error) {
    console.error('Error burning tokens:', error);
    throw error;
  }
} 