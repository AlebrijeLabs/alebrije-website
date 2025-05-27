# Alebrije Token (ALBJ) Documentation

## Token Contract Details

### Basic Information
- **Token Name**: Alebrije Token
- **Symbol**: ALBJ
- **Decimals**: 9
- **Total Supply**: 9,000,000,000 ALBJ
- **Network**: Solana (Devnet/Mainnet)
- **Token Address**: `AHstXMQM3uWETKn3WaztgayZtQhB7iJiPTvqmVi7cbC`

### Authority Settings
- **Mint Authority**: Not set (public token)
- **Freeze Authority**: Not set (public token)

### Token Distribution
Total Supply: 9,000,000,000 ALBJ
1. Source Account: 1,350,000,000 (15%)
   - Purpose: Initial distribution and development
   - Address: [Source Account Address]

2. Liquidity Wallet: 3,150,000,000 (35%)
   - Purpose: DEX liquidity pools
   - Address: [Liquidity Wallet Address]

3. Airdrop Wallet: 1,350,000,000 (15%)
   - Purpose: Community airdrops and rewards
   - Address: [Airdrop Wallet Address]

4. Marketing Wallet: 3,150,000,000 (35%)
   - Purpose: Marketing and partnerships
   - Address: [Marketing Wallet Address]

5. Ecosystem Wallet: 1,350,000,000 (15%)
   - Purpose: Ecosystem development
   - Address: [Ecosystem Wallet Address]

6. Founders Wallet: 3,150,000,000 (35%)
   - Purpose: Team allocation
   - Address: [Founders Wallet Address]

### Network Configuration

#### Devnet
- RPC URL: https://api.devnet.solana.com
- WebSocket URL: wss://api.devnet.solana.com
- Explorer: https://explorer.solana.com/?cluster=devnet

#### Mainnet
- RPC URL: https://api.mainnet-beta.solana.com
- WebSocket URL: wss://api.mainnet-beta.solana.com
- Explorer: https://explorer.solana.com

### Transaction Examples

#### Transfer Tokens
```bash
spl-token transfer <TOKEN_ADDRESS> <AMOUNT> <RECIPIENT_ADDRESS> --url devnet
```

#### Check Balance
```bash
spl-token balance <TOKEN_ADDRESS> --url devnet
```

#### Create Token Account
```bash
spl-token create-account <TOKEN_ADDRESS> --url devnet
```

### Security Considerations
1. Never share private keys or seed phrases
2. Always verify transaction details before signing
3. Use hardware wallets for large amounts
4. Keep backup of wallet information in secure location

### Development Guidelines
1. Always test on devnet first
2. Use proper error handling
3. Implement rate limiting
4. Follow Solana best practices

### Support
For technical support or questions about the token contract, please contact:
- Email: support@alebrije.io
- Discord: [Discord Link]
- Twitter: [@AlebrijeToken] 