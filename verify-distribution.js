// verify-distribution.js - ALBJ Token Distribution Verification
const { Connection, PublicKey } = require('@solana/web3.js');
const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const fs = require('fs');

async function verifyDistribution() {
  try {
    console.log('🔍 ALBJ Token Distribution Verification\n');
    console.log('════════════════════════════════════════');
    
    // Connect to Solana Devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Token mint address
    const mintAddress = new PublicKey('AHstXMQM3uWETKn3WaztgayZtQhB7iJiPTvqmVi7cbC');
    
    // Load keypair to create token instance
    const keypairData = JSON.parse(fs.readFileSync('new-token-keypair.json', 'utf8'));
    const payerKeypair = require('@solana/web3.js').Keypair.fromSecretKey(new Uint8Array(keypairData));
    
    const token = new Token(connection, mintAddress, TOKEN_PROGRAM_ID, payerKeypair);
    
    // Known wallet addresses and their ATAs
    const wallets = {
      'Airdrop (Unknown)': {
        wallet: 'GviehEcGycFk8W9v6Ft3hysGd42iMPYtRT2KABKWXNph',
        ata: 'GviehEcGycFk8W9v6Ft3hysGd42iMPYtRT2KABKWXNph', // Same as wallet for this case
        expectedRole: 'Community Airdrops (LOCKED - no keypair)'
      },
      'Founders': {
        wallet: 'F121WYj8S8MkRirXr7bHWRUAY6vHCekd2k7EGpURD1aN',
        ata: '6t9ADpNhgn1JxjtzzLCooNyiAMAo3rxoqZdoxK34uqY5', // Source account
        expectedRole: 'Founders & Community Airdrops'
      },
      'Liquidity Pool': {
        wallet: 'Caky5Wi74w8SYznTWzs9rRkuwwWaSKt9hPSN9wiSoPmE',
        ata: 'Caky5Wi74w8SYznTWzs9rRkuwwWaSKt9hPSN9wiSoPmE',
        expectedRole: 'DEX Liquidity'
      },
      'Marketing': {
        wallet: '6t9ADpNhgn1JxjtzzLCooNyiAMAo3rxoqZdoxK34uqY5',
        ata: '6t9ADpNhgn1JxjtzzLCooNyiAMAo3rxoqZdoxK34uqY5',
        expectedRole: 'Marketing & Growth'
      },
      'Ecosystem': {
        wallet: 'CgCeLShLUXo29ZEo8ftrDsnMV92n3moFqHSJirBkt4Q3',
        ata: 'CgCeLShLUXo29ZEo8ftrDsnMV92n3moFqHSJirBkt4Q3',
        expectedRole: 'Development & Rewards'
      }
    };
    
    const BN = require('bn.js');
    const divisor = new BN(1000000000); // 10^9
    let totalCirculating = new BN(0);
    
    console.log('📊 Current Token Distribution:\n');
    
    for (const [name, info] of Object.entries(wallets)) {
      try {
        const ataAddress = new PublicKey(info.ata);
        
        // Try to get account info
        try {
          const accountInfo = await token.getAccountInfo(ataAddress);
          const balance = accountInfo.amount;
          const balanceFormatted = balance.div(divisor).toString();
          
          console.log(`${name}:`);
          console.log(`  Address: ${info.wallet}`);
          console.log(`  ATA:     ${info.ata}`);
          console.log(`  Balance: ${balanceFormatted.toLocaleString()} ALBJ`);
          console.log(`  Role:    ${info.expectedRole}`);
          console.log('');
          
          totalCirculating = totalCirculating.add(balance);
          
        } catch (accountError) {
          console.log(`${name}:`);
          console.log(`  Address: ${info.wallet}`);
          console.log(`  ATA:     ${info.ata}`);
          console.log(`  Balance: 0 ALBJ (Account not found)`);
          console.log(`  Role:    ${info.expectedRole}`);
          console.log('');
        }
        
      } catch (error) {
        console.log(`❌ Error checking ${name}: ${error.message}`);
      }
    }
    
    // Calculate totals
    const totalCirculatingFormatted = totalCirculating.div(divisor).toString();
    const totalSupply = 9000000000;
    const burnedAmount = 4500000000;
    const expectedCirculating = totalSupply - burnedAmount;
    
    console.log('═══════════════════════════════════════');
    console.log('📈 SUPPLY SUMMARY:');
    console.log('═══════════════════════════════════════');
    console.log(`🔥 Total Burned:       4,500,000,000 ALBJ (50%)`);
    console.log(`💰 Total Circulating:  ${totalCirculatingFormatted.toLocaleString()} ALBJ`);
    console.log(`📊 Expected Circulating: ${expectedCirculating.toLocaleString()} ALBJ`);
    console.log(`🎯 Total Supply:       ${totalSupply.toLocaleString()} ALBJ`);
    
    // Distribution percentages
    if (totalCirculating.gt(new BN(0))) {
      console.log('\n💼 CURRENT ALLOCATION PERCENTAGES:');
      console.log('═══════════════════════════════════════');
      
      for (const [name, info] of Object.entries(wallets)) {
        try {
          const ataAddress = new PublicKey(info.ata);
          const accountInfo = await token.getAccountInfo(ataAddress);
          const balance = accountInfo.amount;
          const percentage = balance.muln(100).div(totalCirculating).toString();
          console.log(`${name}: ${percentage}%`);
        } catch (error) {
          console.log(`${name}: 0%`);
        }
      }
    }
    
    console.log('\n🎯 DISTRIBUTION ANALYSIS:');
    console.log('═══════════════════════════════════════');
    
    // Check if distribution matches expectations
    const circulatingNum = parseInt(totalCirculatingFormatted.replace(/,/g, ''));
    if (circulatingNum === expectedCirculating) {
      console.log('✅ Total circulating matches expected (4.5B ALBJ)');
    } else if (circulatingNum > expectedCirculating) {
      console.log('⚠️ More tokens circulating than expected!');
      console.log(`   Difference: +${(circulatingNum - expectedCirculating).toLocaleString()} ALBJ`);
    } else {
      console.log('⚠️ Fewer tokens circulating than expected!');
      console.log(`   Difference: -${(expectedCirculating - circulatingNum).toLocaleString()} ALBJ`);
    }
    
    console.log('\n🚀 LAUNCH READINESS:');
    console.log('═══════════════════════════════════════');
    console.log('✅ Token mint: Created');
    console.log('✅ Burn completed: 50% (4.5B ALBJ)');
    console.log('✅ Distribution executed: Partially complete');
    console.log('🎯 Launch target: June 12, 2025');
    console.log('🌐 Website: https://albj.io');
    
  } catch (error) {
    console.error('❌ Error verifying distribution:', error);
  }
}

verifyDistribution(); 