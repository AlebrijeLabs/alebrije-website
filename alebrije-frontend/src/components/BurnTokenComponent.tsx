import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { 
  getAssociatedTokenAddress, 
  createBurnInstruction, 
  getMint, 
  getAccount 
} from '@solana/spl-token';
import { toast } from 'react-toastify';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const BurnTokenComponent: React.FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [mintAddress, setMintAddress] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [isMintAuthority, setIsMintAuthority] = useState<boolean>(false);
  
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
  
  // Check token details
  const checkTokenDetails = async () => {
    if (!publicKey || !mintAddress) return;
    
    try {
      setLoading(true);
      logToUI(`Checking token details for mint: ${mintAddress}`);
      
      // Validate mint address
      let mint;
      try {
        mint = new PublicKey(mintAddress);
        logToUI(`Mint address is valid format: ${mint.toString()}`);
      } catch (error) {
        logToUI(`Invalid mint address format: ${error instanceof Error ? error.message : 'Unknown error'}`);
        toast.error("Invalid mint address format");
        setLoading(false);
        return;
      }
      
      // Get mint info
      try {
        logToUI(`Fetching mint info from Solana...`);
        const mintInfo = await getMint(connection, mint);
        
        logToUI(`Token decimals: ${mintInfo.decimals}`);
        
        if (mintInfo.mintAuthority) {
          logToUI(`Mint authority: ${mintInfo.mintAuthority.toString()}`);
          
          // Check if current wallet is mint authority
          const isAuthority = publicKey.equals(mintInfo.mintAuthority);
          setIsMintAuthority(isAuthority);
          logToUI(`Current wallet is mint authority: ${isAuthority}`);
          
          if (!isAuthority) {
            logToUI(`You are not the mint authority. Only ${mintInfo.mintAuthority.toString()} can burn tokens.`);
            logToUI(`However, you can still burn tokens that you own.`);
          }
        } else {
          logToUI(`Token has no mint authority (it's been revoked)`);
          setIsMintAuthority(false);
        }
        
        // Get token account
        logToUI(`Finding your token account for this mint...`);
        const tokenAccount = await getAssociatedTokenAddress(mint, publicKey);
        logToUI(`Checking token account: ${tokenAccount.toString()}`);
        
        try {
          const accountInfo = await getAccount(connection, tokenAccount);
          const balance = Number(accountInfo.amount) / Math.pow(10, mintInfo.decimals);
          setTokenBalance(balance);
          logToUI(`Current token balance: ${balance}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          logToUI(`No token account found: ${errorMessage}`);
          logToUI(`You don't own any of these tokens or the token account hasn't been created yet.`);
          setTokenBalance(0);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logToUI(`Error getting mint info: ${errorMessage}`);
        
        // Check if the error is because the account doesn't exist
        if (errorMessage.includes("Account does not exist") || errorMessage.includes("not found")) {
          logToUI(`The token mint account doesn't exist on the blockchain.`);
          logToUI(`This could mean:`);
          logToUI(`1. The token creation transaction failed or is still pending`);
          logToUI(`2. You're on the wrong network (make sure you're on devnet)`);
          logToUI(`3. The mint address is incorrect`);
          
          // Try to check the transaction status if we have it
          logToUI(`Try checking the token creation transaction on Solana Explorer.`);
        }
        
        toast.error("Error getting token information");
        setLoading(false);
        return;
      }
      
      setLoading(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logToUI(`Error checking token details: ${errorMessage}`);
      console.error('Error checking token details:', error);
      
      toast.error(`Error checking token details: ${errorMessage}`);
      setLoading(false);
    }
  };
  
  // Burn tokens
  const burnTokens = async () => {
    if (!publicKey || !mintAddress || !amount || amount <= 0) {
      toast.error("Please enter a valid amount to burn");
      return;
    }
    
    try {
      setLoading(true);
      logToUI(`Starting burn of ${amount} tokens...`);
      
      // Validate mint address
      let mint;
      try {
        mint = new PublicKey(mintAddress);
      } catch (error) {
        logToUI(`Invalid mint address format`);
        toast.error("Invalid mint address format");
        setLoading(false);
        return;
      }
      
      // Get mint info
      const mintInfo = await getMint(connection, mint);
      
      // Get token account
      const tokenAccount = await getAssociatedTokenAddress(mint, publicKey);
      logToUI(`Token account: ${tokenAccount.toString()}`);
      
      // Check token balance
      const accountInfo = await getAccount(connection, tokenAccount);
      const balance = Number(accountInfo.amount) / Math.pow(10, mintInfo.decimals);
      
      if (balance < amount) {
        logToUI(`Insufficient token balance. You have ${balance} tokens.`);
        toast.error(`Insufficient token balance. You have ${balance} tokens.`);
        setLoading(false);
        return;
      }
      
      // Calculate amount with decimals
      const burnAmount = BigInt(Math.floor(amount * Math.pow(10, mintInfo.decimals)));
      logToUI(`Burn amount with decimals: ${burnAmount.toString()}`);
      
      // Create transaction
      const transaction = new Transaction();
      
      // Create burn instruction
      const burnInstruction = createBurnInstruction(
        tokenAccount,
        mint,
        publicKey,
        burnAmount
      );
      
      transaction.add(burnInstruction);
      
      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      
      logToUI(`Transaction sent: ${signature}`);
      
      // Wait for confirmation
      try {
        const confirmation = await connection.confirmTransaction(signature, 'confirmed');
        
        if (confirmation.value.err) {
          logToUI(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
          toast.error("Burn failed");
        } else {
          logToUI(`Tokens burned successfully!`);
          
          // Update token balance
          await checkTokenDetails();
          
          toast.success(`${amount} tokens burned successfully!`);
        }
      } catch (confirmError) {
        const errorMessage = confirmError instanceof Error ? confirmError.message : 'Unknown error';
        logToUI(`Confirmation timed out: ${errorMessage}`);
        logToUI(`Your transaction may still have succeeded.`);
        logToUI(`Check your transaction: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
        
        toast.warning("Transaction sent but confirmation timed out. Check the explorer link in the logs.");
        
        // Try to update token balance anyway
        setTimeout(checkTokenDetails, 5000);
      }
      
      setLoading(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logToUI(`Burn failed: ${errorMessage}`);
      console.error('Burn failed:', error);
      
      toast.error(`Burn failed: ${errorMessage}`);
      setLoading(false);
    }
  };
  
  // Add a function to create the token account if it doesn't exist
  const createTokenAccount = async () => {
    if (!publicKey || !mintAddress) {
      toast.error("Please enter a valid mint address");
      return;
    }
    
    try {
      setLoading(true);
      logToUI(`Creating token account for mint: ${mintAddress}`);
      
      // Validate mint address
      let mint;
      try {
        mint = new PublicKey(mintAddress);
      } catch (error) {
        logToUI(`Invalid mint address format`);
        toast.error("Invalid mint address format");
        setLoading(false);
        return;
      }
      
      // Get associated token address
      const tokenAccount = await getAssociatedTokenAddress(mint, publicKey);
      logToUI(`Associated token account address: ${tokenAccount.toString()}`);
      
      // Check if the account already exists
      try {
        await getAccount(connection, tokenAccount);
        logToUI(`Token account already exists!`);
        toast.info("Token account already exists");
        setLoading(false);
        return;
      } catch (error) {
        // Account doesn't exist, which is what we want
        logToUI(`Token account doesn't exist yet. Creating...`);
      }
      
      // Create the associated token account
      const { createAssociatedTokenAccountInstruction } = await import('@solana/spl-token');
      
      const transaction = new Transaction();
      
      transaction.add(
        createAssociatedTokenAccountInstruction(
          publicKey,
          tokenAccount,
          publicKey,
          mint
        )
      );
      
      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      
      logToUI(`Transaction sent: ${signature}`);
      
      // Wait for confirmation
      try {
        const confirmation = await connection.confirmTransaction(signature, 'confirmed');
        
        if (confirmation.value.err) {
          logToUI(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
          toast.error("Failed to create token account");
        } else {
          logToUI(`Token account created successfully!`);
          toast.success("Token account created successfully!");
          
          // Check token details again
          await checkTokenDetails();
        }
      } catch (confirmError) {
        const errorMessage = confirmError instanceof Error ? confirmError.message : 'Unknown error';
        logToUI(`Confirmation timed out: ${errorMessage}`);
        logToUI(`Your transaction may still have succeeded.`);
        logToUI(`Check your transaction: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
        
        toast.warning("Transaction sent but confirmation timed out. Check the explorer link in the logs.");
      }
      
      setLoading(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logToUI(`Error creating token account: ${errorMessage}`);
      console.error('Error creating token account:', error);
      
      toast.error(`Error creating token account: ${errorMessage}`);
      setLoading(false);
    }
  };
  
  // Effect to check token details when mint address changes
  useEffect(() => {
    if (publicKey && mintAddress) {
      checkTokenDetails();
    }
  }, [publicKey, mintAddress]);
  
  if (!publicKey) {
    return (
      <div>
        <h2>Burn Tokens</h2>
        <p>Connect your wallet to burn tokens.</p>
        <WalletMultiButton />
      </div>
    );
  }
  
  return (
    <div>
      <h2>Burn Tokens</h2>
      <p>Current wallet: {publicKey.toString()}</p>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Token Mint Address</label>
        <input
          type="text"
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
          placeholder="Enter token mint address"
          style={{ 
            width: '100%', 
            padding: '8px', 
            borderRadius: '5px', 
            border: '1px solid #ccc' 
          }}
        />
      </div>
      
      <button 
        onClick={checkTokenDetails} 
        disabled={loading || !mintAddress} 
        style={{ 
          padding: '8px 15px', 
          backgroundColor: loading ? '#cccccc' : '#17a2b8', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%',
          marginBottom: '15px'
        }}
      >
        {loading ? 'Checking...' : 'Check Token Details'}
      </button>
      
      <button 
        onClick={createTokenAccount} 
        disabled={loading || !mintAddress} 
        style={{ 
          padding: '8px 15px', 
          backgroundColor: loading ? '#cccccc' : '#28a745', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%',
          marginBottom: '15px'
        }}
      >
        {loading ? 'Processing...' : 'Create Token Account (if needed)'}
      </button>
      
      {tokenBalance !== null && (
        <div style={{ 
          marginBottom: '15px', 
          padding: '10px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '5px',
          border: '1px solid #dee2e6'
        }}>
          <p style={{ margin: '0 0 5px 0' }}><strong>Your token balance:</strong> {tokenBalance}</p>
          <p style={{ margin: '0' }}><strong>Mint authority status:</strong> {isMintAuthority ? 'You are the mint authority' : 'You are NOT the mint authority'}</p>
        </div>
      )}
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Amount to Burn</label>
        <input
          type="number"
          value={amount || ''}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter amount to burn"
          disabled={!isMintAuthority}
          style={{ 
            width: '100%', 
            padding: '8px', 
            borderRadius: '5px', 
            border: '1px solid #ccc',
            backgroundColor: isMintAuthority ? 'white' : '#f5f5f5'
          }}
        />
      </div>
      
      {tokenBalance !== null && tokenBalance > 0 ? (
        <button 
          onClick={burnTokens} 
          disabled={loading || !amount || parseFloat(amount.toString()) <= 0 || (tokenBalance !== null && parseFloat(amount.toString()) > tokenBalance)} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: loading ? '#cccccc' : '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: loading || !amount || parseFloat(amount.toString()) <= 0 || (tokenBalance !== null && parseFloat(amount.toString()) > tokenBalance) ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          {loading ? 'Burning...' : 'Burn Tokens'}
        </button>
      ) : (
        <button 
          disabled={true} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#cccccc', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'not-allowed',
            width: '100%'
          }}
        >
          No Tokens to Burn
        </button>
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

export default BurnTokenComponent; 