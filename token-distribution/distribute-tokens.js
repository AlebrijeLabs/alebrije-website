// distribute-tokens.js
const {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  sendAndConfirmTransaction
} = require('@solana/web3.js');
const {
  createTransferInstruction,
  createBurnInstruction,
  getAccount,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction
} = require('@solana/spl-token');
const fs = require('fs');

async function distributeTokens() {
  try {
    const keypairPath = 'new-token-keypair.json';
    if (!fs.existsSync(keypairPath)) throw new Error('Keypair file not found at: ' + keypairPath);

    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
    const payerKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData));

    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const mintAddress = new PublicKey('AHstXMQM3uWETKn3WaztgayZtQhB7iJiPTvqmVi7cbC');

    const tokenAccounts = await connection.getTokenAccountsByOwner(
      payerKeypair.publicKey,
      { mint: mintAddress }
    );
    if (tokenAccounts.value.length === 0) throw new Error('No token account found for the owner');
    const sourceAccount = tokenAccounts.value[0].pubkey;

    const accountInfo = await getAccount(connection, sourceAccount);
    const currentBalance = Number(accountInfo.amount);
    const decimals = 9;

    console.log(`Current Balance: ${currentBalance / Math.pow(10, decimals)} tokens`);

    // ✅ Real ALBJ Wallet Addresses
    const liquidityWallet = new PublicKey('Caky5Wi74w8SYznTWzs9rRkuwwWaSKt9hPSN9wiSoPmE');
    const airdropWallet   = new PublicKey('GviehEcGycFk8W9v6Ft3hysGd42iMPYtRT2KABKWXNph');
    const marketingWallet = new PublicKey('6t9ADpNhgn1JxjtzzLCooNyiAMAo3rxoqZdoxK34uqY5');
    const ecosystemWallet = new PublicKey('CgCeLShLUXo29ZEo8ftrDsnMV92n3moFqHSJirBkt4Q3');
    const foundersWallet  = new PublicKey('F121WYj8S8MkRirXr7bHWRUAY6vHCekd2k7EGpURD1aN');

    const totalSupply = 9_000_000_000 * Math.pow(10, decimals);
    const burnAmount = Math.floor(totalSupply * 0.5);
    const liquidityAmount = Math.floor(totalSupply * 0.2);
    const airdropAmount = Math.floor(totalSupply * 0.1);
    const marketingAmount = Math.floor(totalSupply * 0.1);
    const ecosystemAmount = Math.floor(totalSupply * 0.05);
    const foundersAmount = Math.floor(totalSupply * 0.05);

    console.log('\n=== Token Distribution Plan ===');
    console.log(`Burn: ${burnAmount / Math.pow(10, decimals)} tokens (50%)`);
    console.log(`Liquidity: ${liquidityAmount / Math.pow(10, decimals)} tokens (20%)`);
    console.log(`Airdrop: ${airdropAmount / Math.pow(10, decimals)} tokens (10%)`);
    console.log(`Marketing: ${marketingAmount / Math.pow(10, decimals)} tokens (10%)`);
    console.log(`Ecosystem: ${ecosystemAmount / Math.pow(10, decimals)} tokens (5%)`);
    console.log(`Founders: ${foundersAmount / Math.pow(10, decimals)} tokens (5%)`);

    async function getOrCreateAssociatedTokenAccount(wallet) {
      const associatedAddress = await getAssociatedTokenAddress(mintAddress, wallet);
      try {
        await getAccount(connection, associatedAddress);
        return associatedAddress;
      } catch {
        const transaction = new Transaction().add(
          createAssociatedTokenAccountInstruction(
            payerKeypair.publicKey,
            associatedAddress,
            wallet,
            mintAddress
          )
        );
        await sendAndConfirmTransaction(connection, transaction, [payerKeypair]);
        return associatedAddress;
      }
    }

    console.log('\nCreating token accounts...');
    const liquidityTokenAccount = await getOrCreateAssociatedTokenAccount(liquidityWallet);
    const airdropTokenAccount = await getOrCreateAssociatedTokenAccount(airdropWallet);
    const marketingTokenAccount = await getOrCreateAssociatedTokenAccount(marketingWallet);
    const ecosystemTokenAccount = await getOrCreateAssociatedTokenAccount(ecosystemWallet);
    const foundersTokenAccount = await getOrCreateAssociatedTokenAccount(foundersWallet);

    console.log('\nPreparing token distribution...');
    const burnInstruction = createBurnInstruction(
      sourceAccount,
      mintAddress,
      payerKeypair.publicKey,
      BigInt(burnAmount)
    );

    const instructionsBatch1 = new Transaction().add(
      createTransferInstruction(sourceAccount, liquidityTokenAccount, payerKeypair.publicKey, BigInt(liquidityAmount)),
      createTransferInstruction(sourceAccount, airdropTokenAccount, payerKeypair.publicKey, BigInt(airdropAmount))
    );

    const instructionsBatch2 = new Transaction().add(
      createTransferInstruction(sourceAccount, marketingTokenAccount, payerKeypair.publicKey, BigInt(marketingAmount)),
      createTransferInstruction(sourceAccount, ecosystemTokenAccount, payerKeypair.publicKey, BigInt(ecosystemAmount)),
      createTransferInstruction(sourceAccount, foundersTokenAccount, payerKeypair.publicKey, BigInt(foundersAmount))
    );

    console.log('\nExecuting transactions...');
    const burnSignature = await sendAndConfirmTransaction(connection, new Transaction().add(burnInstruction), [payerKeypair]);
    console.log(`Burn transaction successful: ${burnSignature}`);

    const transferSig1 = await sendAndConfirmTransaction(connection, instructionsBatch1, [payerKeypair]);
    console.log(`Transfer transaction 1 successful: ${transferSig1}`);

    const transferSig2 = await sendAndConfirmTransaction(connection, instructionsBatch2, [payerKeypair]);
    console.log(`Transfer transaction 2 successful: ${transferSig2}`);

    console.log('\n=== Final Balances ===');
    const printBalance = async (label, pubkey) => {
      const info = await getAccount(connection, pubkey);
      console.log(`${label}: ${Number(info.amount) / Math.pow(10, decimals)} tokens`);
    };

    await printBalance('Source account', sourceAccount);
    await printBalance('Liquidity wallet', liquidityTokenAccount);
    await printBalance('Airdrop wallet', airdropTokenAccount);
    await printBalance('Marketing wallet', marketingTokenAccount);
    await printBalance('Ecosystem wallet', ecosystemTokenAccount);
    await printBalance('Founders wallet', foundersTokenAccount);

    console.log('\nToken distribution completed successfully!');
  } catch (error) {
    console.error('Error distributing tokens:', error);
  }
}

distributeTokens(); 