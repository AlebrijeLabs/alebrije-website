const { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction, 
  sendAndConfirmTransaction 
} = require('@solana/web3.js');
const { 
  createMintToInstruction,
  createBurnInstruction,
  createSetAuthorityInstruction,
  getAccount,
  AuthorityType
} = require('@solana/spl-token');
const fs = require('fs');
const path = require('path');

async function updateTokenSupply() {
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
    
    // First token (ALB)
    const firstTokenMint = new PublicKey('G8xNrjfTBTMASoUox7TgBn2wq6aGLJ5U78qY5JdEJKhN');
    const firstTokenAccount = await connection.getTokenAccountsByOwner(
      payerKeypair.publicKey,
      { mint: firstTokenMint }
    );
    
    if (firstTokenAccount.value.length === 0) {
      throw new Error('No token account found for the first token');
    }
    
    const firstTokenAccountPubkey = firstTokenAccount.value[0].pubkey;
    
    console.log('\n=== First Token (ALB) ===');
    console.log('Mint Address:', firstTokenMint.toString());
    console.log('Token Account:', firstTokenAccountPubkey.toString());
    
    // Get current supply of first token
    const firstTokenAccountInfo = await getAccount(connection, firstTokenAccountPubkey);
    const currentSupply = Number(firstTokenAccountInfo.amount);
    const firstTokenDecimals = 9;
    
    // Calculate amount to mint (9 billion - current supply)
    const targetSupply = 9_000_000_000 * Math.pow(10, firstTokenDecimals);
    const amountToMint = targetSupply - currentSupply;
    
    console.log(`\nCurrent Supply: ${currentSupply / Math.pow(10, firstTokenDecimals)} tokens`);
    console.log(`Target Supply: 9,000,000,000 tokens`);
    console.log(`Amount to Mint: ${amountToMint / Math.pow(10, firstTokenDecimals)} tokens`);
    
    // Second token (ALBJ)
    const secondTokenMint = new PublicKey('6cADm55k89hs4YvGXMac9Q8EAXEtTe16ZqeBk7GHA83w');
    const secondTokenAccount = await connection.getTokenAccountsByOwner(
      payerKeypair.publicKey,
      { mint: secondTokenMint }
    );
    
    if (secondTokenAccount.value.length === 0) {
      throw new Error('No token account found for the second token');
    }
    
    const secondTokenAccountPubkey = secondTokenAccount.value[0].pubkey;
    
    console.log('\n=== Second Token (ALBJ) ===');
    console.log('Mint Address:', secondTokenMint.toString());
    console.log('Token Account:', secondTokenAccountPubkey.toString());
    
    // Get current balance of second token
    const secondTokenAccountInfo = await getAccount(connection, secondTokenAccountPubkey);
    const currentBalance = Number(secondTokenAccountInfo.amount);
    const secondTokenDecimals = 6;
    
    console.log(`\nCurrent Balance: ${currentBalance / Math.pow(10, secondTokenDecimals)} tokens`);
    
    // Create transactions
    const transactions = [];
    
    // Add mint instruction for first token if needed
    if (amountToMint > 0) {
      const mintInstruction = createMintToInstruction(
        firstTokenMint,
        firstTokenAccountPubkey,
        payerKeypair.publicKey,
        BigInt(amountToMint),
        []
      );
      transactions.push(mintInstruction);
    }
    
    // Add burn and disable authority instructions for second token
    const burnInstruction = createBurnInstruction(
      secondTokenAccountPubkey,
      secondTokenMint,
      payerKeypair.publicKey,
      BigInt(currentBalance)
    );
    
    const disableMintAuthorityInstruction = createSetAuthorityInstruction(
      secondTokenMint,
      payerKeypair.publicKey,
      AuthorityType.MintTokens,
      null
    );
    
    transactions.push(burnInstruction, disableMintAuthorityInstruction);
    
    // Create and send the transaction
    const transaction = new Transaction().add(...transactions);
    
    console.log('\nSending transaction...');
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payerKeypair]
    );
    
    console.log(`\nTransaction successful!`);
    console.log(`Signature: ${signature}`);
    console.log(`Explorer URL: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    
    // Verify new balances
    const newFirstTokenAccount = await getAccount(connection, firstTokenAccountPubkey);
    const newFirstTokenSupply = Number(newFirstTokenAccount.amount) / Math.pow(10, firstTokenDecimals);
    console.log(`\nNew first token supply: ${newFirstTokenSupply} tokens`);
    
    const newSecondTokenAccount = await getAccount(connection, secondTokenAccountPubkey);
    const newSecondTokenBalance = Number(newSecondTokenAccount.amount) / Math.pow(10, secondTokenDecimals);
    console.log(`New second token balance: ${newSecondTokenBalance} tokens`);
    
  } catch (error) {
    console.error('Error updating token supply:', error);
    throw error;
  }
}

updateTokenSupply(); 