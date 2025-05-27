const { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction, 
  sendAndConfirmTransaction 
} = require('@solana/web3.js');
const { 
  createMintToInstruction,
  getAccount
} = require('@solana/spl-token');
const fs = require('fs');
const path = require('path');

async function mintAdditionalTokens() {
  try {
    // Read the keypair file
    const keypairPath = path.join(__dirname, '../../alebrije-keypair.json');
    if (!fs.existsSync(keypairPath)) {
      throw new Error('Keypair file not found at: ' + keypairPath);
    }
    
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
    const payerKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
    
    // Connect to Solana Devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Token mint address
    const mintPublicKey = new PublicKey('G8xNrjfTBTMASoUox7TgBn2wq6aGLJ5U78qY5JdEJKhN');
    
    // Get the associated token account for the payer
    const tokenAccount = await connection.getTokenAccountsByOwner(
      payerKeypair.publicKey,
      { mint: mintPublicKey }
    );
    
    if (tokenAccount.value.length === 0) {
      throw new Error('No token account found for the payer');
    }
    
    const tokenAccountPubkey = tokenAccount.value[0].pubkey;
    
    console.log('Mint Address:', mintPublicKey.toString());
    console.log('Token Account:', tokenAccountPubkey.toString());
    console.log('Mint Authority:', payerKeypair.publicKey.toString());
    
    // Get current supply
    const tokenAccountInfo = await getAccount(connection, tokenAccountPubkey);
    const currentSupply = Number(tokenAccountInfo.amount);
    const decimals = 9;
    
    // Calculate amount to mint (9 billion - current supply)
    const targetSupply = 9_000_000_000 * Math.pow(10, decimals);
    const amountToMint = targetSupply - currentSupply;
    
    if (amountToMint <= 0) {
      console.log('Current supply is already at or above 9 billion tokens');
      return;
    }
    
    console.log(`\nCurrent Supply: ${currentSupply / Math.pow(10, decimals)} tokens`);
    console.log(`Target Supply: 9,000,000,000 tokens`);
    console.log(`Amount to Mint: ${amountToMint / Math.pow(10, decimals)} tokens`);
    
    // Create mint instruction
    const mintInstruction = createMintToInstruction(
      mintPublicKey,
      tokenAccountPubkey,
      payerKeypair.publicKey,
      BigInt(amountToMint),
      []
    );
    
    // Create and send the transaction
    const transaction = new Transaction().add(mintInstruction);
    
    console.log('\nSending mint transaction...');
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payerKeypair]
    );
    
    console.log(`Mint transaction successful!`);
    console.log(`Signature: ${signature}`);
    console.log(`Explorer URL: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    
    // Verify new supply
    const newTokenAccount = await getAccount(connection, tokenAccountPubkey);
    const newSupply = Number(newTokenAccount.amount) / Math.pow(10, decimals);
    console.log(`\nNew supply: ${newSupply} tokens`);
    
  } catch (error) {
    console.error('Error minting additional tokens:', error);
    throw error;
  }
}

mintAdditionalTokens(); 