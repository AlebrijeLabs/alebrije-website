// execute-distribution.js - ALBJ Token Distribution with 25% Community Airdrops
const { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction, 
  sendAndConfirmTransaction 
} = require('@solana/web3.js');
const { 
  Token,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} = require('@solana/spl-token');
const fs = require('fs');

async function executeDistribution() {
  try {
    console.log('🚀 Starting ALBJ Token Distribution - 25% Community Airdrops Plan\n');
    
    // Read the verified keypair file
    const keypairPath = 'new-token-keypair.json';
    if (!fs.existsSync(keypairPath)) {
      throw new Error('Keypair file not found at: ' + keypairPath);
    }
    
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
    const payerKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
    
    console.log(`✅ Loaded Founders Keypair: ${payerKeypair.publicKey.toString()}`);
    
    // Connect to Solana Devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Token mint address
    const mintAddress = new PublicKey('AHstXMQM3uWETKn3WaztgayZtQhB7iJiPTvqmVi7cbC');
    
    // Create Token instance (compatible with v0.1.8)
    const token = new Token(
      connection,
      mintAddress,
      TOKEN_PROGRAM_ID,
      payerKeypair
    );
    
    // Target wallet addresses
    const airdropWallet = new PublicKey('GviehEcGycFk8W9v6Ft3hysGd42iMPYtRT2KABKWXNph'); // Create new ATA for airdrops
    const liquidityWallet = new PublicKey('Caky5Wi74w8SYznTWzs9rRkuwwWaSKt9hPSN9wiSoPmE');
    const marketingWallet = new PublicKey('6t9ADpNhgn1JxjtzzLCooNyiAMAo3rxoqZdoxK34uqY5');
    const ecosystemWallet = new PublicKey('CgCeLShLUXo29ZEo8ftrDsnMV92n3moFqHSJirBkt4Q3');
    const foundersWallet = new PublicKey('F121WYj8S8MkRirXr7bHWRUAY6vHCekd2k7EGpURD1aN');
    
    // Get source token account
    const sourceTokenAccount = await token.getOrCreateAssociatedAccountInfo(payerKeypair.publicKey);
    
    console.log(`📊 Source Token Account: ${sourceTokenAccount.address.toString()}`);
    console.log(`💰 Current Balance: ${(sourceTokenAccount.amount.div(new (require('bn.js'))(1000000000)).toString())} ALBJ\n`);
    
    const currentBalance = sourceTokenAccount.amount; // Keep as BN object
    
    // Calculate distribution amounts using BN arithmetic (25% airdrop plan)
    const airdropAmount = currentBalance.muln(25).divn(100);      // 25% = 337M ALBJ
    const liquidityAmount = currentBalance.muln(40).divn(100);    // 40% = 540M ALBJ
    const marketingAmount = currentBalance.muln(20).divn(100);    // 20% = 270M ALBJ
    const ecosystemAmount = currentBalance.muln(10).divn(100);    // 10% = 135M ALBJ
    const foundersAmount = currentBalance.muln(5).divn(100);      // 5%  = 68M ALBJ
    
    console.log('🎯 === ALBJ DISTRIBUTION PLAN (25% AIRDROP) ===');
    const BN = require('bn.js');
    const divisor = new BN(1000000000); // 10^9
    console.log(`🎁 Community Airdrops: ${airdropAmount.div(divisor).toString()} ALBJ (25%)`);
    console.log(`💧 Liquidity Pool:     ${liquidityAmount.div(divisor).toString()} ALBJ (40%)`);
    console.log(`📈 Marketing:          ${marketingAmount.div(divisor).toString()} ALBJ (20%)`);
    console.log(`🛠️ Ecosystem:          ${ecosystemAmount.div(divisor).toString()} ALBJ (10%)`);
    console.log(`👥 Founders:           ${foundersAmount.div(divisor).toString()} ALBJ (5%)`);
    console.log(`🔥 Already Burned:     4,500,000,000 ALBJ (50%) ✅\n`);
    
    // Create or get associated token accounts (handles PDAs)
    async function getOrCreateTokenAccount(wallet, label) {
      try {
        console.log(`🔧 Setting up ${label} token account...`);
        
        // Calculate the ATA address (v0.1.8 compatible)
        const ata = await Token.getAssociatedTokenAddress(
          mintAddress,
          wallet
        );
        
        try {
          // Check if ATA already exists
          await token.getAccountInfo(ata);
          console.log(`✅ ${label} ATA exists: ${ata.toString()}`);
          return ata;
        } catch (error) {
          // ATA doesn't exist, create it
          console.log(`🔧 Creating ${label} ATA: ${ata.toString()}`);
          
          const createAtaTransaction = new Transaction().add(
            Token.createAssociatedTokenAccountInstruction(
              payerKeypair.publicKey, // payer
              ata,                    // associatedToken
              wallet,                 // owner  
              mintAddress            // mint
            )
          );
          
          await sendAndConfirmTransaction(connection, createAtaTransaction, [payerKeypair]);
          console.log(`✅ ${label} ATA created successfully`);
          return ata;
        }
      } catch (error) {
        console.error(`❌ Error setting up ${label} account:`, error.message);
        throw error;
      }
    }
    
    // Set up all token accounts
    console.log('🔧 Setting up destination token accounts...');
    
    // Note: We'll create a new token account for community airdrops rather than using the locked one
    const airdropTokenAccount = await getOrCreateTokenAccount(payerKeypair.publicKey, 'Community Airdrop (temp)');
    const liquidityTokenAccount = await getOrCreateTokenAccount(liquidityWallet, 'Liquidity');
    const marketingTokenAccount = await getOrCreateTokenAccount(marketingWallet, 'Marketing');
    const ecosystemTokenAccount = await getOrCreateTokenAccount(ecosystemWallet, 'Ecosystem');
    const foundersTokenAccount = await getOrCreateTokenAccount(foundersWallet, 'Founders');
    
    console.log('\n🚀 Executing distribution transactions...\n');
    
    // Execute transfers in batches
    
    // Batch 1: Liquidity and Marketing
    console.log('📤 Batch 1: Liquidity and Marketing transfers...');
    const batch1Transaction = new Transaction();
    
    batch1Transaction.add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        sourceTokenAccount.address,
        liquidityTokenAccount,
        payerKeypair.publicKey,
        [],
        liquidityAmount
      )
    );
    
    batch1Transaction.add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        sourceTokenAccount.address,
        marketingTokenAccount,
        payerKeypair.publicKey,
        [],
        marketingAmount
      )
    );
    
    const batch1Signature = await sendAndConfirmTransaction(
      connection,
      batch1Transaction,
      [payerKeypair]
    );
    console.log(`✅ Batch 1 successful: ${batch1Signature}\n`);
    
    // Batch 2: Ecosystem and Founders
    console.log('📤 Batch 2: Ecosystem and Founders transfers...');
    const batch2Transaction = new Transaction();
    
    batch2Transaction.add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        sourceTokenAccount.address,
        ecosystemTokenAccount,
        payerKeypair.publicKey,
        [],
        ecosystemAmount
      )
    );
    
    batch2Transaction.add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        sourceTokenAccount.address,
        foundersTokenAccount,
        payerKeypair.publicKey,
        [],
        foundersAmount
      )
    );
    
    const batch2Signature = await sendAndConfirmTransaction(
      connection,
      batch2Transaction,
      [payerKeypair]
    );
    console.log(`✅ Batch 2 successful: ${batch2Signature}\n`);
    
    // Note: Keep airdrop tokens in source for now (337M ALBJ ready for community distribution)
    console.log('🎁 Community Airdrop tokens remain in source account for distribution');
    
    // Verify final balances
    console.log('🔍 === FINAL VERIFICATION ===');
    
    const liquidityInfo = await token.getAccountInfo(liquidityTokenAccount);
    console.log(`💧 Liquidity Pool:     ${liquidityInfo.amount.div(divisor).toString()} ALBJ`);
    
    const marketingInfo = await token.getAccountInfo(marketingTokenAccount);
    console.log(`📈 Marketing:          ${marketingInfo.amount.div(divisor).toString()} ALBJ`);
    
    const ecosystemInfo = await token.getAccountInfo(ecosystemTokenAccount);
    console.log(`🛠️ Ecosystem:          ${ecosystemInfo.amount.div(divisor).toString()} ALBJ`);
    
    const foundersInfo = await token.getAccountInfo(foundersTokenAccount);
    console.log(`👥 Founders:           ${foundersInfo.amount.div(divisor).toString()} ALBJ`);
    
    // Check remaining in source (should be airdrop amount)
    const finalSourceInfo = await token.getAccountInfo(sourceTokenAccount.address);
    console.log(`🎁 Ready for Airdrops: ${finalSourceInfo.amount.div(divisor).toString()} ALBJ`);
    
    console.log('\n🎉 =======================================');
    console.log('✅ ALBJ DISTRIBUTION COMPLETED!');
    console.log('🚀 25% Community Airdrop Plan Executed!');
    console.log('🎯 Your token is ready for launch!');
    console.log('📅 Launch target: June 12, 2025');
    console.log('🌐 Website: https://albj.io');
    console.log('=======================================');
    
  } catch (error) {
    console.error('❌ Error executing distribution:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('- Ensure you have enough SOL for transaction fees');
    console.log('- Check internet connection to Devnet');
    console.log('- Verify all wallet addresses are valid');
  }
}

// Execute the distribution
executeDistribution(); 