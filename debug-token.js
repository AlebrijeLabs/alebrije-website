const { Connection, PublicKey } = require('@solana/web3.js');
const { Token, AccountLayout, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, u64 } = require('@solana/spl-token');

(async () => {
  try {
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const mint = new PublicKey('AHstXMQM3uWETKn3WaztgayZtQhB7iJiPTvqmVi7cbC');
    const wallet = new PublicKey('GviehEcGycFk8W9v6Ft3hysGd42iMPYtRT2KABKWXNph'); // Airdrop
    
    console.log('Getting ATA...');
    const ata = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      wallet,
      true
    );
    console.log('ATA:', ata.toString());
    
    console.log('Getting account info...');
    const accountInfo = await connection.getAccountInfo(ata);
    console.log('Account exists:', !!accountInfo);
    
    if (accountInfo) {
      console.log('Data length:', accountInfo.data.length);
      console.log('Owner:', accountInfo.owner.toString());
      console.log('Attempting decode...');
      const accountData = AccountLayout.decode(accountInfo.data);
      console.log('Decoded data structure:', Object.keys(accountData));
      console.log('Amount field:', accountData.amount);
      console.log('Amount type:', typeof accountData.amount);
      console.log('Amount toString:', accountData.amount ? accountData.amount.toString() : 'undefined');
      
      // Try different ways to get the amount
      if (accountData.amount && accountData.amount.toNumber) {
        console.log('Amount via toNumber():', accountData.amount.toNumber());
      }
      if (accountData.amount && accountData.amount.toString) {
        console.log('Amount via toString():', accountData.amount.toString());
      }
      
      // Try u64 conversion
      try {
        const amountBigInt = u64.fromBuffer(accountData.amount);
        console.log('Amount via u64.fromBuffer():', amountBigInt.toString());
        const amountNumber = Number(amountBigInt) / Math.pow(10, 9);
        console.log('Amount as tokens:', amountNumber);
      } catch (e) {
        console.log('u64 conversion failed:', e.message);
      }
    } else {
      console.log('No account found - this is normal if tokens were never sent to this wallet');
    }
  } catch (error) {
    console.error('FULL ERROR MESSAGE:');
    console.error(error.message);
    console.error('FULL ERROR OBJECT:');
    console.error(error);
  }
})(); 