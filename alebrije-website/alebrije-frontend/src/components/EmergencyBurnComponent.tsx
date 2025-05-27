import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { 
  getAssociatedTokenAddress, 
  createBurnInstruction,
  getAccount
} from '@solana/spl-token';
import { toast } from 'react-toastify';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const EmergencyBurnComponent: React.FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [mintAddress, setMintAddress] = useState<string>('FSx3upaoPomkueMg7rftj8dy75GeifDL7qGbBSSC9KRt');
  const [burnAmount, setBurnAmount] = useState<string>('10');
  const [loading, setLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  
  // Log to UI
  const logToUI = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `${timestamp}: ${message}`;
    setLogs(prevLogs => [...prevLogs, logMessage]);
    console.log(logMessage);
  };
  
  // Check token balance
  const checkBalance = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet");
      return;
    }
    
    try {
      setLoading(true);
      logToUI(`Checking token balance for mint: ${mintAddress}`);
      
      const mintPublicKey = new PublicKey(mintAddress);
      
      // Get token account
      const tokenAccountAddress = await getAssociatedTokenAddress(
        mintPublicKey,
        publicKey
      );
      
      logToUI(`Checking token account: ${tokenAccountAddress.toString()}`);
      
      try {
        // Get token account info
        const tokenAccountInfo = await getAccount(connection, tokenAccountAddress);
        
        // Get token mint info
        const mintInfo = await connection.getParsedAccountInfo(mintPublicKey);
        if (!mintInfo.value) {
          throw new Error("Mint not found");
        }
        
        const data: any = mintInfo.value.data;
        const decimals = data.parsed.info.decimals;
        
        // Calculate token balance
        const balance = Number(tokenAccountInfo.amount) / Math.pow(10, decimals);
        
        logToUI(`Token decimals: ${decimals}`);
        logToUI(`Token balance: ${balance}`);
        
        setTokenBalance(balance);
        
        toast.success("Token balance fetched successfully");
      } catch (error) {
        logToUI(`No token account found or error fetching details`);
        setTokenBalance(null);
      }
      
      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logToUI(`Error checking token balance: ${errorMessage}`);
      console.error('Error checking token balance:', error);
      
      toast.error(`Error checking token balance: ${errorMessage}`);
      setLoading(false);
    }
  };
  
  // Burn tokens
  const burnTokens = async () => {
    if (!publicKey || tokenBalance === null) {
      toast.error("Please connect your wallet and check token balance first");
      return;
    }
    
    const burnAmountNumber = parseFloat(burnAmount);
    if (isNaN(burnAmountNumber) || burnAmountNumber <= 0) {
      toast.error("Please enter a valid burn amount");
      return;
    }
    
    if (burnAmountNumber > tokenBalance) {
      toast.error(`You can't burn more than your balance of ${tokenBalance}`);
      return;
    }
    
    try {
      setLoading(true);
      logToUI(`Burning ${burnAmount} tokens...`);
      
      const mintPublicKey = new PublicKey(mintAddress);
      
      // Get token account
      const tokenAccountAddress = await getAssociatedTokenAddress(
        mintPublicKey,
        publicKey
      );
      
      // Get token mint info
      const mintInfo = await connection.getParsedAccountInfo(mintPublicKey);
      if (!mintInfo.value) {
        throw new Error("Mint not found");
      }
      
      const data: any = mintInfo.value.data;
      const decimals = data.parsed.info.decimals;
      
      // Calculate token amount with decimals
      const tokenAmount = Math.floor(burnAmountNumber * Math.pow(10, decimals));
      
      // Create burn instruction
      const burnInstruction = createBurnInstruction(
        tokenAccountAddress,
        mintPublicKey,
        publicKey,
        tokenAmount
      );
      
      // Create a transaction with the burn instruction
      const transaction = new Transaction().add(burnInstruction);
      
      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      
      logToUI(`Burn transaction sent: ${signature}`);
      logToUI(`Waiting for confirmation...`);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        logToUI(`Burn failed: ${JSON.stringify(confirmation.value.err)}`);
        toast.error("Burn failed");
      } else {
        logToUI(`Tokens burned successfully!`);
        toast.success("Tokens burned successfully!");
        
        // Refresh token balance
        await checkBalance();
      }
      
      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logToUI(`Error burning tokens: ${errorMessage}`);
      console.error('Error burning tokens:', error);
      
      toast.error(`Error burning tokens: ${errorMessage}`);
      setLoading(false);
    }
  };
  
  if (!publicKey) {
    return (
      <div>
        <h2>Emergency Burn Component</h2>
        <p>Connect your wallet to burn tokens.</p>
        <WalletMultiButton />
      </div>
    );
  }
  
  return (
    <div>
      <h2>Emergency Burn Component</h2>
      <p>Current wallet: {publicKey.toString()}</p>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Token Mint Address</label>
        <input
          type="text"
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '8px', 
            borderRadius: '5px', 
            border: '1px solid #ccc' 
          }}
        />
      </div>
      
      <button 
        onClick={checkBalance} 
        disabled={loading || !mintAddress} 
        style={{ 
          padding: '10px 20px', 
          backgroundColor: loading ? '#cccccc' : '#4444ff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: loading || !mintAddress ? 'not-allowed' : 'pointer',
          width: '100%',
          marginBottom: '15px'
        }}
      >
        {loading ? 'Checking...' : 'Check Token Balance'}
      </button>
      
      {tokenBalance !== null && (
        <>
          <div style={{ 
            marginBottom: '15px', 
            padding: '10px', 
            backgroundColor: '#e6f7e6', 
            borderRadius: '5px',
            border: '1px solid #c3e6cb'
          }}>
            <p style={{ margin: '0' }}><strong>Your Balance:</strong> {tokenBalance}</p>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Amount to Burn</label>
            <input
              type="number"
              value={burnAmount}
              onChange={(e) => setBurnAmount(e.target.value)}
              placeholder={`Max: ${tokenBalance}`}
              style={{ 
                width: '100%', 
                padding: '8px', 
                borderRadius: '5px', 
                border: '1px solid #ccc' 
              }}
            />
          </div>
          
          <button 
            onClick={burnTokens} 
            disabled={loading || !burnAmount || parseFloat(burnAmount) <= 0 || parseFloat(burnAmount) > tokenBalance} 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: loading ? '#cccccc' : '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: loading || !burnAmount || parseFloat(burnAmount) <= 0 || parseFloat(burnAmount) > tokenBalance ? 'not-allowed' : 'pointer',
              width: '100%'
            }}
          >
            {loading ? 'Burning...' : 'Burn Tokens'}
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

export default EmergencyBurnComponent; 