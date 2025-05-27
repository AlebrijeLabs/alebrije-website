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
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID
} = require('@solana/spl-token');
const fs = require('fs');

class ALBJTokenTaxHandler {
  constructor(connection) {
    this.connection = connection;
    this.mintAddress = new PublicKey('AHstXMQM3uWETKn3WaztgayZtQhB7iJiPTvqmVi7cbC');
    this.decimals = 9;
    
    // Tax rates
    this.totalTaxRate = 0.05; // 5% total tax
    this.liquidityTaxRate = 0.03; // 3% to liquidity
    this.marketingTaxRate = 0.01; // 1% to marketing
    this.charityTaxRate = 0.01; // 1% to charity
    this.burnTaxRate = 0.01; // 1% burn
    
    // Wallet addresses
    this.liquidityWallet = new PublicKey('GviehEcGycFk8W9v6Ft3hysGd42iMPYtRT2KABKWXNph');
    this.marketingWallet = new PublicKey('F121WYj8S8MkRirXr7bHWRUAY6vHCekd2k7EGpURD1aN');
    this.charityWallet = new PublicKey('GviehEcGycFk8W9v6Ft3hysGd42iMPYtRT2KABKWXNph');
  }

  async initialize() {
    console.log('Initializing tax handler...');
    
    // Create or get associated token accounts for tax wallets
    this.liquidityTokenAccount = await this.getOrCreateAssociatedTokenAccount(this.liquidityWallet);
    this.marketingTokenAccount = await this.getOrCreateAssociatedTokenAccount(this.marketingWallet);
    this.charityTokenAccount = await this.getOrCreateAssociatedTokenAccount(this.charityWallet);
    
    console.log('Tax handler initialized successfully!');
    console.log('Liquidity account:', this.liquidityTokenAccount.toString());
    console.log('Marketing account:', this.marketingTokenAccount.toString());
    console.log('Charity account:', this.charityTokenAccount.toString());
  }

  async getOrCreateAssociatedTokenAccount(wallet) {
    const associatedAddress = await getAssociatedTokenAddress(
      this.mintAddress,
      wallet
    );
    
    try {
      await getAccount(this.connection, associatedAddress, TOKEN_PROGRAM_ID);
      console.log(`Found existing token account for ${wallet.toString()}`);
      return associatedAddress;
    } catch (error) {
      console.log(`Creating new token account for ${wallet.toString()}`);
      // Account doesn't exist, create it
      const keypairPath = 'new-token-keypair.json';
      const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
      const payerKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
      
      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          payerKeypair.publicKey,
          associatedAddress,
          wallet,
          this.mintAddress
        )
      );
      
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [payerKeypair]
      );
      console.log(`Created token account: ${signature}`);
      return associatedAddress;
    }
  }

  async processTransfer(sourceAccount, destinationAccount, amount, payer) {
    console.log('\nProcessing transfer with tax...');
    console.log(`Source: ${sourceAccount.toString()}`);
    console.log(`Destination: ${destinationAccount.toString()}`);
    console.log(`Amount: ${amount / Math.pow(10, this.decimals)} tokens`);
    
    // Calculate tax amounts
    const taxAmount = Math.floor(amount * this.totalTaxRate);
    const liquidityTaxAmount = Math.floor(amount * this.liquidityTaxRate);
    const marketingTaxAmount = Math.floor(amount * this.marketingTaxRate);
    const charityTaxAmount = Math.floor(amount * this.charityTaxRate);
    const burnTaxAmount = Math.floor(amount * this.burnTaxRate);
    
    // Calculate net transfer amount after tax
    const netTransferAmount = amount - taxAmount;
    
    console.log('\nTax Breakdown:');
    console.log(`Total Tax: ${taxAmount / Math.pow(10, this.decimals)} tokens (${this.totalTaxRate * 100}%)`);
    console.log(`- Liquidity: ${liquidityTaxAmount / Math.pow(10, this.decimals)} tokens (${this.liquidityTaxRate * 100}%)`);
    console.log(`- Marketing: ${marketingTaxAmount / Math.pow(10, this.decimals)} tokens (${this.marketingTaxRate * 100}%)`);
    console.log(`- Charity: ${charityTaxAmount / Math.pow(10, this.decimals)} tokens (${this.charityTaxRate * 100}%)`);
    console.log(`- Burn: ${burnTaxAmount / Math.pow(10, this.decimals)} tokens (${this.burnTaxRate * 100}%)`);
    console.log(`Net Transfer: ${netTransferAmount / Math.pow(10, this.decimals)} tokens`);
    
    // Create transaction
    const transaction = new Transaction();
    
    // Add main transfer instruction (net amount after tax)
    transaction.add(
      createTransferInstruction(
        sourceAccount,
        destinationAccount,
        payer.publicKey,
        BigInt(netTransferAmount),
        [],
        TOKEN_PROGRAM_ID
      )
    );
    
    // Add tax transfer instructions
    if (liquidityTaxAmount > 0) {
      transaction.add(
        createTransferInstruction(
          sourceAccount,
          this.liquidityTokenAccount,
          payer.publicKey,
          BigInt(liquidityTaxAmount),
          [],
          TOKEN_PROGRAM_ID
        )
      );
    }
    
    if (marketingTaxAmount > 0) {
      transaction.add(
        createTransferInstruction(
          sourceAccount,
          this.marketingTokenAccount,
          payer.publicKey,
          BigInt(marketingTaxAmount),
          [],
          TOKEN_PROGRAM_ID
        )
      );
    }
    
    if (charityTaxAmount > 0) {
      transaction.add(
        createTransferInstruction(
          sourceAccount,
          this.charityTokenAccount,
          payer.publicKey,
          BigInt(charityTaxAmount),
          [],
          TOKEN_PROGRAM_ID
        )
      );
    }
    
    // Add burn instruction
    if (burnTaxAmount > 0) {
      transaction.add(
        createBurnInstruction(
          sourceAccount,
          this.mintAddress,
          payer.publicKey,
          BigInt(burnTaxAmount),
          [],
          TOKEN_PROGRAM_ID
        )
      );
    }
    
    // Send transaction
    console.log('\nSending transaction...');
    const signature = await sendAndConfirmTransaction(
      this.connection,
      transaction,
      [payer]
    );
    
    console.log(`Transaction successful! Signature: ${signature}`);
    
    return {
      signature,
      originalAmount: amount,
      netTransferAmount,
      taxAmount,
      liquidityTaxAmount,
      marketingTaxAmount,
      charityTaxAmount,
      burnTaxAmount
    };
  }
}

