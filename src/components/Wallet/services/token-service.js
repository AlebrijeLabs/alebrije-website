import WalletService from './wallet-service';
import config from '../config/index.js';

class TokenService {
  constructor() {
    this.walletService = WalletService;
    this.tokenAddresses = config.TOKEN_ADDRESSES || {};
    this.tokenInfo = {};
    this.eventSubscriptions = {};
  }
  
  async initialize() {
    if (!this.walletService.isConnected()) {
      throw new Error('Wallet must be connected before initializing token service');
    }
    
    // Load information for all configured tokens
    await Promise.all(
      Object.entries(this.tokenAddresses).map(async ([tokenName, address]) => {
        try {
          const info = await this.walletService.api.getTokenInfo(address);
          this.tokenInfo[tokenName] = {
            address,
            ...info
          };
        } catch (error) {
          console.error(`Failed to load token info for ${tokenName}:`, error);
        }
      })
    );
    
    return this.tokenInfo;
  }
  
  async getBalance(tokenName, accountAddress) {
    const address = this.getTokenAddress(tokenName);
    const account = accountAddress || this.walletService.getCurrentAccount();
    
    if (!account) throw new Error('No account specified');
    
    const balance = await this.walletService.api.getTokenBalance(account, address);
    return this.formatTokenAmount(balance, tokenName);
  }
  
  async transfer(tokenName, toAddress, amount) {
    const tokenAddress = this.getTokenAddress(tokenName);
    const fromAddress = this.walletService.getCurrentAccount();
    
    if (!fromAddress) throw new Error('No account connected');
    
    // Convert human-readable amount to token units
    const decimals = this.tokenInfo[tokenName]?.decimals || 18;
    const amountInWei = this.walletService.api.web3.utils.toWei(
      amount.toString(), 
      decimals === 18 ? 'ether' : 'wei'
    );
    
    try {
      const tx = await this.walletService.api.transferToken(
        fromAddress,
        toAddress,
        amountInWei,
        tokenAddress
      );
      
      return {
        transactionHash: tx.transactionHash,
        status: tx.status,
        blockNumber: tx.blockNumber
      };
    } catch (error) {
      console.error('Transfer failed:', error);
      throw error;
    }
  }
  
  // Helper to monitor token transfers
  subscribeToTransfers(tokenName, callback) {
    const tokenAddress = this.getTokenAddress(tokenName);
    
    // Unsubscribe from previous subscription if exists
    if (this.eventSubscriptions[tokenName]) {
      this.eventSubscriptions[tokenName]();
    }
    
    const unsubscribe = this.walletService.api.subscribeToTokenEvents(
      tokenAddress,
      'Transfer',
      (error, event) => {
        if (error) {
          callback(error, null);
          return;
        }
        
        const { from, to, value } = event.returnValues;
        const formattedValue = this.formatTokenAmount(value, tokenName);
        
        callback(null, {
          from,
          to,
          value: formattedValue,
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber
        });
      }
    );
    
    this.eventSubscriptions[tokenName] = unsubscribe;
    return unsubscribe;
  }
  
  // Helper methods
  getTokenAddress(tokenName) {
    const address = this.tokenAddresses[tokenName];
    if (!address) throw new Error(`Token ${tokenName} not configured`);
    return address;
  }
  
  formatTokenAmount(amount, tokenName) {
    const decimals = this.tokenInfo[tokenName]?.decimals || 18;
    if (decimals === 18) {
      return this.walletService.api.web3.utils.fromWei(amount, 'ether');
    } else {
      // Handle non-standard decimals
      return (parseInt(amount) / Math.pow(10, decimals)).toString();
    }
  }
}

export default new TokenService(); 