# 🧪 ALBJ Test Mode Setup Guide

## 🎯 **Overview**

ALBJ now supports **dual-mode operation**:
- **Normal Mode**: Professional pre-launch experience for users
- **Test Mode**: Hidden devnet functionality for testing real token operations

## 🔧 **Activation**

### **Enable Test Mode**
Add `?testmode=true` to your URL:
```
http://localhost:5173/?testmode=true
```

### **Disable Test Mode**
Remove the parameter or use `?testmode=false`:
```
http://localhost:5173/
```

## 🔍 **Visual Indicators**

When test mode is active, you'll see:
- 🧪 **"TEST MODE ACTIVE"** indicator in top-right corner
- **Different modal titles** showing "🧪 TEST MODE" prefix
- **Console messages** confirming test mode activation

## ⚙️ **Required Setup**

### **1. Create Test Token on Devnet**

Currently using placeholder mint address. To create actual test tokens:

```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.16.0/install)"

# Create keypair for token mint
solana-keygen new --outfile ~/test-albj-mint.json

# Switch to devnet
solana config set --url https://api.devnet.solana.com

# Airdrop SOL for operations
solana airdrop 2

# Create SPL token
spl-token create-token ~/test-albj-mint.json

# Create token account
spl-token create-account <MINT_ADDRESS>

# Mint test tokens
spl-token mint <MINT_ADDRESS> 1000000
```

### **2. Update Token Mint Address**

Edit `src/utils/tokenOperations.ts`:
```typescript
export const TEST_ALBJ_MINT = new PublicKey('YOUR_ACTUAL_DEVNET_MINT_ADDRESS');
```

## 🚀 **Feature Comparison**

| Feature | Normal Mode | Test Mode |
|---------|-------------|-----------|
| **Burn Tokens** | Pre-launch modal | Real burning functionality |
| **Transfer Tokens** | Pre-launch modal | Real transfer functionality |
| **History** | Pre-launch modal | Real transaction history |
| **Settings** | Pre-launch modal | Pre-launch modal (same) |
| **Network** | Mainnet display | Devnet operations |
| **Balance** | "Available June 12, 2025" | Real token balance |

## 🧪 **Test Mode Features**

### **🔥 Burn Tokens Modal**
- Shows current token balance
- Input field for amount to burn
- Real-time burning with transaction confirmation
- Balance updates after successful burn
- Error handling for insufficient funds

### **🚀 Transfer Tokens Modal**
- Shows current token balance
- Input fields for recipient address and amount
- Real transaction processing
- Transaction signature display
- Balance updates after successful transfer

### **📋 Transaction History Modal**
- Displays last 10 transactions
- Shows transaction signatures, blocks, and timestamps
- Real-time loading from blockchain

## 🔒 **Security Features**

### **URL-Based Activation**
- Test mode only accessible via URL parameter
- No permanent settings or toggles
- Easy to control access

### **Network Separation**
- Test mode uses Devnet
- Normal mode displays Mainnet
- Complete separation of operations

### **Error Handling**
- Comprehensive error messages
- Transaction failure recovery
- Network-specific error handling

## 📝 **Testing Workflow**

### **Basic Testing**
1. **Start dev server**: `npm run dev`
2. **Enable test mode**: Add `?testmode=true` to URL
3. **Connect wallet**: Use Phantom (switch to Devnet)
4. **Test operations**: Use burn/transfer/history buttons

### **Advanced Testing**
1. **Create multiple wallets** for transfer testing
2. **Test edge cases** (insufficient funds, invalid addresses)
3. **Verify transaction signatures** on Solana Explorer (Devnet)
4. **Test network switching** behavior

## 🐛 **Troubleshooting**

### **"No ALBJ tokens found in wallet"**
- Switch Phantom to Devnet
- Ensure you have test ALBJ tokens
- Check token mint address is correct

### **Transaction failures**
- Ensure sufficient SOL for gas fees
- Check network connection
- Verify wallet is on Devnet

### **Test mode not activating**
- Check URL parameter spelling: `?testmode=true`
- Clear browser cache
- Check console for activation messages

## 🔄 **Production Deployment**

### **Hide Test Mode**
For production, you can:
1. **Remove test mode code** entirely
2. **Add environment variable** to control availability
3. **Use build-time flags** to exclude test features

### **Environment Variables**
```env
VITE_ENABLE_TEST_MODE=false
```

Then in code:
```typescript
const canUseTestMode = import.meta.env.VITE_ENABLE_TEST_MODE === 'true';
```

## 📋 **Testing Checklist**

- [ ] Test mode activates with URL parameter
- [ ] Visual indicator appears
- [ ] Burn modal opens and processes transactions
- [ ] Transfer modal works with valid addresses
- [ ] History modal shows transaction data
- [ ] Normal mode still shows pre-launch modals
- [ ] Wallet connect/disconnect works in both modes
- [ ] Network display is appropriate for each mode

## 🚨 **Important Notes**

1. **Test tokens have no value** - they're for testing only
2. **Use Devnet only** - never test with mainnet tokens
3. **Keep test mode secret** - don't share ?testmode=true URLs publicly
4. **Monitor gas costs** - even on devnet, operations cost SOL
5. **Test thoroughly** before mainnet launch

## 🎉 **Ready to Test!**

Your ALBJ website now supports:
- ✅ Professional pre-launch experience
- ✅ Hidden testing functionality
- ✅ Real token operations on devnet
- ✅ Seamless mode switching
- ✅ Complete feature separation 