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

const SimpleTokenCreator: React.FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [tokenSymbol, setTokenSymbol] = useState<string>('ALEBRIJE');
  const [tokenDecimals, setTokenDecimals] = useState<number>(9);
  const [tokenSupply, setTokenSupply] = useState<number>(1000000000);
  const [newTokenMint, setNewTokenMint] = useState<string | null>(null);
  
  // Initialize connection
  const connection = new Connection('https://api.devnet.solana.com', {
    commitment: 'confirmed',
  });
  
  // Log to UI
  const logToUI = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `${timestamp}: ${message}`;
    setLogs(prevLogs => [...prevLogs, logMessage]);
    console.log(logMessage);
  };
  
  // Create new token - simplified approach
  const createToken = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet");
      return;
    }
    
    try {
      setLoading(true);
      logToUI(`Starting simplified token creation: ${tokenSymbol}`);
      
      // Generate a new keypair for the mint
      const mintKeypair = Keypair.generate();
      const mintAddress = mintKeypair.publicKey;
      logToUI(`Generated mint address: ${mintAddress.toString()}`);
      
      // Get the rent for the mint account
      const lamports = await getMinimumBalanceForRentExemptMint(connection);
      logToUI(`Required lamports for rent exemption: ${lamports}`);
      
      // Create account instruction
      const createAccountInstruction = SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mintAddress,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      });
      
      // Initialize mint instruction
      const initMintInstruction = createInitializeMintInstruction(
        mintAddress,
        tokenDecimals,
        publicKey,
        publicKey,
        TOKEN_PROGRAM_ID
      );
      
      // Create transaction for creating the mint
      const createMintTransaction = new Transaction().add(
        createAccountInstruction,
        initMintInstruction
      );
      
      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      createMintTransaction.recentBlockhash = blockhash;
      createMintTransaction.feePayer = publicKey;
      
      // Partially sign the transaction with the mint keypair
      createMintTransaction.partialSign(mintKeypair);
      
      // Send the transaction to create the mint
      logToUI(`Sending transaction to create mint...`);
      const createMintSignature = await sendTransaction(createMintTransaction, connection, {
        signers: [mintKeypair],
      });
      
      logToUI(`Mint creation transaction sent: ${createMintSignature}`);
      logToUI(`Waiting for confirmation...`);
      
      // Wait for confirmation
      const createMintConfirmation = await connection.confirmTransaction(createMintSignature, 'confirmed');
      
      if (createMintConfirmation.value.err) {
        logToUI(`Mint creation failed: ${JSON.stringify(createMintConfirmation.value.err)}`);
        toast.error("Token creation failed");
        setLoading(false);
        return;
      }
      
      logToUI(`Mint created successfully!`);
      
      // Now create the associated token account and mint tokens in a separate transaction
      logToUI(`Creating token account and minting tokens...`);
      
      // Get associated token account for the mint and the user's wallet
      const associatedTokenAccount = await getAssociatedTokenAddress(
        mintAddress,
        publicKey
      );
      
      // Create associated token account instruction
      const createATAInstruction = createAssociatedTokenAccountInstruction(
        publicKey,
        associatedTokenAccount,
        publicKey,
        mintAddress
      );
      
      // Calculate the token amount with decimals
      const tokenAmount = tokenSupply * Math.pow(10, tokenDecimals);
      
      // Create mint to instruction
      const mintToInstruction = createMintToInstruction(
        mintAddress,
        associatedTokenAccount,
        publicKey,
        BigInt(tokenAmount),
        []
      );
      
      // Create transaction for token account and minting
      const mintTokensTransaction = new Transaction().add(
        createATAInstruction,
        mintToInstruction
      );
      
      // Get recent blockhash
      const { blockhash: mintBlockhash } = await connection.getLatestBlockhash('confirmed');
      mintTokensTransaction.recentBlockhash = mintBlockhash;
      mintTokensTransaction.feePayer = publicKey;
      
      // Send the transaction to create token account and mint tokens
      logToUI(`Sending transaction to create token account and mint tokens...`);
      const mintTokensSignature = await sendTransaction(mintTokensTransaction, connection);
      
      logToUI(`Token account and minting transaction sent: ${mintTokensSignature}`);
      logToUI(`Waiting for confirmation...`);
      
      // Wait for confirmation
      const mintTokensConfirmation = await connection.confirmTransaction(mintTokensSignature, 'confirmed');
      
      if (mintTokensConfirmation.value.err) {
        logToUI(`Token account creation or minting failed: ${JSON.stringify(mintTokensConfirmation.value.err)}`);
        toast.error("Token account creation or minting failed");
        setLoading(false);
        return;
      }
      
      logToUI(`Token account created and tokens minted successfully!`);
      logToUI(`Mint address: ${mintAddress.toString()}`);
      logToUI(`Token account: ${associatedTokenAccount.toString()}`);
      
      setNewTokenMint(mintAddress.toString());
      toast.success(`Token ${tokenSymbol} created successfully!`);
      
      setLoading(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logToUI(`Token creation failed: ${errorMessage}`);
      console.error('Token creation failed:', error);
      
      toast.error(`Token creation failed: ${errorMessage}`);
      setLoading(false);
    }
  };
  
  if (!publicKey) {
    return (
      <div>
        <h2>Simple Token Creator</h2>
        <p>Connect your wallet to create a token.</p>
        <WalletMultiButton />
      </div>
    );
  }
  
  return (
    <div>
      <h2>Simple Token Creator</h2>
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
          
          <a 
            href={`https://explorer.solana.com/address/${newTokenMint}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              padding: '8px 15px', 
              backgroundColor: '#17a2b8', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              textDecoration: 'none',
              textAlign: 'center',
              display: 'block'
            }}
          >
            View on Explorer
          </a>
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
            />
          </div>
          
          <button 
            onClick={createToken} 
            disabled={loading || !tokenSymbol || tokenDecimals < 0 || tokenSupply <= 0} 
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
            {loading ? 'Creating Token...' : 'Create Token (Simplified)'}
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

export default SimpleTokenCreator; 