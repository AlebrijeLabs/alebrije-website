const anchor = require('@coral-xyz/anchor');
const { Connection, PublicKey, Keypair, clusterApiUrl } = require('@solana/web3.js');
const fs = require('fs');

// Configuration
const NETWORK = 'devnet'; // Change to 'mainnet-beta' for production
const RPC_URL = clusterApiUrl(NETWORK);
const PROGRAM_ID = new PublicKey('93CCq4xaFrrEmoD8DtwD8rjuizZddBrnZYv3p7oQSSTz');
const TOKEN_MINT = new PublicKey('AHstXMQM3uWETKn3WaztgayZtQhB7iJiPTvqmVi7cbC');

// 3 billion tokens in raw units (with 9 decimals)
const BURN_THRESHOLD = 3_000_000_000 * Math.pow(10, 9);

async function deploySmartBurn() {
  console.log('🚀 Deploying ALBJ Smart Burn Mechanism...');
  console.log(`Network: ${NETWORK}`);
  console.log(`Program ID: ${PROGRAM_ID.toString()}`);
  console.log(`Token Mint: ${TOKEN_MINT.toString()}`);
  console.log(`Burn Threshold: ${BURN_THRESHOLD.toLocaleString()} (3 billion tokens)\n`);

  try {
    // Setup connection and wallet
    const connection = new Connection(RPC_URL, 'confirmed');
    
    // Load the payer keypair (authority)
    let payerKeypair;
    try {
      const keypairData = JSON.parse(fs.readFileSync('./new-token-keypair.json', 'utf8'));
      payerKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
      console.log(`✅ Loaded authority keypair: ${payerKeypair.publicKey.toString()}`);
    } catch (error) {
      console.error('❌ Error loading keypair:', error.message);
      console.log('Please ensure new-token-keypair.json exists in the project root');
      return;
    }

    // Check SOL balance
    const balance = await connection.getBalance(payerKeypair.publicKey);
    console.log(`💰 Authority SOL balance: ${balance / 1e9} SOL`);
    
    if (balance < 0.1 * 1e9) {
      console.log('⚠️  Low SOL balance. You may need more SOL for deployment.');
    }

    // Load the program IDL
    const idl = JSON.parse(fs.readFileSync('./target/idl/alebrije_coin.json', 'utf8'));
    
    // Create anchor provider and program
    const provider = new anchor.AnchorProvider(
      connection, 
      new anchor.Wallet(payerKeypair), 
      { commitment: 'confirmed' }
    );
    anchor.setProvider(provider);
    
    const program = new anchor.Program(idl, PROGRAM_ID, provider);

    // Calculate program state PDA
    const [programStatePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('program_state')],
      PROGRAM_ID
    );

    console.log(`📊 Program State PDA: ${programStatePDA.toString()}`);

    // Check if program state already exists
    try {
      const existingState = await program.account.programState.fetch(programStatePDA);
      console.log('ℹ️  Program state already exists:');
      console.log(`   Authority: ${existingState.authority.toString()}`);
      console.log(`   Current Burn Threshold: ${existingState.burnThreshold.toString()}`);
      console.log(`   Bump: ${existingState.bump}`);
      
      // Ask if they want to update the threshold
      console.log('\n🔧 Program already initialized. You can update the burn threshold if needed.');
      return;
    } catch (error) {
      // Program state doesn't exist, we need to initialize
      console.log('✨ Program state not found. Initializing...');
    }

    // Initialize the program
    console.log('🔄 Sending initialization transaction...');
    
    const tx = await program.methods
      .initialize(new anchor.BN(BURN_THRESHOLD))
      .accounts({
        programState: programStatePDA,
        authority: payerKeypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([payerKeypair])
      .rpc();

    console.log(`✅ Initialization transaction confirmed: ${tx}`);
    console.log(`🔗 View transaction: https://explorer.solana.com/tx/${tx}?cluster=${NETWORK}`);

    // Fetch and display the initialized state
    const programState = await program.account.programState.fetch(programStatePDA);
    
    console.log('\n🎉 Smart Burn Mechanism Successfully Deployed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📍 Program State Address: ${programStatePDA.toString()}`);
    console.log(`👤 Authority: ${programState.authority.toString()}`);
    console.log(`🔥 Burn Threshold: ${programState.burnThreshold.toString()} (${(programState.burnThreshold / Math.pow(10, 9)).toLocaleString()} tokens)`);
    console.log(`🔢 Bump: ${programState.bump}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n📋 Smart Burn Mechanism Summary:');
    console.log('• 🔥 Burns 1% of each transaction when supply > 3B tokens');
    console.log('• 💰 Sends 4% to treasury when burning is active');
    console.log('• 💎 Sends full 5% to treasury when supply ≤ 3B tokens (no burn)');
    console.log('• 🤖 Fully automated and trustless');
    console.log('• 🔄 Can be monitored and threshold updated by authority');

    console.log('\n🚀 Ready for June 12th launch with community-trusted tokenomics!');

  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    
    if (error.logs) {
      console.log('\n📋 Program logs:');
      error.logs.forEach(log => console.log(`  ${log}`));
    }
  }
}

// Helper function to update burn threshold (admin only)
async function updateBurnThreshold(newThreshold) {
  console.log(`🔧 Updating burn threshold to: ${newThreshold.toLocaleString()}`);
  
  const connection = new Connection(RPC_URL, 'confirmed');
  const keypairData = JSON.parse(fs.readFileSync('./new-token-keypair.json', 'utf8'));
  const payerKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
  
  const idl = JSON.parse(fs.readFileSync('./target/idl/alebrije_coin.json', 'utf8'));
  const provider = new anchor.AnchorProvider(
    connection, 
    new anchor.Wallet(payerKeypair), 
    { commitment: 'confirmed' }
  );
  anchor.setProvider(provider);
  
  const program = new anchor.Program(idl, PROGRAM_ID, provider);
  const [programStatePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('program_state')],
    PROGRAM_ID
  );

  const tx = await program.methods
    .updateBurnThreshold(new anchor.BN(newThreshold))
    .accounts({
      programState: programStatePDA,
      authority: payerKeypair.publicKey,
    })
    .signers([payerKeypair])
    .rpc();

  console.log(`✅ Threshold updated: ${tx}`);
}

// Helper function to check program state
async function checkProgramState() {
  console.log('📊 Checking current program state...\n');
  
  const connection = new Connection(RPC_URL, 'confirmed');
  const keypairData = JSON.parse(fs.readFileSync('./new-token-keypair.json', 'utf8'));
  const payerKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
  
  const idl = JSON.parse(fs.readFileSync('./target/idl/alebrije_coin.json', 'utf8'));
  const provider = new anchor.AnchorProvider(
    connection, 
    new anchor.Wallet(payerKeypair), 
    { commitment: 'confirmed' }
  );
  anchor.setProvider(provider);
  
  const program = new anchor.Program(idl, PROGRAM_ID, provider);
  const [programStatePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('program_state')],
    PROGRAM_ID
  );

  const tx = await program.methods
    .getProgramState()
    .accounts({
      programState: programStatePDA,
      mint: TOKEN_MINT,
    })
    .rpc();

  console.log(`✅ State check transaction: ${tx}`);
}

// Main execution
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'update' && process.argv[3]) {
    const newThreshold = parseInt(process.argv[3]) * Math.pow(10, 9);
    updateBurnThreshold(newThreshold);
  } else if (command === 'check') {
    checkProgramState();
  } else {
    deploySmartBurn();
  }
}

module.exports = { deploySmartBurn, updateBurnThreshold, checkProgramState }; 