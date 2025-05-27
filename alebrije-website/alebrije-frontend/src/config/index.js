/**
 * Alebrije Project Configuration
 */

// Network configurations
const NETWORKS = {
  ethereum: {
    mainnet: {
      name: 'Ethereum Mainnet',
      chainId: 1,
      rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
      blockExplorer: 'https://etherscan.io'
    },
    goerli: {
      name: 'Goerli Testnet',
      chainId: 5,
      rpcUrl: 'https://goerli.infura.io/v3/YOUR_INFURA_KEY',
      blockExplorer: 'https://goerli.etherscan.io'
    }
  },
  solana: {
    mainnet: {
      name: 'Solana Mainnet',
      cluster: 'mainnet-beta',
      rpcUrl: 'https://api.mainnet-beta.solana.com',
      blockExplorer: 'https://explorer.solana.com'
    },
    devnet: {
      name: 'Solana Devnet',
      cluster: 'devnet',
      rpcUrl: 'https://api.devnet.solana.com',
      blockExplorer: 'https://explorer.solana.com/?cluster=devnet'
    }
  }
};

// Default network settings
const DEFAULT_NETWORK = {
  blockchain: 'solana',
  network: 'devnet'
};

// Token configurations
const TOKEN_ADDRESSES = {
  // Ethereum tokens
  AlebrijeETH: {
    address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', // Uniswap V2 Router address for testing
    blockchain: 'ethereum'
  },
  // Solana tokens
  AlebrijeSOL: {
    address: 'AHstXMQM3uWETKn3WaztgayZtQhB7iJiPTvqmVi7cbC', // Alebrije token mint address on Solana devnet
    blockchain: 'solana'
  }
};

// API endpoints
const API_ENDPOINTS = {
  backend: 'https://api.alebrije.io',
  indexer: 'https://indexer.alebrije.io'
};

// Feature flags
const FEATURES = {
  staking: true,
  swapping: false,
  nftSupport: false
};

// Export configuration
export default {
  NETWORKS,
  DEFAULT_NETWORK,
  TOKEN_ADDRESSES,
  API_ENDPOINTS,
  FEATURES
}; 