// rebalance-founders.js
// Final tokenomics correction script to transfer 450M ALBJ from Marketing to Founders

const {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction
} = require('@solana/web3.js');
const {
  Token,
  AccountLayout,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  u64
} = require('@solana/spl-token');
const fs = require('fs');

(async () => {
  try {
    console.log('🚀 Starting Founders Wallet Rebalance...\n');

    // --- 🔐 Load Keypair ---
    const keypairData = JSON.parse(fs.readFileSync('new-token-keypair.json', 'utf8'));
    const payer = Keypair.fromSecretKey(new Uint8Array(keypairData));
    console.log(`Payer: ${payer.publicKey.toString()}`);

    // --- 🔗 Setup Connection ---
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const mint = new PublicKey('AHstXMQM3uWETKn3WaztgayZtQhB7iJiPTvqmVi7cbC');

    // --- 🎯 Wallets ---
    const marketingWallet = new PublicKey('6t9ADpNhgn1JxjtzzLCooNyiAMAo3rxoqZdoxK34uqY5');
    const foundersWallet = new PublicKey('F121WYj8S8MkRirXr7bHWRUAY6vHCekd2k7EGpURD1aN');

    // --- 🎯 Get Associated Token Accounts ---
    const fromAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      marketingWallet,
      true
    );
    const toAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      foundersWallet,
      true
    );

    // --- 📊 Check Balances BEFORE ---
    console.log('📊 Balances BEFORE transfer:');
    try {
      const fromAccountInfo = await connection.getAccountInfo(fromAccount);
      if (!fromAccountInfo) throw new Error('Account not found');
      const fromBalance = AccountLayout.decode(fromAccountInfo.data);
      console.log(`Marketing: ${Number(fromBalance.amount) / 1e9} ALBJ`);
    } catch (e) {
      console.log('Marketing: No token account found');
      return;
    }

    try {
      const toAccountInfo = await connection.getAccountInfo(toAccount);
      if (!toAccountInfo) throw new Error('Account not found');
      const toBalance = AccountLayout.decode(toAccountInfo.data);
      console.log(`Founders: ${Number(toBalance.amount) / 1e9} ALBJ`);
    } catch (e) {
      console.log('Founders: No token account found - will create');
      // Create founders token account if it doesn't exist
      const token = new Token(connection, mint, Token.TOKEN_PROGRAM_ID, payer);
      const createAccountTx = await token.createAssociatedTokenAccount(foundersWallet);
      console.log('✅ Created founders token account');
    }

    // --- 💸 Execute Transfer ---
    const transferAmount = 450_000_000 * 1e9; // 450M with 9 decimals
    console.log(`\n🔄 Transferring 450,000,000 ALBJ...`);

    const token = new Token(connection, mint, Token.TOKEN_PROGRAM_ID, payer);
    const signature = await token.transfer(
      fromAccount,
      toAccount,
      payer.publicKey,
      [],
      transferAmount
    );

    console.log(`✅ Transfer successful!`);
    console.log(`🔗 Transaction: https://explorer.solana.com/tx/${signature}?cluster=devnet`);

    // --- 📊 Check Balances AFTER ---
    console.log('\n📊 Balances AFTER transfer:');
    const fromAccountInfoAfter = await connection.getAccountInfo(fromAccount);
    const fromBalanceAfter = AccountLayout.decode(fromAccountInfoAfter.data);
    const toAccountInfoAfter = await connection.getAccountInfo(toAccount);
    const toBalanceAfter = AccountLayout.decode(toAccountInfoAfter.data);
    
    console.log(`Marketing: ${Number(fromBalanceAfter.amount) / 1e9} ALBJ`);
    console.log(`Founders: ${Number(toBalanceAfter.amount) / 1e9} ALBJ`);

    // --- ✅ Verify Tokenomics ---
    console.log('\n🎯 Final Tokenomics Verification:');
    const marketingFinal = Number(fromBalanceAfter.amount) / 1e9;
    const foundersFinal = Number(toBalanceAfter.amount) / 1e9;
    
    console.log(`Marketing: ${marketingFinal} (should be ~900M) ${marketingFinal >= 899_000_000 && marketingFinal <= 901_000_000 ? '✅' : '❌'}`);
    console.log(`Founders: ${foundersFinal} (should be ~450M) ${foundersFinal >= 449_000_000 && foundersFinal <= 451_000_000 ? '✅' : '❌'}`);

    console.log('\n🎉 Tokenomics rebalance completed successfully!');

  } catch (err) {
    console.error('❌ Error during rebalance:', err.message);
    console.error('Full error:', err);
  }
})(); 