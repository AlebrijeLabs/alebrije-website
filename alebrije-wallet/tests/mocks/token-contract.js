export class MockTokenContract {
  constructor(provider, address) {
    this.provider = provider;
    this.address = address;
    this.tokenData = provider.tokens.get(address);
  }
  
  get methods() {
    return {
      name: () => ({
        call: async () => this.tokenData.name
      }),
      
      symbol: () => ({
        call: async () => this.tokenData.symbol
      }),
      
      decimals: () => ({
        call: async () => this.tokenData.decimals.toString()
      }),
      
      totalSupply: () => ({
        call: async () => this.tokenData.totalSupply
      }),
      
      balanceOf: (address) => ({
        call: async () => this.tokenData.balanceOf[address] || '0'
      }),
      
      transfer: (to, amount) => ({
        estimateGas: async () => 21000,
        send: async ({ from }) => {
          // Update balances
          if (!this.tokenData.balanceOf[from] || 
              BigInt(this.tokenData.balanceOf[from]) < BigInt(amount)) {
            throw new Error('Insufficient balance');
          }
          
          this.tokenData.balanceOf[from] = (
            BigInt(this.tokenData.balanceOf[from]) - BigInt(amount)
          ).toString();
          
          if (!this.tokenData.balanceOf[to]) {
            this.tokenData.balanceOf[to] = '0';
          }
          
          this.tokenData.balanceOf[to] = (
            BigInt(this.tokenData.balanceOf[to]) + BigInt(amount)
          ).toString();
          
          const tx = {
            transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
            status: true,
            blockNumber: Math.floor(Math.random() * 1000000)
          };
          
          // Emit transfer event
          this.provider.emitTokenEvent(this.address, 'Transfer', {
            from,
            to,
            value: amount
          });
          
          return tx;
        }
      }),
      
      approve: (spender, amount) => ({
        send: async ({ from }) => {
          if (!this.tokenData.allowances) {
            this.tokenData.allowances = {};
          }
          
          if (!this.tokenData.allowances[from]) {
            this.tokenData.allowances[from] = {};
          }
          
          this.tokenData.allowances[from][spender] = amount;
          
          return {
            transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
            status: true,
            blockNumber: Math.floor(Math.random() * 1000000)
          };
        }
      }),
      
      allowance: (owner, spender) => ({
        call: async () => {
          if (!this.tokenData.allowances || 
              !this.tokenData.allowances[owner] ||
              !this.tokenData.allowances[owner][spender]) {
            return '0';
          }
          return this.tokenData.allowances[owner][spender];
        }
      })
    };
  }
  
  get events() {
    return {
      Transfer: (options) => {
        const eventEmitter = {
          on: (event, handler) => {
            if (event === 'data') {
              this.provider.registerEventHandler(
                this.address,
                'Transfer',
                handler
              );
            }
          }
        };
        return eventEmitter;
      },
      
      Approval: (options) => {
        const eventEmitter = {
          on: (event, handler) => {
            if (event === 'data') {
              this.provider.registerEventHandler(
                this.address,
                'Approval',
                handler
              );
            }
          }
        };
        return eventEmitter;
      }
    };
  }
} 