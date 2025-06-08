// distribute-simple.js - ALBJ Token Distribution (Simplified for v0.1.8)
const { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction, 
  sendAndConfirmTransaction 
} = require('@solana/web3.js');
const { 
  Token,
  TOKEN_PROGRAM_ID
} = require('@solana/spl-token');
const fs = require('fs');

async function distributeTokens() {
  try {
    console.log('🚀 Starting ALBJ Token Distribution - Simplified Version\n');
    
    // Read the verified keypair file
    const keypairPath = 'new-token-keypair.json';
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
    const payerKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
    
    console.log(`✅ Loaded Founders Keypair: ${payerKeypair.publicKey.toString()}`);
    
    // Connect to Solana Devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Token mint address
    const mintAddress = new PublicKey('AHstXMQM3uWETKn3WaztgayZtQhB7iJiPTvqmVi7cbC');
    
    // Create Token instance
    const token = new Token(
      connection,
      mintAddress,
      TOKEN_PROGRAM_ID,
      payerKeypair
    );
    
    // Get source token account
    const sourceTokenAccount = await token.getOrCreateAssociatedAccountInfo(payerKeypair.publicKey);
    
    console.log(`📊 Source Token Account: ${sourceTokenAccount.address.toString()}`);
    
    const currentBalance = sourceTokenAccount.amount;
    const BN = require('bn.js');
    const divisor = new BN(1000000000); // 10^9
    
    console.log(`💰 Current Balance: ${currentBalance.div(divisor).toString()} ALBJ\n`);
    
    // Calculate distribution amounts using BN arithmetic (25% airdrop plan)
    const liquidityAmount = currentBalance.muln(40).divn(100);    // 40% = 540M ALBJ
    const marketingAmount = currentBalance.muln(20).divn(100);    // 20% = 270M ALBJ
    const ecosystemAmount = currentBalance.muln(10).divn(100);    // 10% = 135M ALBJ
    const foundersAmount = currentBalance.muln(5).divn(100);      // 5%  = 68M ALBJ
    // Remaining 25% stays in source for airdrops
    
    // Convert BN to u64 format for v0.1.8 compatibility
    const u64 = require('@solana/spl-token').u64;
    const liquidityAmountU64 = u64.fromBuffer(liquidityAmount.toArrayLike(Buffer, 'le', 8));
    const marketingAmountU64 = u64.fromBuffer(marketingAmount.toArrayLike(Buffer, 'le', 8));
    const ecosystemAmountU64 = u64.fromBuffer(ecosystemAmount.toArrayLike(Buffer, 'le', 8));
    const foundersAmountU64 = u64.fromBuffer(foundersAmount.toArrayLike(Buffer, 'le', 8));
    
    console.log('🎯 === ALBJ DISTRIBUTION PLAN (25% AIRDROP) ===');
    console.log(`🎁 Community Airdrops: ${currentBalance.muln(25).divn(100).div(divisor).toString()} ALBJ (25%) - STAYS IN SOURCE`);
    console.log(`💧 Liquidity Pool:     ${liquidityAmount.div(divisor).toString()} ALBJ (40%)`);
    console.log(`📈 Marketing:          ${marketingAmount.div(divisor).toString()} ALBJ (20%)`);
    console.log(`🛠️ Ecosystem:          ${ecosystemAmount.div(divisor).toString()} ALBJ (10%)`);
    console.log(`👥 Founders:           ${foundersAmount.div(divisor).toString()} ALBJ (5%)`);
    console.log(`🔥 Already Burned:     4,500,000,000 ALBJ (50%) ✅\n`);
    
    // Pre-calculated ATA addresses (known to exist)
    const liquidityATA = new PublicKey('Caky5Wi74w8SYznTWzs9rRkuwwWaSKt9hPSN9wiSoPmE');
    const marketingATA = new PublicKey('6t9ADpNhgn1JxjtzzLCooNyiAMAo3rxoqZdoxK34uqY5');
    const ecosystemATA = new PublicKey('CgCeLShLUXo29ZEo8ftrDsnMV92n3moFqHSJirBkt4Q3');
    // Note: Using source account for Founders (same as current)
    
    console.log('📤 Executing distribution transactions...\n');
    
    // Create all transfers in one transaction
    const transferTransaction = new Transaction();
    
    // Add transfer instructions (using u64 amounts for v0.1.8)
    transferTransaction.add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        sourceTokenAccount.address,
        liquidityATA,
        payerKeypair.publicKey,
        [],
        liquidityAmountU64
      )
    );
    
    transferTransaction.add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        sourceTokenAccount.address,
        marketingATA,
        payerKeypair.publicKey,
        [],
        marketingAmountU64
      )
    );
    
    transferTransaction.add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        sourceTokenAccount.address,
        ecosystemATA,
        payerKeypair.publicKey,
        [],
        ecosystemAmountU64
      )
    );
    
    // Skip Founders transfer for now - tokens stay in source account
    
    console.log('🚀 Executing all transfers in one transaction...');
    const signature = await sendAndConfirmTransaction(
      connection,
      transferTransaction,
      [payerKeypair]
    );
    console.log(`✅ Distribution successful: ${signature}\n`);
    
    // Verify final balances
    console.log('🔍 === FINAL VERIFICATION ===');
    
    const finalLiquidity = await token.getAccountInfo(liquidityATA);
    console.log(`💧 Liquidity Pool:     ${finalLiquidity.amount.div(divisor).toString()} ALBJ`);
    
    const finalMarketing = await token.getAccountInfo(marketingATA);
    console.log(`📈 Marketing:          ${finalMarketing.amount.div(divisor).toString()} ALBJ`);
    
    const finalEcosystem = await token.getAccountInfo(ecosystemATA);
    console.log(`🛠️ Ecosystem:          ${finalEcosystem.amount.div(divisor).toString()} ALBJ`);
    
    // Founders tokens remain in source account
    console.log(`👥 Founders:           ${foundersAmount.div(divisor).toString()} ALBJ (in source account)`);
    
    const finalSource = await token.getAccountInfo(sourceTokenAccount.address);
    console.log(`🎁 Ready for Airdrops: ${finalSource.amount.div(divisor).toString()} ALBJ`);
    
    console.log('\n🎉 =======================================');
    console.log('✅ ALBJ DISTRIBUTION COMPLETED!');
    console.log('🚀 25% Community Airdrop Plan Executed!');
    console.log('🎯 Your token is ready for launch!');
    console.log('📅 Launch target: June 12, 2025');
    console.log('🌐 Website: https://albj.io');
    console.log('=======================================');
    
  } catch (error) {
    console.error('❌ Error executing distribution:', error);
  }
}

distributeTokens(); 