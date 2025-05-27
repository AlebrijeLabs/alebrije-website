import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export async function getWalletBalance(walletAddress: PublicKey): Promise<number> {
  try {
    const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com');
    const balance = await connection.getBalance(walletAddress);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    throw error;
  }
}

export async function getWalletTokens(walletAddress: PublicKey): Promise<Array<{mint: PublicKey, amount: number}>> {
  try {
    const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com');
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletAddress, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
    });

    return tokenAccounts.value.map(account => ({
      mint: new PublicKey(account.account.data.parsed.info.mint),
      amount: account.account.data.parsed.info.tokenAmount.uiAmount,
    }));
  } catch (error) {
    console.error('Error getting wallet tokens:', error);
    throw error;
  }
} 