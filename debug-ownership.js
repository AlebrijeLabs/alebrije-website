const { Connection, PublicKey } = require('@solana/web3.js');
const { Token, AccountLayout, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, u64 } = require('@solana/spl-token');

(async () => {
  try {
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const mint = new PublicKey('AHstXMQM3uWETKn3WaztgayZtQhB7iJiPTvqmVi7cbC');
    
    const wallets = {
      Airdrop: 'GviehEcGycFk8W9v6Ft3hysGd42iMPYtRT2KABKWXNph',
      Founders: 'F121WYj8S8MkRirXr7bHWRUAY6vHCekd2k7EGpURD1aN'
    };
    
    console.log('🔍 Checking token account ownership and authorities...\n');
    
    for (const [label, address] of Object.entries(wallets)) {
      console.log(`\n--- ${label} Wallet ---`);
      console.log(`Wallet Address: ${address}`);
      
      const wallet = new PublicKey(address);
      const ata = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mint,
        wallet,
        true
      );
      
      console.log(`ATA Address: ${ata.toString()}`);
      
      const accountInfo = await connection.getAccountInfo(ata);
      if (accountInfo) {
        const accountData = AccountLayout.decode(accountInfo.data);
        const amountBigInt = u64.fromBuffer(accountData.amount);
        const amount = Number(amountBigInt) / Math.pow(10, 9);
        
        console.log(`Token Balance: ${amount.toLocaleString()} ALBJ`);
        console.log(`Token Account Owner: ${new PublicKey(accountData.owner).toString()}`);
        console.log(`Mint: ${new PublicKey(accountData.mint).toString()}`);
        console.log(`Delegate Option: ${accountData.delegateOption}`);
        if (accountData.delegateOption !== 0) {
          console.log(`Delegate: ${new PublicKey(accountData.delegate).toString()}`);
          console.log(`Delegated Amount: ${u64.fromBuffer(accountData.delegatedAmount).toString()}`);
        }
        console.log(`Account State: ${accountData.state}`);
        
        // Check if payer can transfer from this account
        const payerKey = 'F121WYj8S8MkRirXr7bHWRUAY6vHCekd2k7EGpURD1aN';
        const ownerKey = new PublicKey(accountData.owner).toString();
        const canTransfer = ownerKey === payerKey || ownerKey === address;
        console.log(`Can Payer Transfer: ${canTransfer ? '✅ YES' : '❌ NO'} (Owner: ${ownerKey === address ? 'Wallet' : 'Other'})`);
      } else {
        console.log('❌ No token account found');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
})(); 