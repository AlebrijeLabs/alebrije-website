import WalletAPI from '@alebrije/wallet-api';
import config from '../config/index.js';

class WalletService {
  constructor() {
    this.api = new WalletAPI();
    this.connected = false;
    this.accounts = [];
    this.network = config.DEFAULT_NETWORK;
  }
  
  async connect() {
    try {
      await this.api.connect();
      this.connected = true;
      this.accounts = await this.api.getAccounts();
      return true;
    } catch (error) {
      console.error('Connection failed:', error);
      return false;
    }
  }

  async disconnect() {
    try {
      await this.api.disconnect();
      this.connected = false;
      this.accounts = [];
      return true;
    } catch (error) {
      console.error('Disconnection failed:', error);
      return false;
    }
  }

  isConnected() {
    return this.connected;
  }

  getAccounts() {
    return this.accounts;
  }

  getCurrentAccount() {
    return this.accounts[0];
  }

  async switchNetwork(network) {
    if (this.connected) {
      throw new Error('Please disconnect wallet before switching networks');
    }
    this.network = network;
    return true;
  }

  // Additional wallet methods...
}

export default new WalletService(); 