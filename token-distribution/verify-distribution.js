// verify-distribution.js
// Verification script to check actual token balances and validate tokenomics compliance

const {
  Connection,
  PublicKey
} = require('@solana/web3.js');
const {
  Token,
  AccountLayout,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  u64
} = require('@solana/spl-token');

(async () => {
  try {
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const mint = new PublicKey('AHstXMQM3uWETKn3WaztgayZtQhB7iJiPTvqmVi7cbC');
    const decimals = 9;

    // ALBJ Wallet Addresses
    const wallets = {
      Liquidity:     'Caky5Wi74w8SYznTWzs9rRkuwwWaSKt9hPSN9wiSoPmE',
      Airdrop:       'GviehEcGycFk8W9v6Ft3hysGd42iMPYtRT2KABKWXNph', 
      Marketing:     '6t9ADpNhgn1JxjtzzLCooNyiAMAo3rxoqZdoxK34uqY5',
      Ecosystem:     'CgCeLShLUXo29ZEo8ftrDsnMV92n3moFqHSJirBkt4Q3',
      Founders:      'F121WYj8S8MkRirXr7bHWRUAY6vHCekd2k7EGpURD1aN'
    };

    // Expected distribution (post-burn)
    const expected = {
      Liquidity:  1_800_000_000,
      Airdrop:      900_000_000,
      Marketing:    900_000_000,
      Ecosystem:    450_000_000,
      Founders:     450_000_000
    };

    console.log('🔍 Verifying ALBJ Token Distribution...\n');
    
    // First check if token mint exists
    console.log('🔍 Checking token mint...');
    try {
      const mintInfo = await connection.getAccountInfo(mint);
      if (!mintInfo) {
        console.log('❌ Token mint not found on devnet!');
        console.log('💡 The token might be on mainnet instead of devnet');
        console.log('💡 Or the token address might be incorrect');
        return;
      }
      console.log('✅ Token mint found on devnet');
    } catch (error) {
      console.log('❌ Error checking token mint:', error.message);
      return;
    }

    console.log('\n📊 Current Wallet Balances:');
    console.log('═'.repeat(50));

    let totalCirculating = 0;
    let allCorrect = true;

    for (const [label, address] of Object.entries(wallets)) {
      try {
        const wallet = new PublicKey(address);
        
        // Get associated token address using v0.1.8 syntax
        const ata = await Token.getAssociatedTokenAddress(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          mint,
          wallet,
          true // allowOwnerOffCurve - set to true to handle all wallet types
        );

        // Check if account exists and get info
        const accountInfo = await connection.getAccountInfo(ata);
        if (!accountInfo) {
          console.log(`${label.padEnd(12)} → ${'No account found'.padStart(15)} ❌`);
          allCorrect = false;
          continue;
        }

        // Parse account data
        const accountData = AccountLayout.decode(accountInfo.data);
        const amountBigInt = u64.fromBuffer(accountData.amount);
        const amount = Number(amountBigInt) / Math.pow(10, decimals);
        totalCirculating += amount;

        // Check if amount matches expected
        const expectedAmount = expected[label];
        const isCorrect = Math.abs(amount - expectedAmount) < 1000; // Allow small rounding differences
        const status = isCorrect ? '✅' : '❌';
        
        if (!isCorrect) allCorrect = false;

        console.log(`${label.padEnd(12)} → ${amount.toLocaleString().padStart(15)} ALBJ ${status}`);
        if (!isCorrect) {
          console.log(`${' '.repeat(15)}Expected: ${expectedAmount.toLocaleString()} ALBJ`);
        }
      } catch (error) {
        console.log(`${label.padEnd(12)} → ${'Error: ' + error.message.substring(0, 20)}`);
        allCorrect = false;
      }
    }

    console.log('═'.repeat(50));
    console.log(`${'TOTAL'.padEnd(12)} → ${totalCirculating.toLocaleString().padStart(15)} ALBJ`);

    // Verification Summary
    console.log('\n🧮 Tokenomics Summary:');
    console.log('═'.repeat(50));
    console.log(`🔥 Burned Tokens:          4,500,000,000 ALBJ (50%)`);
    console.log(`🔄 Circulating Supply:     ${totalCirculating.toLocaleString()} ALBJ (50%)`);
    console.log(`🎯 Original Total Supply:  9,000,000,000 ALBJ (100%)`);

    // Distribution Percentages (of circulating supply)
    if (totalCirculating > 0) {
      console.log('\n📊 Distribution Breakdown (% of circulating):');
      console.log('═'.repeat(50));
      for (const [label, address] of Object.entries(wallets)) {
        try {
          const wallet = new PublicKey(address);
          const ata = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            mint,
            wallet,
            true // allowOwnerOffCurve - set to true to handle all wallet types
          );
          const accountInfo = await connection.getAccountInfo(ata);
          if (!accountInfo) {
            console.log(`${label.padEnd(12)} → ${'0.0%'.padStart(6)} (No account)`);
            continue;
          }
          
          const accountData = AccountLayout.decode(accountInfo.data);
          const amountBigInt = u64.fromBuffer(accountData.amount);
          const amount = Number(amountBigInt) / Math.pow(10, decimals);
          const percentage = ((amount / totalCirculating) * 100).toFixed(1);
          console.log(`${label.padEnd(12)} → ${percentage.padStart(6)}% (${amount.toLocaleString()} ALBJ)`);
        } catch (error) {
          console.log(`${label.padEnd(12)} → ${'0.0%'.padStart(6)} (Error)`);
        }
      }
    }

    // Final Verification
    console.log('\n🎯 Tokenomics Compliance:');
    console.log('═'.repeat(50));
    const expectedTotal = 4_500_000_000;
    const supplyCorrect = Math.abs(totalCirculating - expectedTotal) < 1000;
    
    console.log(`✅ Burn executed correctly: ${supplyCorrect ? 'YES' : 'NO'} ${supplyCorrect ? '✅' : '❌'}`);
    console.log(`✅ Distribution correct: ${allCorrect ? 'YES' : 'NO'} ${allCorrect ? '✅' : '❌'}`);
    console.log(`✅ Ready for mainnet: ${(supplyCorrect && allCorrect) ? 'YES' : 'NO'} ${(supplyCorrect && allCorrect) ? '✅' : '❌'}`);

    if (supplyCorrect && allCorrect) {
      console.log('\n🎉 All tokenomics verified successfully!');
      console.log('🚀 Project is ready for mainnet deployment!');
    } else {
      console.log('\n⚠️  Issues detected - please review above');
      if (totalCirculating === 0) {
        console.log('\n💡 Possible solutions:');
        console.log('   1. Check if you\'re on the correct network (devnet vs mainnet)');
        console.log('   2. Verify the token mint address is correct');
        console.log('   3. Ensure the wallet addresses have associated token accounts');
      }
    }

  } catch (err) {
    console.error('❌ Error verifying distribution:', err.message);
    console.error('💡 Check your network connection and token addresses');
  }
})(); 