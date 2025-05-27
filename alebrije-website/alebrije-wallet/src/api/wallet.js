import Web3 from 'web3';
import { ERC20_ABI } from '../constants/abis';

export default class WalletAPI {
  constructor() {
    this.web3 = null;
    this.accounts = [];
    this.connected = false;
    this.tokenContracts = new Map(); // Store token contract instances
  }

  // Connection methods
  async connect(provider) {
    try {
      if (provider) {
        this.web3 = new Web3(provider);
      } else if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.web3 = new Web3(window.ethereum);
      } else {
        throw new Error('No provider found');
      }
      
      this.accounts = await this.web3.eth.getAccounts();
      this.connected = true;
      return this.accounts;
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }

  async disconnect() {
    this.web3 = null;
    this.accounts = [];
    this.connected = false;
    this.tokenContracts.clear();
  }

  // Token interaction methods
  async loadTokenContract(tokenAddress) {
    if (!this.connected) throw new Error('Wallet not connected');
    if (!this.web3.utils.isAddress(tokenAddress)) throw new Error('Invalid token address');
    
    if (!this.tokenContracts.has(tokenAddress)) {
      const contract = new this.web3.eth.Contract(ERC20_ABI, tokenAddress);
      this.tokenContracts.set(tokenAddress, contract);
    }
    
    return this.tokenContracts.get(tokenAddress);
  }

  async getTokenBalance(accountAddress, tokenAddress) {
    const contract = await this.loadTokenContract(tokenAddress);
    const balance = await contract.methods.balanceOf(accountAddress).call();
    return balance;
  }

  async getTokenInfo(tokenAddress) {
    const contract = await this.loadTokenContract(tokenAddress);
    
    try {
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.methods.name().call(),
        contract.methods.symbol().call(),
        contract.methods.decimals().call(),
        contract.methods.totalSupply().call()
      ]);
      
      return { name, symbol, decimals, totalSupply };
    } catch (error) {
      console.error('Error fetching token info:', error);
      throw error;
    }
  }

  async transferToken(fromAddress, toAddress, amount, tokenAddress) {
    const contract = await this.loadTokenContract(tokenAddress);
    
    try {
      const gasEstimate = await contract.methods.transfer(toAddress, amount).estimateGas({
        from: fromAddress
      });
      
      const tx = await contract.methods.transfer(toAddress, amount).send({
        from: fromAddress,
        gas: Math.floor(gasEstimate * 1.2) // Add 20% buffer for gas
      });
      
      return tx;
    } catch (error) {
      console.error('Transfer error:', error);
      throw error;
    }
  }

  // Event monitoring
  subscribeToTokenEvents(tokenAddress, eventName, callback) {
    if (!this.connected) throw new Error('Wallet not connected');
    
    const contract = this.tokenContracts.get(tokenAddress);
    if (!contract) throw new Error('Token contract not loaded');
    
    const eventEmitter = contract.events[eventName]();
    eventEmitter.on('data', event => callback(null, event));
    eventEmitter.on('error', error => callback(error, null));
    
    return () => eventEmitter.unsubscribe(); // Return unsubscribe function
  }

  // Advanced token interactions
  async approveTokenSpending(ownerAddress, spenderAddress, amount, tokenAddress) {
    const contract = await this.loadTokenContract(tokenAddress);
    
    try {
      const tx = await contract.methods.approve(spenderAddress, amount).send({
        from: ownerAddress
      });
      
      return tx;
    } catch (error) {
      console.error('Approval error:', error);
      throw error;
    }
  }

  async getAllowance(ownerAddress, spenderAddress, tokenAddress) {
    const contract = await this.loadTokenContract(tokenAddress);
    const allowance = await contract.methods.allowance(ownerAddress, spenderAddress).call();
    return allowance;
  }
} 