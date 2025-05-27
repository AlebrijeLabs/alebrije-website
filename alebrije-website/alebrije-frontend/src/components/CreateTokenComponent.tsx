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
  getMint,
  getAccount
} from '@solana/spl-token';
import { toast } from 'react-toastify';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const CreateTokenComponent: React.FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [tokenName, setTokenName] = useState<string>('');
  const [tokenSymbol, setTokenSymbol] = useState<string>('');
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
  
  // Create new token
  const createToken = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet");
      return;
    }
    
    if (!tokenName || !tokenSymbol || tokenDecimals < 0 || tokenSupply <= 0) {
      toast.error("Please fill in all token details");
      return;
    }
    
    try {
      setLoading(true);
      logToUI(`Starting token creation: ${tokenName} (${tokenSymbol})`);
      
      // Generate a new keypair for the mint
      const mintKeypair = Keypair.generate();
      const mintAddress = mintKeypair.publicKey;
      logToUI(`Generated mint address: ${mintAddress.toString()}`);
      
      // Get the rent for the mint account
      const lamports = await getMinimumBalanceForRentExemptMint(connection);
      logToUI(`Required lamports for rent exemption: ${lamports}`);
      
      // Create instructions
      const transaction = new Transaction();
      
      // Create account instruction
      transaction.add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintAddress,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        })
      );
      
      // Initialize mint instruction
      transaction.add(
        createInitializeMintInstruction(
          mintAddress,
          tokenDecimals,
          publicKey,
          publicKey,
          TOKEN_PROGRAM_ID
        )
      );
      
      // Get associated token account for the mint and the user's wallet
      const associatedTokenAccount = await getAssociatedTokenAddress(
        mintAddress,
        publicKey
      );
      
      // Create associated token account instruction
      transaction.add(
        createAssociatedTokenAccountInstruction(
          publicKey,
          associatedTokenAccount,
          publicKey,
          mintAddress
        )
      );
      
      // Calculate the token amount with decimals
      const tokenAmount = tokenSupply * Math.pow(10, tokenDecimals);
      
      // Create mint to instruction
      transaction.add(
        createMintToInstruction(
          mintAddress,
          associatedTokenAccount,
          publicKey,
          BigInt(tokenAmount),
          []
        )
      );
      
      // Get recent blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      // Partially sign the transaction with the mint keypair
      transaction.partialSign(mintKeypair);
      
      // Send the transaction
      logToUI(`Sending transaction...`);
      const signature = await sendTransaction(transaction, connection, {
        signers: [mintKeypair],
      });
      
      logToUI(`Transaction sent: ${signature}`);
      logToUI(`Waiting for confirmation...`);
      
      // Wait for confirmation with a longer timeout and more reliable method
      const confirmationStrategy = {
        signature,
        blockhash,
        lastValidBlockHeight
      };
      
      try {
        await connection.confirmTransaction(confirmationStrategy, 'finalized');
        logToUI(`Transaction confirmed!`);
        
        // Verify the mint exists
        logToUI(`Verifying mint account...`);
        try {
          const mintInfo = await getMint(connection, mintAddress);
          logToUI(`Token created successfully!`);
          logToUI(`Mint address: ${mintAddress.toString()}`);
          logToUI(`Decimals: ${mintInfo.decimals}`);
          logToUI(`Mint authority: ${mintInfo.mintAuthority?.toString() || 'None'}`);
          
          // Verify token account
          logToUI(`Verifying token account...`);
          try {
            const accountInfo = await getAccount(connection, associatedTokenAccount);
            const balance = Number(accountInfo.amount) / Math.pow(10, mintInfo.decimals);
            logToUI(`Token account: ${associatedTokenAccount.toString()}`);
            logToUI(`Initial balance: ${balance}`);
            
            setNewTokenMint(mintAddress.toString());
            toast.success(`Token ${tokenSymbol} created successfully!`);
          } catch (accountError) {
            logToUI(`Error verifying token account: ${accountError instanceof Error ? accountError.message : 'Unknown error'}`);
            logToUI(`Token was created but there might be an issue with the token account.`);
            
            setNewTokenMint(mintAddress.toString());
            toast.warning(`Token created but there might be an issue with the token account.`);
          }
        } catch (mintError) {
          logToUI(`Error verifying mint: ${mintError instanceof Error ? mintError.message : 'Unknown error'}`);
          logToUI(`Transaction was confirmed but there might be an issue with the token creation.`);
          
          toast.error(`Transaction confirmed but token verification failed.`);
        }
      } catch (confirmError) {
        logToUI(`Confirmation error: ${confirmError instanceof Error ? confirmError.message : 'Unknown error'}`);
        logToUI(`Transaction may not have been confirmed. Check on Solana Explorer:`);
        logToUI(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);
        
        toast.error(`Transaction confirmation failed. Check the explorer link in the logs.`);
      }
      
      setLoading(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logToUI(`Token creation failed: ${errorMessage}`);
      console.error('Token creation failed:', error);
      
      toast.error(`Token creation failed: ${errorMessage}`);
      setLoading(false);
    }
  };
  
  // Add a function to check token status
  const checkTokenStatus = async () => {
    if (!newTokenMint) {
      toast.error("No token mint address to check");
      return;
    }
    
    try {
      setLoading(true);
      logToUI(`Checking token status for: ${newTokenMint}`);
      
      // Try to get the mint info
      const mintInfo = await getMint(connection, new PublicKey(newTokenMint));
      
      logToUI(`Token exists!`);
      logToUI(`Supply: ${Number(mintInfo.supply) / Math.pow(10, mintInfo.decimals)}`);
      logToUI(`Decimals: ${mintInfo.decimals}`);
      logToUI(`Mint Authority: ${mintInfo.mintAuthority?.toString() || 'None'}`);
      logToUI(`Freeze Authority: ${mintInfo.freezeAuthority?.toString() || 'None'}`);
      
      const isMintAuthority = mintInfo.mintAuthority && publicKey && mintInfo.mintAuthority.equals(publicKey);
      logToUI(`You are ${isMintAuthority ? '' : 'not '}the mint authority.`);
      
      toast.success("Token exists and was checked successfully!");
      
      setLoading(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logToUI(`Token check failed: ${errorMessage}`);
      console.error('Token check failed:', error);
      
      toast.error(`Token check failed: ${errorMessage}`);
      setLoading(false);
    }
  };
  
  if (!publicKey) {
    return (
      <div>
        <h2>Create New Token</h2>
        <p>Connect your wallet to create a new token.</p>
        <WalletMultiButton />
      </div>
    );
  }
  
  return (
    <div>
      <h2>Create New Token</h2>
      <p>Current wallet: {publicKey.toString()}</p>
      
      {newTokenMint ? (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#e6f7e6', 
          borderRadius: '5px',
          border: '1px solid #c3e6cb'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>Token Created Successfully!</h3>
          <p style={{ margin: '0 0 5px 0' }}><strong>Mint Address:</strong> {newTokenMint}</p>
          <p style={{ margin: '0' }}>Your wallet is the mint authority for this token.</p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Token Name</label>
            <input
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              placeholder="e.g., My Token"
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '5px', 
                border: '1px solid #ccc' 
              }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Token Symbol</label>
            <input
              type="text"
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
              placeholder="e.g., MTK"
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
            disabled={loading || !tokenName || !tokenSymbol || tokenDecimals < 0 || tokenSupply <= 0} 
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
            {loading ? 'Creating Token...' : 'Create Token'}
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

export default CreateTokenComponent; 