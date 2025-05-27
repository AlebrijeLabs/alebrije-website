import { PublicKey } from '@solana/web3.js';

export interface TokenInfo {
  mint: PublicKey;
  decimals: number;
  supply: number;
  authority: PublicKey | null;
}

export interface WalletInfo {
  publicKey: PublicKey;
  balance: number;
}

export interface TokenBalance {
  mint: PublicKey;
  amount: number;
  decimals: number;
}

export interface TransactionResult {
  signature: string;
  status: 'success' | 'error';
  error?: string;
}

export interface TokenTransferParams {
  from: PublicKey;
  to: PublicKey;
  amount: number;
  mint: PublicKey;
}

export interface TokenBurnParams {
  owner: PublicKey;
  amount: number;
  mint: PublicKey;
}

export interface TokenCreateParams {
  decimals: number;
  initialSupply: number;
  mintAuthority: PublicKey;
  freezeAuthority?: PublicKey;
} 