import WalletAPI from '@alebrije/wallet-api';

class WalletService {
  constructor() {
    this.api = new WalletAPI();
    this.connected = false;
    this.accounts = [];
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
  
  // Additional wallet methods...
}

export default new WalletService(); 