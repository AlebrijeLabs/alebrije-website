import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from '@solana/web3.js';
import { 
  createInitializeMintInstruction, 
  TOKEN_PROGRAM_ID, 
  MINT_SIZE, 
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getMint
} from '@solana/spl-token';
import { toast } from 'react-toastify';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const MicroTokenCreator: React.FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [tokenSymbol, setTokenSymbol] = useState<string>('ALEBRIJE');
  const [tokenDecimals, setTokenDecimals] = useState<number>(9);
  const [tokenSupply, setTokenSupply] = useState<number>(1000000000);
  const [newTokenMint, setNewTokenMint] = useState<string | null>(null);
  const [mintKeypair, setMintKeypair] = useState<Keypair | null>(null);
  const [step, setStep] = useState<number>(0);
  
  // Initialize connection with Helius
  const connection = new Connection('https://devnet.helius-rpc.com/?api-key=83c0ba8a-624c-4e55-9ceb-5084d9501179', {
    commitment: 'confirmed',
  });
  
  // Log to UI
  const logToUI = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `${timestamp}: ${message}`;
    setLogs(prevLogs => [...prevLogs, logMessage]);
    console.log(logMessage);
  };
  
  // Step 1: Generate keypair
  const generateKeypair = () => {
    try {
      const keypair = Keypair.generate();
      setMintKeypair(keypair);
      logToUI(`Generated mint address: ${keypair.publicKey.toString()}`);
      setStep(1);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logToUI(`Error generating keypair: ${errorMessage}`);
      toast.error(`Error generating keypair: ${errorMessage}`);
    }
  };
  
  // Step 2: Create account
  const createAccount = async () => {
    if (!publicKey || !mintKeypair) {
      toast.error("Please connect your wallet and generate a keypair first");
      return;
    }
    
    try {
      setLoading(true);
      logToUI(`Creating account for mint: ${mintKeypair.publicKey.toString()}`);
      
      // Get the rent for the mint account
      const lamports = await getMinimumBalanceForRentExemptMint(connection);
      logToUI(`Required lamports for rent exemption: ${lamports}`);
      
      // Create account instruction
      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        })
      );
      
      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      // Partially sign the transaction with the mint keypair
      transaction.partialSign(mintKeypair);
      
      // Send transaction
      logToUI(`Sending transaction to create account...`);
      const signature = await sendTransaction(transaction, connection, {
        signers: [mintKeypair],
      });
      
      logToUI(`Account creation transaction sent: ${signature}`);
      logToUI(`Waiting for confirmation...`);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        logToUI(`Account creation failed: ${JSON.stringify(confirmation.value.err)}`);
        toast.error("Account creation failed");
      } else {
        logToUI(`Account created successfully!`);
        toast.success("Account created successfully!");
        setStep(2);
      }
      
      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logToUI(`Error creating account: ${errorMessage}`);
      console.error('Error creating account:', error);
      
      toast.error(`Error creating account: ${errorMessage}`);
      setLoading(false);
    }
  };
  
  // Step 3: Initialize mint
  const initializeMint = async () => {
    if (!publicKey || !mintKeypair) {
      toast.error("Please connect your wallet and create an account first");
      return;
    }
    
    try {
      setLoading(true);
      logToUI(`Initializing mint: ${mintKeypair.publicKey.toString()}`);
      
      // Initialize mint instruction
      const transaction = new Transaction().add(
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          tokenDecimals,
          publicKey,
          publicKey,
          TOKEN_PROGRAM_ID
        )
      );
      
      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      // Send transaction
      logToUI(`Sending transaction to initialize mint...`);
      const signature = await sendTransaction(transaction, connection);
      
      logToUI(`Mint initialization transaction sent: ${signature}`);
      logToUI(`Waiting for confirmation...`);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        logToUI(`Mint initialization failed: ${JSON.stringify(confirmation.value.err)}`);
        toast.error("Mint initialization failed");
      } else {
        logToUI(`Mint initialized successfully!`);
        toast.success("Mint initialized successfully!");
        setStep(3);
      }
      
      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logToUI(`Error initializing mint: ${errorMessage}`);
      console.error('Error initializing mint:', error);
      
      toast.error(`Error initializing mint: ${errorMessage}`);
      setLoading(false);
    }
  };
  
  // Step 4: Create token account
  const createTokenAccount = async () => {
    if (!publicKey || !mintKeypair) {
      toast.error("Please connect your wallet and initialize mint first");
      return;
    }
    
    try {
      setLoading(true);
      logToUI(`Creating token account for mint: ${mintKeypair.publicKey.toString()}`);
      
      // Get associated token account for the mint and the user's wallet
      const associatedTokenAccount = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        publicKey
      );
      
      logToUI(`Associated token account address: ${associatedTokenAccount.toString()}`);
      
      // Create associated token account instruction
      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          publicKey,
          associatedTokenAccount,
          publicKey,
          mintKeypair.publicKey
        )
      );
      
      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      // Send transaction
      logToUI(`Sending transaction to create token account...`);
      const signature = await sendTransaction(transaction, connection);
      
      logToUI(`Token account creation transaction sent: ${signature}`);
      logToUI(`Waiting for confirmation...`);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        logToUI(`Token account creation failed: ${JSON.stringify(confirmation.value.err)}`);
        toast.error("Token account creation failed");
      } else {
        logToUI(`Token account created successfully!`);
        toast.success("Token account created successfully!");
        setStep(4);
      }
      
      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logToUI(`Error creating token account: ${errorMessage}`);
      console.error('Error creating token account:', error);
      
      toast.error(`Error creating token account: ${errorMessage}`);
      setLoading(false);
    }
  };
  
  // Step 5: Mint tokens
  const mintTokens = async () => {
    if (!publicKey || !mintKeypair) {
      toast.error("Please connect your wallet and create a token account first");
      return;
    }
    
    try {
      setLoading(true);
      logToUI(`Minting tokens for: ${mintKeypair.publicKey.toString()}`);
      
      // Get associated token account for the mint and the user's wallet
      const associatedTokenAccount = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        publicKey
      );
      
      // Calculate the token amount with decimals
      const tokenAmount = tokenSupply * Math.pow(10, tokenDecimals);
      
      // Create mint to instruction
      const transaction = new Transaction().add(
        createMintToInstruction(
          mintKeypair.publicKey,
          associatedTokenAccount,
          publicKey,
          BigInt(tokenAmount),
          []
        )
      );
      
      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      // Send transaction
      logToUI(`Sending transaction to mint tokens...`);
      const signature = await sendTransaction(transaction, connection);
      
      logToUI(`Token minting transaction sent: ${signature}`);
      logToUI(`Waiting for confirmation...`);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        logToUI(`Token minting failed: ${JSON.stringify(confirmation.value.err)}`);
        toast.error("Token minting failed");
      } else {
        logToUI(`Tokens minted successfully!`);
        logToUI(`Mint address: ${mintKeypair.publicKey.toString()}`);
        logToUI(`Token account: ${associatedTokenAccount.toString()}`);
        logToUI(`Initial supply: ${tokenSupply}`);
        
        setNewTokenMint(mintKeypair.publicKey.toString());
        toast.success(`Token ${tokenSymbol} created and minted successfully!`);
        setStep(5);
      }
      
      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logToUI(`Error minting tokens: ${errorMessage}`);
      console.error('Error minting tokens:', error);
      
      toast.error(`Error minting tokens: ${errorMessage}`);
      setLoading(false);
    }
  };
  
  // Verify token
  const verifyToken = async () => {
    if (!mintKeypair) {
      toast.error("No token mint to verify");
      return;
    }
    
    try {
      setLoading(true);
      logToUI(`Verifying token: ${mintKeypair.publicKey.toString()}`);
      
      // Get mint info
      try {
        const mintInfo = await getMint(connection, mintKeypair.publicKey);
        logToUI(`Token verified successfully!`);
        logToUI(`Decimals: ${mintInfo.decimals}`);
        logToUI(`Mint authority: ${mintInfo.mintAuthority?.toString() || 'None'}`);
        
        toast.success("Token verified successfully!");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logToUI(`Error verifying token: ${errorMessage}`);
        toast.error(`Error verifying token: ${errorMessage}`);
      }
      
      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logToUI(`Error verifying token: ${errorMessage}`);
      console.error('Error verifying token:', error);
      
      toast.error(`Error verifying token: ${errorMessage}`);
      setLoading(false);
    }
  };
  
  // Reset
  const reset = () => {
    setMintKeypair(null);
    setNewTokenMint(null);
    setStep(0);
    setLogs([]);
    logToUI("Process reset. Ready to create a new token.");
  };
  
  if (!publicKey) {
    return (
      <div>
        <h2>Micro Token Creator</h2>
        <p>Connect your wallet to create a token step by step.</p>
        <WalletMultiButton />
      </div>
    );
  }
  
  return (
    <div>
      <h2>Micro Token Creator</h2>
      <p>Current wallet: {publicKey.toString()}</p>
      
      {newTokenMint ? (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#e6f7e6', 
          borderRadius: '5px',
          border: '1px solid #c3e6cb'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>Token Created!</h3>
          <p style={{ margin: '0 0 5px 0' }}><strong>Mint Address:</strong> {newTokenMint}</p>
          <p style={{ margin: '0 0 15px 0' }}>Your wallet should be the mint authority for this token.</p>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <a 
              href={`https://explorer.solana.com/address/${newTokenMint}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                flex: 1,
                padding: '8px 15px', 
                backgroundColor: '#17a2b8', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer',
                textDecoration: 'none',
                textAlign: 'center'
              }}
            >
              View on Explorer
            </a>
            
            <button 
              onClick={reset} 
              style={{ 
                flex: 1,
                padding: '8px 15px', 
                backgroundColor: '#6c757d', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer'
              }}
            >
              Create Another Token
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Token Symbol</label>
            <input
              type="text"
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
              placeholder="e.g., ALEBRIJE"
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '5px', 
                border: '1px solid #ccc' 
              }}
              disabled={step > 0}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Decimals</label>
            <input
              type="number"
              value={tokenDecimals}
              onChange={(e) => setTokenDecimals(Number(e.target.value))}
              placeholder="e.g., 9"
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '5px', 
                border: '1px solid #ccc' 
              }}
              disabled={step > 0}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Initial Supply</label>
            <input
              type="number"
              value={tokenSupply}
              onChange={(e) => setTokenSupply(Number(e.target.value))}
              placeholder="e.g., 1000000000"
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '5px', 
                border: '1px solid #ccc' 
              }}
              disabled={step > 0}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '10px' 
            }}>
              <button 
                onClick={generateKeypair} 
                disabled={loading || step > 0} 
                style={{ 
                  padding: '10px', 
                  backgroundColor: step === 0 ? '#4444ff' : (step > 0 ? '#4caf50' : '#cccccc'), 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: loading || step > 0 ? 'not-allowed' : 'pointer'
                }}
              >
                {loading && step === 0 ? 'Processing...' : (step > 0 ? '✓ Step 1: Generate Keypair' : 'Step 1: Generate Keypair')}
              </button>
              
              <button 
                onClick={createAccount} 
                disabled={loading || step < 1 || step > 1} 
                style={{ 
                  padding: '10px', 
                  backgroundColor: step === 1 ? '#4444ff' : (step > 1 ? '#4caf50' : '#cccccc'), 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: loading || step < 1 || step > 1 ? 'not-allowed' : 'pointer'
                }}
              >
                {loading && step === 1 ? 'Processing...' : (step > 1 ? '✓ Step 2: Create Account' : 'Step 2: Create Account')}
              </button>
              
              <button 
                onClick={initializeMint} 
                disabled={loading || step < 2 || step > 2} 
                style={{ 
                  padding: '10px', 
                  backgroundColor: step === 2 ? '#4444ff' : (step > 2 ? '#4caf50' : '#cccccc'), 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: loading || step < 2 || step > 2 ? 'not-allowed' : 'pointer'
                }}
              >
                {loading && step === 2 ? 'Processing...' : (step > 2 ? '✓ Step 3: Initialize Mint' : 'Step 3: Initialize Mint')}
              </button>
              
              <button 
                onClick={createTokenAccount} 
                disabled={loading || step < 3 || step > 3} 
                style={{ 
                  padding: '10px', 
                  backgroundColor: step === 3 ? '#4444ff' : (step > 3 ? '#4caf50' : '#cccccc'), 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: loading || step < 3 || step > 3 ? 'not-allowed' : 'pointer'
                }}
              >
                {loading && step === 3 ? 'Processing...' : (step > 3 ? '✓ Step 4: Create Token Account' : 'Step 4: Create Token Account')}
              </button>
              
              <button 
                onClick={mintTokens} 
                disabled={loading || step < 4 || step > 4} 
                style={{ 
                  padding: '10px', 
                  backgroundColor: step === 4 ? '#4444ff' : (step > 4 ? '#4caf50' : '#cccccc'), 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: loading || step < 4 || step > 4 ? 'not-allowed' : 'pointer'
                }}
              >
                {loading && step === 4 ? 'Processing...' : (step > 4 ? '✓ Step 5: Mint Tokens' : 'Step 5: Mint Tokens')}
              </button>
              
              <button 
                onClick={verifyToken} 
                disabled={loading || !mintKeypair} 
                style={{ 
                  padding: '10px', 
                  backgroundColor: mintKeypair ? '#17a2b8' : '#cccccc', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: loading || !mintKeypair ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Verifying...' : 'Verify Token'}
              </button>
              
              {step > 0 && (
                <button 
                  onClick={reset} 
                  disabled={loading} 
                  style={{ 
                    padding: '10px', 
                    backgroundColor: loading ? '#cccccc' : '#dc3545', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Processing...' : 'Reset & Start Over'}
                </button>
              )}
            </div>
          </div>
        </>
      )}
      
      <div style={{ 
        marginTop: '20px', 
        border: '1px solid #ccc', 
        borderRadius: '5px', 
        padding: '10px', 
        height: '200px', 
        overflowY: 'auto',
        backgroundColor: '#f9f9f9'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Logs:</h3>
        {logs.map((log, index) => (
          <div key={index} style={{ fontSize: '12px', marginBottom: '5px' }}>{log}</div>
        ))}
      </div>
    </div>
  );
};

export default MicroTokenCreator; 