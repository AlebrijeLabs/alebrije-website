export class MockProvider {
  constructor() {
    this.accounts = [];
    this.tokens = new Map();
    this.eventHandlers = new Map();
  }
  
  addAccount(address) {
    this.accounts.push(address);
  }
  
  addToken(address, tokenData) {
    this.tokens.set(address, tokenData);
  }
  
  async request({ method }) {
    if (method === 'eth_requestAccounts') {
      return this.accounts;
    }
    throw new Error(`Method ${method} not implemented in mock`);
  }
  
  get eth() {
    return {
      getAccounts: async () => this.accounts,
      Contract: (abi, address) => new MockTokenContract(this, address)
    };
  }
  
  get utils() {
    return {
      isAddress: (address) => /^0x[0-9a-fA-F]{40}$/.test(address),
      toWei: (amount, unit) => {
        if (unit === 'ether') {
          return (parseFloat(amount) * 1e18).toString();
        }
        return amount;
      },
      fromWei: (amount, unit) => {
        if (unit === 'ether') {
          return (parseInt(amount) / 1e18).toString();
        }
        return amount;
      }
    };
  }
  
  emitTokenEvent(tokenAddress, eventName, data) {
    const key = `${tokenAddress}:${eventName}`;
    const handlers = this.eventHandlers.get(key) || [];
    
    handlers.forEach(handler => {
      handler({
        returnValues: data,
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
        blockNumber: Math.floor(Math.random() * 1000000)
      });
    });
  }
  
  registerEventHandler(tokenAddress, eventName, handler) {
    const key = `${tokenAddress}:${eventName}`;
    if (!this.eventHandlers.has(key)) {
      this.eventHandlers.set(key, []);
    }
    this.eventHandlers.get(key).push(handler);
    
    return {
      unsubscribe: () => {
        const handlers = this.eventHandlers.get(key) || [];
        const index = handlers.indexOf(handler);
        if (index >= 0) {
          handlers.splice(index, 1);
        }
      }
    };
  }
} 