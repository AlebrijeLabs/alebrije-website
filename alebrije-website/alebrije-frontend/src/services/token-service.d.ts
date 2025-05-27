import { PublicKey } from '@solana/web3.js';

export function getTokenBalance(
  mintAddress: PublicKey,
  walletAddress: PublicKey
): Promise<number>;

export function transferTokens(
  from: PublicKey,
  to: PublicKey,
  amount: number,
  mint: PublicKey
): Promise<string>;

export function burnTokens(
  owner: PublicKey,
  amount: number,
  mint: PublicKey
): Promise<string>; 