// Example usage
async function example() {
  try {
    // Connect to Solana Devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Initialize tax handler
    const taxHandler = new ALBJTokenTaxHandler(connection);
    await taxHandler.initialize();
    
    // Load marketing wallet keypair (this should be the wallet that owns the source account)
    const keypairPath = 'new-token-keypair.json';
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
    const marketingWallet = Keypair.fromSecretKey(new Uint8Array(keypairData));
    
    // Get the associated token account for the marketing wallet
    const sourceAccount = await getAssociatedTokenAddress(
      taxHandler.mintAddress,
      marketingWallet.publicKey
    );

    // Verify the source account exists and has tokens
    try {
      const sourceAccountInfo = await getAccount(connection, sourceAccount, TOKEN_PROGRAM_ID);
      console.log('\nSource Account Info:');
      console.log(`Address: ${sourceAccount.toString()}`);
      console.log(`Owner: ${sourceAccountInfo.owner.toString()}`);
      console.log(`Mint: ${sourceAccountInfo.mint.toString()}`);
      console.log(`Amount: ${Number(sourceAccountInfo.amount) / Math.pow(10, taxHandler.decimals)} tokens`);
    } catch (error) {
      console.error('Error: Source account does not exist or has no tokens');
      console.error('Please ensure the marketing wallet has tokens in their associated token account');
      return;
    }
    
    // Create a new destination account for testing
    const destinationWallet = Keypair.generate();
    const destinationAccount = await getAssociatedTokenAddress(
      taxHandler.mintAddress,
      destinationWallet.publicKey
    );
    
    // Create the destination account
    const createAccountTx = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        marketingWallet.publicKey,
        destinationAccount,
        destinationWallet.publicKey,
        taxHandler.mintAddress
      )
    );
    
    await sendAndConfirmTransaction(connection, createAccountTx, [marketingWallet]);
    console.log(`Created destination account: ${destinationAccount.toString()}`);
    
    // Example transfer
    const amount = 1000 * Math.pow(10, 9); // 1000 tokens with 9 decimals
    
    const result = await taxHandler.processTransfer(
      sourceAccount,
      destinationAccount,
      amount,
      marketingWallet
    );
    
    console.log('\nTransfer completed with tax:');
    console.log(`Transaction signature: ${result.signature}`);
    console.log(`Original amount: ${result.originalAmount / Math.pow(10, 9)} tokens`);
    console.log(`Net transfer amount: ${result.netTransferAmount / Math.pow(10, 9)} tokens`);
    console.log(`Total tax: ${result.taxAmount / Math.pow(10, 9)} tokens`);
    console.log(`Liquidity tax: ${result.liquidityTaxAmount / Math.pow(10, 9)} tokens`);
    console.log(`Marketing tax: ${result.marketingTaxAmount / Math.pow(10, 9)} tokens`);
    console.log(`Charity tax: ${result.charityTaxAmount / Math.pow(10, 9)} tokens`);
    console.log(`Burned: ${result.burnTaxAmount / Math.pow(10, 9)} tokens`);
    
  } catch (error) {
    console.error('Error in example:', error);
  }
}

// Run the example
example(); 