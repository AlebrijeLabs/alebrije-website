const { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction, 
  sendAndConfirmTransaction 
} = require('@solana/web3.js');
const { 
  getAccount,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  createBurnInstruction,
  TOKEN_PROGRAM_ID
} = require('@solana/spl-token');
const fs = require('fs');

async function distributeTokens() {
  try {
    // Read the keypair file
    const keypairPath = 'new-token-keypair.json';
    if (!fs.existsSync(keypairPath)) {
      throw new Error('Keypair file not found at: ' + keypairPath);
    }
    
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
    const payerKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
    
    // Connect to Solana Devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Token mint address (your ALBJ token)
    const mintAddress = new PublicKey('AHstXMQM3uWETKn3WaztgayZtQhB7iJiPTvqmVi7cbC');
    
    // Source token account (where the 9B tokens are)
    const sourceAccount = new PublicKey('6t9ADpNhgn1JxjtzzLCooNyiAMAo3rxoqZdoxK34uqY5');
    
    // Get current balance
    const accountInfo = await getAccount(connection, sourceAccount, TOKEN_PROGRAM_ID);
    const currentBalance = Number(accountInfo.amount);
    const decimals = 9; // 9 decimals for the token
    
    console.log(`Current Balance: ${currentBalance / Math.pow(10, decimals)} tokens`);
    
    // Define wallet addresses for distribution
    // These are example addresses - replace with your actual wallet addresses
    const liquidityWallet = new PublicKey('GviehEcGycFk8W9v6Ft3hysGd42iMPYtRT2KABKWXNph'); // Using your keypair as example
    const airdropWallet = new PublicKey('F121WYj8S8MkRirXr7bHWRUAY6vHCekd2k7EGpURD1aN'); // Using mint authority as example
    const marketingWallet = new PublicKey('GviehEcGycFk8W9v6Ft3hysGd42iMPYtRT2KABKWXNph'); // Using your keypair as example
    const ecosystemWallet = new PublicKey('F121WYj8S8MkRirXr7bHWRUAY6vHCekd2k7EGpURD1aN'); // Using mint authority as example
    const foundersWallet = new PublicKey('GviehEcGycFk8W9v6Ft3hysGd42iMPYtRT2KABKWXNph'); // Using your keypair as example
    
    // Calculate token amounts
    const totalSupply = 9_000_000_000 * Math.pow(10, decimals);
    const burnAmount = Math.floor(totalSupply * 0.5); // 50% burn
    const liquidityAmount = Math.floor(totalSupply * 0.2); // 20% liquidity
    const airdropAmount = Math.floor(totalSupply * 0.1); // 10% airdrop
    const marketingAmount = Math.floor(totalSupply * 0.1); // 10% marketing
    const ecosystemAmount = Math.floor(totalSupply * 0.05); // 5% ecosystem
    const foundersAmount = Math.floor(totalSupply * 0.05); // 5% founders
    
    console.log('\n=== Token Distribution Plan ===');
    console.log(`Burn: ${burnAmount / Math.pow(10, decimals)} tokens (50%)`);
    console.log(`Liquidity: ${liquidityAmount / Math.pow(10, decimals)} tokens (20%)`);
    console.log(`Airdrop: ${airdropAmount / Math.pow(10, decimals)} tokens (10%)`);
    console.log(`Marketing: ${marketingAmount / Math.pow(10, decimals)} tokens (10%)`);
    console.log(`Ecosystem: ${ecosystemAmount / Math.pow(10, decimals)} tokens (5%)`);
    console.log(`Founders: ${foundersAmount / Math.pow(10, decimals)} tokens (5%)`);
    
    // Create associated token accounts for each wallet
    async function getOrCreateAssociatedTokenAccount(wallet) {
      const associatedAddress = await getAssociatedTokenAddress(
        mintAddress,
        wallet
      );
      
      try {
        await getAccount(connection, associatedAddress, TOKEN_PROGRAM_ID);
        return associatedAddress;
      } catch (error) {
        // Account doesn't exist, create it
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
    
    // Get or create token accounts
    console.log('\nCreating token accounts...');
    const liquidityTokenAccount = await getOrCreateAssociatedTokenAccount(liquidityWallet);
    const airdropTokenAccount = await getOrCreateAssociatedTokenAccount(airdropWallet);
    const marketingTokenAccount = await getOrCreateAssociatedTokenAccount(marketingWallet);
    const ecosystemTokenAccount = await getOrCreateAssociatedTokenAccount(ecosystemWallet);
    const foundersTokenAccount = await getOrCreateAssociatedTokenAccount(foundersWallet);
    
    // Create burn instruction
    console.log('\nPreparing token distribution...');
    const burnInstruction = createBurnInstruction(
      sourceAccount,
      mintAddress,
      payerKeypair.publicKey,
      BigInt(burnAmount)
    );
    
    // Create transfer instructions
    const liquidityTransferInstruction = createTransferInstruction(
      sourceAccount,
      liquidityTokenAccount,
      payerKeypair.publicKey,
      BigInt(liquidityAmount)
    );
    
    const airdropTransferInstruction = createTransferInstruction(
      sourceAccount,
      airdropTokenAccount,
      payerKeypair.publicKey,
      BigInt(airdropAmount)
    );
    
    const marketingTransferInstruction = createTransferInstruction(
      sourceAccount,
      marketingTokenAccount,
      payerKeypair.publicKey,
      BigInt(marketingAmount)
    );
    
    const ecosystemTransferInstruction = createTransferInstruction(
      sourceAccount,
      ecosystemTokenAccount,
      payerKeypair.publicKey,
      BigInt(ecosystemAmount)
    );
    
    const foundersTransferInstruction = createTransferInstruction(
      sourceAccount,
      foundersTokenAccount,
      payerKeypair.publicKey,
      BigInt(foundersAmount)
    );
    
    // Execute transactions in batches (to avoid transaction size limits)
    console.log('\nExecuting transactions...');
    
    // Batch 1: Burn
    const burnTransaction = new Transaction().add(burnInstruction);
    const burnSignature = await sendAndConfirmTransaction(
      connection,
      burnTransaction,
      [payerKeypair]
    );
    console.log(`Burn transaction successful: ${burnSignature}`);
    
    // Batch 2: Liquidity and Airdrop
    const transferTransaction1 = new Transaction().add(
      liquidityTransferInstruction,
      airdropTransferInstruction
    );
    const transferSignature1 = await sendAndConfirmTransaction(
      connection,
      transferTransaction1,
      [payerKeypair]
    );
    console.log(`Transfer transaction 1 successful: ${transferSignature1}`);
    
    // Batch 3: Marketing, Ecosystem, and Founders
    const transferTransaction2 = new Transaction().add(
      marketingTransferInstruction,
      ecosystemTransferInstruction,
      foundersTransferInstruction
    );
    const transferSignature2 = await sendAndConfirmTransaction(
      connection,
      transferTransaction2,
      [payerKeypair]
    );
    console.log(`Transfer transaction 2 successful: ${transferSignature2}`);
    
    // Verify final balances
    console.log('\n=== Final Balances ===');
    
    // Source account (should be empty or close to it)
    const finalSourceInfo = await getAccount(connection, sourceAccount, TOKEN_PROGRAM_ID);
    console.log(`Source account: ${Number(finalSourceInfo.amount) / Math.pow(10, decimals)} tokens`);
    
    // Destination accounts
    const liquidityInfo = await getAccount(connection, liquidityTokenAccount, TOKEN_PROGRAM_ID);
    console.log(`Liquidity wallet: ${Number(liquidityInfo.amount) / Math.pow(10, decimals)} tokens`);
    
    const airdropInfo = await getAccount(connection, airdropTokenAccount, TOKEN_PROGRAM_ID);
    console.log(`Airdrop wallet: ${Number(airdropInfo.amount) / Math.pow(10, decimals)} tokens`);
    
    const marketingInfo = await getAccount(connection, marketingTokenAccount, TOKEN_PROGRAM_ID);
    console.log(`Marketing wallet: ${Number(marketingInfo.amount) / Math.pow(10, decimals)} tokens`);
    
    const ecosystemInfo = await getAccount(connection, ecosystemTokenAccount, TOKEN_PROGRAM_ID);
    console.log(`Ecosystem wallet: ${Number(ecosystemInfo.amount) / Math.pow(10, decimals)} tokens`);
    
    const foundersInfo = await getAccount(connection, foundersTokenAccount, TOKEN_PROGRAM_ID);
    console.log(`Founders wallet: ${Number(foundersInfo.amount) / Math.pow(10, decimals)} tokens`);
    
    console.log('\nToken distribution completed successfully!');
    
  } catch (error) {
    console.error('Error distributing tokens:', error);
  }
}

distributeTokens(); 