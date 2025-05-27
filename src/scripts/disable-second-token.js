const { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction, 
  sendAndConfirmTransaction 
} = require('@solana/web3.js');
const { 
  createBurnInstruction,
  createSetAuthorityInstruction,
  getAccount,
  AuthorityType
} = require('@solana/spl-token');
const fs = require('fs');
const path = require('path');

async function disableSecondToken() {
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
    
    // Second token mint address
    const mintPublicKey = new PublicKey('6cADm55k89hs4YvGXMac9Q8EAXEtTe16ZqeBk7GHA83w');
    
    // Get the associated token account for the payer
    const tokenAccount = await connection.getTokenAccountsByOwner(
      payerKeypair.publicKey,
      { mint: mintPublicKey }
    );
    
    if (tokenAccount.value.length === 0) {
      throw new Error('No token account found for the payer');
    }
    
    const tokenAccountPubkey = tokenAccount.value[0].pubkey;
    
    console.log('Second Token Mint Address:', mintPublicKey.toString());
    console.log('Token Account:', tokenAccountPubkey.toString());
    console.log('Mint Authority:', payerKeypair.publicKey.toString());
    
    // Get current balance
    const tokenAccountInfo = await getAccount(connection, tokenAccountPubkey);
    const currentBalance = Number(tokenAccountInfo.amount);
    const decimals = 6; // Second token uses 6 decimals
    
    console.log(`\nCurrent Balance: ${currentBalance / Math.pow(10, decimals)} tokens`);
    
    // Create burn instruction to burn all remaining tokens
    const burnInstruction = createBurnInstruction(
      tokenAccountPubkey,
      mintPublicKey,
      payerKeypair.publicKey,
      BigInt(currentBalance)
    );
    
    // Create instruction to disable mint authority
    const disableMintAuthorityInstruction = createSetAuthorityInstruction(
      mintPublicKey,
      payerKeypair.publicKey,
      AuthorityType.MintTokens,
      null // Set to null to disable mint authority
    );
    
    // Create and send the transaction
    const transaction = new Transaction().add(
      burnInstruction,
      disableMintAuthorityInstruction
    );
    
    console.log('\nSending transaction to burn tokens and disable mint authority...');
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payerKeypair]
    );
    
    console.log(`Transaction successful!`);
    console.log(`Signature: ${signature}`);
    console.log(`Explorer URL: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    
    // Verify new balance
    const newTokenAccount = await getAccount(connection, tokenAccountPubkey);
    const newBalance = Number(newTokenAccount.amount) / Math.pow(10, decimals);
    console.log(`\nNew balance: ${newBalance} tokens`);
    
  } catch (error) {
    console.error('Error disabling second token:', error);
    throw error;
  }
}

disableSecondToken(); 