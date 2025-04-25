import WalletAPI from '../src/api/wallet';
import { MockProvider } from './mocks/provider';
import { MockTokenContract } from './mocks/token-contract';

describe('Wallet-Token Integration', () => {
  let walletApi;
  let mockProvider;
  const TEST_TOKEN_ADDRESS = '0x1234567890123456789012345678901234567890';
  const TEST_ACCOUNT = '0x0987654321098765432109876543210987654321';
  
  beforeEach(() => {
    mockProvider = new MockProvider();
    mockProvider.addAccount(TEST_ACCOUNT);
    mockProvider.addToken(TEST_TOKEN_ADDRESS, {
      name: 'Test Token',
      symbol: 'TST',
      decimals: 18,
      totalSupply: '1000000000000000000000000',
      balanceOf: {
        [TEST_ACCOUNT]: '100000000000000000000' // 100 tokens
      }
    });
    
    walletApi = new WalletAPI();
  });
  
  test('should connect to provider and load accounts', async () => {
    await walletApi.connect(mockProvider);
    expect(walletApi.connected).toBe(true);
    expect(walletApi.accounts).toContain(TEST_ACCOUNT);
  });
  
  test('should load token contract', async () => {
    await walletApi.connect(mockProvider);
    const contract = await walletApi.loadTokenContract(TEST_TOKEN_ADDRESS);
    expect(contract).toBeDefined();
    expect(walletApi.tokenContracts.has(TEST_TOKEN_ADDRESS)).toBe(true);
  });
  
  test('should get token balance', async () => {
    await walletApi.connect(mockProvider);
    const balance = await walletApi.getTokenBalance(TEST_ACCOUNT, TEST_TOKEN_ADDRESS);
    expect(balance).toBe('100000000000000000000'); // 100 tokens in wei
  });
  
  test('should get token info', async () => {
    await walletApi.connect(mockProvider);
    const info = await walletApi.getTokenInfo(TEST_TOKEN_ADDRESS);
    expect(info.name).toBe('Test Token');
    expect(info.symbol).toBe('TST');
    expect(info.decimals).toBe('18');
    expect(info.totalSupply).toBe('1000000000000000000000000');
  });
  
  test('should transfer tokens', async () => {
    const RECIPIENT = '0xabcdef1234567890abcdef1234567890abcdef12';
    const AMOUNT = '10000000000000000000'; // 10 tokens
    
    await walletApi.connect(mockProvider);
    const tx = await walletApi.transferToken(
      TEST_ACCOUNT,
      RECIPIENT,
      AMOUNT,
      TEST_TOKEN_ADDRESS
    );
    
    expect(tx.status).toBe(true);
    expect(tx.transactionHash).toBeDefined();
    
    // Verify balances after transfer
    const senderBalance = await walletApi.getTokenBalance(TEST_ACCOUNT, TEST_TOKEN_ADDRESS);
    expect(senderBalance).toBe('90000000000000000000'); // 90 tokens
    
    const recipientBalance = await walletApi.getTokenBalance(RECIPIENT, TEST_TOKEN_ADDRESS);
    expect(recipientBalance).toBe('10000000000000000000'); // 10 tokens
  });
  
  test('should subscribe to token events', (done) => {
    walletApi.connect(mockProvider).then(() => {
      walletApi.loadTokenContract(TEST_TOKEN_ADDRESS).then(() => {
        const unsubscribe = walletApi.subscribeToTokenEvents(
          TEST_TOKEN_ADDRESS,
          'Transfer',
          (error, event) => {
            if (error) {
              done(error);
              return;
            }
            
            expect(event.returnValues.from).toBe(TEST_ACCOUNT);
            expect(event.returnValues.to).toBe('0x1111111111111111111111111111111111111111');
            expect(event.returnValues.value).toBe('5000000000000000000'); // 5 tokens
            
            unsubscribe();
            done();
          }
        );
        
        // Trigger a transfer event
        mockProvider.emitTokenEvent(TEST_TOKEN_ADDRESS, 'Transfer', {
          from: TEST_ACCOUNT,
          to: '0x1111111111111111111111111111111111111111',
          value: '5000000000000000000'
        });
      });
    });
  });
}); 