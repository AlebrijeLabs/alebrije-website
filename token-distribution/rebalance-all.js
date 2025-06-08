// rebalance-all.js
// Comprehensive script to redistribute 4.5B ALBJ tokens to match final tokenomics

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
    console.log('🚀 Starting Comprehensive ALBJ Token Rebalancing...\n');

    // --- 🔐 Load Keypair ---
    const keypairData = JSON.parse(fs.readFileSync('new-token-keypair.json', 'utf8'));
    const payer = Keypair.fromSecretKey(new Uint8Array(keypairData));
    console.log(`Payer: ${payer.publicKey.toString()}\n`);

    // --- 🔗 Setup Connection ---
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const mint = new PublicKey('AHstXMQM3uWETKn3WaztgayZtQhB7iJiPTvqmVi7cbC');
    const decimals = 9;

    // --- 🎯 Wallet Addresses ---
    const wallets = {
      Liquidity: new PublicKey('Caky5Wi74w8SYznTWzs9rRkuwwWaSKt9hPSN9wiSoPmE'),
      Airdrop: new PublicKey('GviehEcGycFk8W9v6Ft3hysGd42iMPYtRT2KABKWXNph'),
      Marketing: new PublicKey('6t9ADpNhgn1JxjtzzLCooNyiAMAo3rxoqZdoxK34uqY5'),
      Ecosystem: new PublicKey('CgCeLShLUXo29ZEo8ftrDsnMV92n3moFqHSJirBkt4Q3'),
      Founders: new PublicKey('F121WYj8S8MkRirXr7bHWRUAY6vHCekd2k7EGpURD1aN')
    };

    // --- 📊 Target Distribution (after rebalancing) ---
    const targetBalances = {
      Liquidity: 1_800_000_000,  // 40% of circulating
      Airdrop: 900_000_000,      // 20% of circulating  
      Marketing: 900_000_000,    // 20% of circulating
      Ecosystem: 450_000_000,    // 10% of circulating
      Founders: 450_000_000      // 10% of circulating
    };

    // --- 💸 Transfers to execute ---
    // FROM Airdrop (3.15B) TO others:
    const transfersFromAirdrop = [
      { to: 'Liquidity', amount: 1_800_000_000 },
      { to: 'Marketing', amount: 900_000_000 },
      { to: 'Ecosystem', amount: 450_000_000 }
      // After these transfers: Airdrop will have 3.15B - 3.15B = 0, need to get 900M back
    ];
    
    // FROM Founders (1.35B) TO Airdrop:
    const transfersFromFounders = [
      { to: 'Airdrop', amount: 900_000_000 }
      // After this transfer: Founders will have 1.35B - 900M = 450M (target)
      // And Airdrop will have 0 + 900M = 900M (target)
    ];

    // --- 🔍 Step 1: Check and Create ATAs ---
    console.log('🔍 Step 1: Checking and creating Associated Token Accounts...\n');
    
    const tokenAccounts = {};
    for (const [label, wallet] of Object.entries(wallets)) {
      try {
        const ata = await Token.getAssociatedTokenAddress(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          mint,
          wallet,
          true
        );
        
        const accountInfo = await connection.getAccountInfo(ata);
        if (!accountInfo) {
          console.log(`${label}: No ATA found - creating ATA using payer...`);
          try {
            // Create ATA using createAssociatedTokenAccountInstruction for PDAs
            const createAccountInstruction = Token.createAssociatedTokenAccountInstruction(
              ASSOCIATED_TOKEN_PROGRAM_ID,
              TOKEN_PROGRAM_ID,
              mint,
              ata,
              wallet,
              payer.publicKey
            );
            
            const transaction = new Transaction().add(createAccountInstruction);
            const signature = await sendAndConfirmTransaction(connection, transaction, [payer]);
            
            console.log(`${label}: ✅ ATA created at ${ata.toString()}`);
            console.log(`${label}: 🔗 Creation tx: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
          } catch (createError) {
            console.log(`${label}: ❌ Failed to create ATA: ${createError.message}`);
            console.log(`${label}: 🛑 Cannot proceed without ATA`);
            return;
          }
        } else {
          console.log(`${label}: ✅ ATA exists at ${ata.toString()}`);
        }
        
        tokenAccounts[label] = ata;
             } catch (error) {
         console.error(`${label}: ❌ Critical error with ATA: ${error.message}`);
         console.log(`${label}: 🛑 Stopping script - please check wallet address`);
         return;
       }
    }

    // --- 📊 Step 2: Check Current Balances ---
    console.log('\n📊 Step 2: Current balances BEFORE rebalancing...\n');
    
    const currentBalances = {};
    for (const [label, ata] of Object.entries(tokenAccounts)) {
      try {
        const accountInfo = await connection.getAccountInfo(ata);
        if (accountInfo) {
          const accountData = AccountLayout.decode(accountInfo.data);
          const amountBigInt = u64.fromBuffer(accountData.amount);
          const amount = Number(amountBigInt) / Math.pow(10, decimals);
          currentBalances[label] = amount;
          console.log(`${label.padEnd(10)}: ${amount.toLocaleString().padStart(15)} ALBJ`);
        } else {
          currentBalances[label] = 0;
          console.log(`${label.padEnd(10)}: ${String(0).padStart(15)} ALBJ`);
        }
      } catch (error) {
        currentBalances[label] = 0;
        console.log(`${label.padEnd(10)}: ${'Error'.padStart(15)}`);
      }
    }

    const totalBefore = Object.values(currentBalances).reduce((sum, amount) => sum + amount, 0);
    console.log(`${'TOTAL'.padEnd(10)}: ${totalBefore.toLocaleString().padStart(15)} ALBJ\n`);

    // --- 💸 Step 3: Execute Transfers ---
    console.log('💸 Step 3: Executing transfers...\n');

    const token = new Token(connection, mint, TOKEN_PROGRAM_ID, payer);
    
    // Step 3a: Transfers FROM Airdrop wallet
    console.log('📤 Step 3a: Transfers FROM Airdrop wallet:\n');
    for (const transfer of transfersFromAirdrop) {
      try {
        console.log(`🔄 Transferring ${transfer.amount.toLocaleString()} ALBJ to ${transfer.to}...`);
        
        const fromAccount = tokenAccounts.Airdrop;
        const toAccount = tokenAccounts[transfer.to];
        const transferAmount = transfer.amount * Math.pow(10, decimals);
        
        const signature = await token.transfer(
          fromAccount,
          toAccount,
          payer.publicKey,
          [],
          transferAmount
        );
        
        console.log(`✅ Transfer successful!`);
        console.log(`   🔗 Transaction: https://explorer.solana.com/tx/${signature}?cluster=devnet\n`);
        
        // Brief pause between transfers
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ Transfer to ${transfer.to} failed: ${error.message}\n`);
        return;
      }
    }
    
    // Step 3b: Transfers FROM Founders wallet
    console.log('📤 Step 3b: Transfers FROM Founders wallet:\n');
    for (const transfer of transfersFromFounders) {
      try {
        console.log(`🔄 Transferring ${transfer.amount.toLocaleString()} ALBJ to ${transfer.to}...`);
        
        const fromAccount = tokenAccounts.Founders;
        const toAccount = tokenAccounts[transfer.to];
        const transferAmount = transfer.amount * Math.pow(10, decimals);
        
        const signature = await token.transfer(
          fromAccount,
          toAccount,
          payer.publicKey,
          [],
          transferAmount
        );
        
        console.log(`✅ Transfer successful!`);
        console.log(`   🔗 Transaction: https://explorer.solana.com/tx/${signature}?cluster=devnet\n`);
        
        // Brief pause between transfers
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ Transfer to ${transfer.to} failed: ${error.message}\n`);
        return;
      }
    }

    // --- 📊 Step 4: Verify Final Balances ---
    console.log('📊 Step 4: Final balances AFTER rebalancing...\n');
    
    const finalBalances = {};
    let allCorrect = true;
    
    for (const [label, ata] of Object.entries(tokenAccounts)) {
      try {
        const accountInfo = await connection.getAccountInfo(ata);
        if (accountInfo) {
          const accountData = AccountLayout.decode(accountInfo.data);
          const amountBigInt = u64.fromBuffer(accountData.amount);
          const amount = Number(amountBigInt) / Math.pow(10, decimals);
          finalBalances[label] = amount;
          
          const target = targetBalances[label];
          const isCorrect = Math.abs(amount - target) < 1000; // Allow small rounding
          const status = isCorrect ? '✅' : '❌';
          
          if (!isCorrect) allCorrect = false;
          
          console.log(`${label.padEnd(10)}: ${amount.toLocaleString().padStart(15)} ALBJ ${status}`);
          if (!isCorrect) {
            console.log(`${' '.repeat(12)}Target: ${target.toLocaleString()} ALBJ`);
          }
        } else {
          finalBalances[label] = 0;
          console.log(`${label.padEnd(10)}: ${String(0).padStart(15)} ALBJ ❌`);
          allCorrect = false;
        }
      } catch (error) {
        console.log(`${label.padEnd(10)}: ${'Error'.padStart(15)} ❌`);
        allCorrect = false;
      }
    }

    const totalAfter = Object.values(finalBalances).reduce((sum, amount) => sum + amount, 0);
    console.log(`${'TOTAL'.padEnd(10)}: ${totalAfter.toLocaleString().padStart(15)} ALBJ\n`);

    // --- 🎯 Step 5: Final Validation ---
    console.log('🎯 Final Tokenomics Validation:');
    console.log('═'.repeat(50));
    
    console.log(`🔥 Burned Tokens:      4,500,000,000 ALBJ (50%)`);
    console.log(`🔄 Circulating:        ${totalAfter.toLocaleString()} ALBJ (${((totalAfter/9_000_000_000)*100).toFixed(1)}%)`);
    console.log(`🎯 Total Supply:       9,000,000,000 ALBJ (100%)\n`);
    
    console.log('📊 Distribution Breakdown:');
    console.log('═'.repeat(50));
    for (const [label, amount] of Object.entries(finalBalances)) {
      const percentage = totalAfter > 0 ? ((amount / totalAfter) * 100).toFixed(1) : '0.0';
      const target = targetBalances[label];
      const status = Math.abs(amount - target) < 1000 ? '✅' : '❌';
      console.log(`${label.padEnd(10)}: ${percentage.padStart(5)}% (${amount.toLocaleString()} ALBJ) ${status}`);
    }
    
    console.log('\n🎯 Compliance Check:');
    console.log('═'.repeat(50));
    console.log(`✅ All balances correct: ${allCorrect ? 'YES' : 'NO'} ${allCorrect ? '✅' : '❌'}`);
    console.log(`✅ Ready for mainnet: ${allCorrect ? 'YES' : 'NO'} ${allCorrect ? '✅' : '❌'}`);
    
    if (allCorrect) {
      console.log('\n🎉 Tokenomics rebalancing completed successfully!');
      console.log('🚀 All wallets have correct token distribution!');
      console.log('✅ Project is ready for mainnet deployment!');
    } else {
      console.log('\n⚠️  Some balances are incorrect - review above');
    }

  } catch (err) {
    console.error('❌ Error during rebalancing:', err.message);
    console.error('Full error:', err);
  }
})(); 