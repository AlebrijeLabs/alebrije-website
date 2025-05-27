import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction, 
  SystemProgram, 
  sendAndConfirmTransaction 
} from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID, 
  MINT_SIZE, 
  getMinimumBalanceForRentExemptMint,
  createInitializeMintInstruction
} from '@solana/spl-token';
import { toast } from 'react-toastify';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const BasicTokenCreator: React.FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [tokenDecimals, setTokenDecimals] = useState<number>(9);
  const [newTokenMint, setNewTokenMint] = useState<string | null>(null);
  
  // Log to UI
  const logToUI = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `${timestamp}: ${message}`;
    setLogs(prevLogs => [...prevLogs, logMessage]);
    console.log(logMessage);
  };
  
  // Create new token - using a more direct approach
  const createToken = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet");
      return;
    }
    
    try {
      setLoading(true);
      logToUI(`Starting basic token creation with ${tokenDecimals} decimals`);
      
      // Generate a new keypair for the mint
      const mintKeypair = Keypair.generate();
      logToUI(`Generated mint address: ${mintKeypair.publicKey.toString()}`);
      
      // Get the rent for the mint account
      const lamports = await getMinimumBalanceForRentExemptMint(connection);
      logToUI(`Required lamports for rent exemption: ${lamports}`);
      
      // Create a transaction to create the mint account
      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
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
      
      // Partially sign the transaction with the mint keypair
      transaction.partialSign(mintKeypair);
      
      // Send transaction
      logToUI(`Sending transaction to create token...`);
      const signature = await sendTransaction(transaction, connection, {
        signers: [mintKeypair],
      });
      
      logToUI(`Token creation transaction sent: ${signature}`);
      logToUI(`Waiting for confirmation...`);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        logToUI(`Token creation failed: ${JSON.stringify(confirmation.value.err)}`);
        toast.error("Token creation failed");
      } else {
        logToUI(`Token created successfully!`);
        logToUI(`Mint address: ${mintKeypair.publicKey.toString()}`);
        setNewTokenMint(mintKeypair.publicKey.toString());
        toast.success("Token created successfully!");
      }
      
      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logToUI(`Error creating token: ${errorMessage}`);
      console.error('Error creating token:', error);
      
      toast.error(`Error creating token: ${errorMessage}`);
      setLoading(false);
    }
  };
  
  // Reset the form
  const reset = () => {
    setNewTokenMint(null);
  };
  
  if (!publicKey) {
    return (
      <div>
        <h2>Basic Token Creator</h2>
        <p>Connect your wallet to create a token with minimal instructions.</p>
        <WalletMultiButton />
      </div>
    );
  }
  
  return (
    <div>
      <h2>Basic Token Creator</h2>
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
            />
          </div>
          
          <button 
            onClick={createToken} 
            disabled={loading || tokenDecimals < 0} 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: loading ? '#cccccc' : '#4444ff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%'
            }}
          >
            {loading ? 'Creating Token...' : 'Create Basic Token'}
          </button>
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

export default BasicTokenCreator; 