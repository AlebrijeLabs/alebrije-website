import WalletService from './wallet-service';
import TokenService from './token-service';
import config from '../config';
import { handleError, ErrorTypes, AlebrijeError } from '../utils/error-handler';

class TransactionHistoryService {
  constructor() {
    this.transactions = new Map(); // tokenName -> transactions array
    this.isLoading = false;
    this.lastFetchTime = null;
    this.eventSubscriptions = {};
  }
  
  /**
   * Initialize transaction history for a token
   * @param {string} tokenName - Name of the token
   */
  async initialize(tokenName) {
    if (!this.transactions.has(tokenName)) {
      this.transactions.set(tokenName, []);
    }
    
    // Subscribe to token transfer events
    this._subscribeToTransferEvents(tokenName);
    
    // Load initial transaction history
    return this.fetchTransactionHistory(tokenName);
  }
  
  /**
   * Fetch transaction history for a token
   * @param {string} tokenName - Name of the token
   * @param {number} limit - Maximum number of transactions to fetch
   * @returns {Promise<Array>} - Array of transactions
   */
  async fetchTransactionHistory(tokenName, limit = 50) {
    if (!WalletService.isConnected()) {
      throw new AlebrijeError('Wallet not connected', ErrorTypes.WALLET);
    }
    
    const account = WalletService.getCurrentAccount();
    if (!account) {
      throw new AlebrijeError('No account selected', ErrorTypes.WALLET);
    }
    
    this.isLoading = true;
    
    try {
      // Get token info
      const tokenInfo = TokenService.getTokenInfo(tokenName);
      if (!tokenInfo) {
        throw new AlebrijeError(`Token ${tokenName} not found`, ErrorTypes.USER);
      }
      
      // Determine which blockchain to use
      const blockchain = tokenInfo.blockchain || config.DEFAULT_NETWORK.blockchain;
      
      // Fetch transactions based on blockchain
      let transactions = [];
      
      if (blockchain === 'ethereum') {
        transactions = await this._fetchEthereumTransactions(tokenName, account, limit);
      } else if (blockchain === 'solana') {
        transactions = await this._fetchSolanaTransactions(tokenName, account, limit);
      } else {
        throw new AlebrijeError(`Unsupported blockchain: ${blockchain}`, ErrorTypes.UNKNOWN);
      }
      
      // Update the transactions map
      this.transactions.set(tokenName, transactions);
      this.lastFetchTime = new Date();
      
      return transactions;
    } catch (error) {
      throw handleError(error, `Failed to fetch transaction history for ${tokenName}`);
    } finally {
      this.isLoading = false;
    }
  }
  
  /**
   * Get cached transaction history for a token
   * @param {string} tokenName - Name of the token
   * @returns {Array} - Array of transactions
   */
  getTransactionHistory(tokenName) {
    return this.transactions.get(tokenName) || [];
  }
  
  /**
   * Add a new transaction to the history
   * @param {string} tokenName - Name of the token
   * @param {Object} transaction - Transaction object
   */
  addTransaction(tokenName, transaction) {
    if (!this.transactions.has(tokenName)) {
      this.transactions.set(tokenName, []);
    }
    
    const transactions = this.transactions.get(tokenName);
    
    // Check if transaction already exists
    const exists = transactions.some(tx => tx.hash === transaction.hash);
    if (!exists) {
      transactions.unshift(transaction); // Add to the beginning of the array
      this.transactions.set(tokenName, transactions);
    }
  }
  
  /**
   * Clean up resources
   */
  cleanup() {
    // Unsubscribe from all event subscriptions
    Object.values(this.eventSubscriptions).forEach(unsubscribe => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });
    
    this.eventSubscriptions = {};
  }
  
  // Private methods
  
  /**
   * Fetch Ethereum transactions
   * @private
   */
  async _fetchEthereumTransactions(tokenName, account, limit) {
    const tokenAddress = TokenService.getTokenAddress(tokenName);
    
    // Use Etherscan API or similar service to fetch transaction history
    const apiKey = config.API_KEYS?.etherscan;
    const network = config.DEFAULT_NETWORK.network;
    const baseUrl = network === 'mainnet' 
      ? 'https://api.etherscan.io/api' 
      : `https://api-${network}.etherscan.io/api`;
    
    const url = `${baseUrl}?module=account&action=tokentx&contractaddress=${tokenAddress}&address=${account}&sort=desc&limit=${limit}${apiKey ? `&apikey=${apiKey}` : ''}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status !== '1') {
        throw new Error(data.message || 'Failed to fetch transactions');
      }
      
      // Transform the response into our transaction format
      return data.result.map(tx => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: TokenService.formatTokenAmount(tx.value, tokenName),
        timestamp: new Date(parseInt(tx.timeStamp) * 1000),
        blockNumber: parseInt(tx.blockNumber),
        confirmations: parseInt(tx.confirmations),
        isIncoming: tx.to.toLowerCase() === account.toLowerCase(),
        status: 'confirmed'
      }));
    } catch (error) {
      console.error('Error fetching Ethereum transactions:', error);
      
      // If API fails, try to get transactions from events
      return this._getTransactionsFromEvents(tokenName);
    }
  }
  
  /**
   * Fetch Solana transactions
   * @private
   */
  async _fetchSolanaTransactions(tokenName, account, limit) {
    // Implementation for Solana would go here
    // This is a placeholder
    return [];
  }
  
  /**
   * Get transactions from cached events
   * @private
   */
  _getTransactionsFromEvents(tokenName) {
    // This is a fallback method if API calls fail
    return this.transactions.get(tokenName) || [];
  }
  
  /**
   * Subscribe to token transfer events
   * @private
   */
  _subscribeToTransferEvents(tokenName) {
    // Unsubscribe from previous subscription if exists
    if (this.eventSubscriptions[tokenName]) {
      this.eventSubscriptions[tokenName]();
    }
    
    // Subscribe to new events
    const unsubscribe = TokenService.subscribeToTransfers(tokenName, (error, event) => {
      if (error) {
        console.error(`Error in transfer event for ${tokenName}:`, error);
        return;
      }
      
      const account = WalletService.getCurrentAccount();
      if (!account) return;
      
      // Create transaction object from event
      const transaction = {
        hash: event.transactionHash,
        from: event.from,
        to: event.to,
        value: event.value,
        timestamp: new Date(),
        blockNumber: event.blockNumber,
        confirmations: 1,
        isIncoming: event.to.toLowerCase() === account.toLowerCase(),
        status: 'confirmed'
      };
      
      // Add to transaction history
      this.addTransaction(tokenName, transaction);
    });
    
    this.eventSubscriptions[tokenName] = unsubscribe;
  }
}

export default new TransactionHistoryService(); 