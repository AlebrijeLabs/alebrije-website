import { PublicKey } from '@solana/web3.js';

export function getWalletBalance(walletAddress: PublicKey): Promise<number>;
export function getWalletTokens(walletAddress: PublicKey): Promise<Array<{mint: PublicKey, amount: number}>>; 