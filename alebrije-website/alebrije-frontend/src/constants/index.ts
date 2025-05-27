import { PublicKey } from '@solana/web3.js';

// Network Configuration
export const SOLANA_NETWORK = process.env.REACT_APP_SOLANA_NETWORK || 'devnet';
export const SOLANA_RPC_URL = process.env.REACT_APP_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
export const SOLANA_WS_URL = process.env.REACT_APP_SOLANA_WS_URL || 'wss://api.devnet.solana.com';

// Token Configuration
export const TOKEN_MINT_ADDRESS = new PublicKey(
  process.env.REACT_APP_TOKEN_MINT_ADDRESS || 'AHstXMQM3uWETKn3WaztgayZtQhB7iJiPTvqmVi7cbC'
);
export const TOKEN_DECIMALS = Number(process.env.REACT_APP_TOKEN_DECIMALS || '9');
export const TOKEN_TOTAL_SUPPLY = Number(process.env.REACT_APP_TOKEN_TOTAL_SUPPLY || '9000000000');

// Token Distribution (Total: 100%)
export const TOKEN_DISTRIBUTION = {
  SOURCE: Number(process.env.REACT_APP_TOKEN_SOURCE_PERCENTAGE || '15'),      // 15% - Initial token source
  LIQUIDITY: Number(process.env.REACT_APP_TOKEN_LIQUIDITY_PERCENTAGE || '25'), // 25% - For DEX liquidity
  AIRDROP: Number(process.env.REACT_APP_TOKEN_AIRDROP_PERCENTAGE || '10'),    // 10% - For community airdrops
  MARKETING: Number(process.env.REACT_APP_TOKEN_MARKETING_PERCENTAGE || '15'), // 15% - For marketing
  ECOSYSTEM: Number(process.env.REACT_APP_TOKEN_ECOSYSTEM_PERCENTAGE || '20'), // 20% - For ecosystem development
  FOUNDERS: Number(process.env.REACT_APP_TOKEN_FOUNDERS_PERCENTAGE || '15'),   // 15% - For founders
};

// Staking Configuration
export const STAKING_CONFIG = {
  MIN_STAKE_AMOUNT: 1000,                    // Minimum 1,000 ALBJ to stake
  MAX_STAKE_AMOUNT: 1000000,                 // Maximum 1,000,000 ALBJ per wallet
  REWARD_RATE: 0.15,                         // 15% APY
  LOCK_PERIOD: 30 * 24 * 60 * 60,           // 30 days in seconds
  AVAILABLE_FOR_STAKING: 1350000000,        // 1.35B ALBJ available for staking (15% of total supply)
};

// Feature Flags
export const FEATURES = {
  STAKING: process.env.REACT_APP_ENABLE_STAKING === 'true',
  SWAPPING: process.env.REACT_APP_ENABLE_SWAPPING === 'true',
  NFT_SUPPORT: process.env.REACT_APP_ENABLE_NFT_SUPPORT === 'true',
};

// API Configuration
export const API_CONFIG = {
  BACKEND_URL: process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:3001',
  INDEXER_URL: process.env.REACT_APP_INDEXER_API_URL || 'http://localhost:3002',
};

// UI Constants
export const UI = {
  MAX_DECIMALS: 9,
  MIN_DECIMALS: 0,
  DEFAULT_DECIMALS: 9,
  MAX_SUPPLY: 9000000000,
  MIN_SUPPLY: 1,
}; 