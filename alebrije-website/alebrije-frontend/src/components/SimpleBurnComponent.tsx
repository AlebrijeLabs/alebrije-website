import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { 
  getAssociatedTokenAddress, 
  getAccount, 
  createBurnInstruction, 
  TOKEN_PROGRAM_ID 
} from '@solana/spl-token';
import { toast } from 'react-toastify';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const SimpleBurnComponent: React.FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [mintAddress, setMintAddress] = useState<string>('');
  const [burnAmount, setBurnAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [tokenInfo, setTokenInfo] = useState<{
    decimals: number;
    balance: number;
  } | null>(null);
  
  // Log to UI
  const logToUI = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `${timestamp}: ${message}`;
    setLogs(prevLogs => [...prevLogs, logMessage]);
    console.log(logMessage);
  };
  
  // Check if mint address is valid
  const isMintAddressValid = (address: string): boolean => {
    try {
      new PublicKey(address);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  // Check token details
  const checkTokenDetails = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet");
      return;
    }
    
    if (!isMintAddressValid(mintAddress)) {
      logToUI(`Invalid mint address format: ${mintAddress}`);
      toast.error("Invalid mint address format");
      return;
    }
    
    try {
      setLoading(true);
      logToUI(`Checking token details for mint: ${mintAddress}`);
      
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
        
        setTokenInfo({
          decimals,
          balance
        });
        
        toast.success("Token details fetched successfully");
        logToUI(`You can burn tokens that you own, even if you're not the mint authority.`);
      } catch (error) {
        logToUI(`No token account found or error fetching details`);
        setTokenInfo(null);
      }
      
      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logToUI(`Error checking token details: ${errorMessage}`);
      console.error('Error checking token details:', error);
      
      toast.error(`Error checking token details: ${errorMessage}`);
      setLoading(false);
    }
  };
  
  // Burn tokens
  const burnTokens = async () => {
    if (!publicKey || !tokenInfo) {
      toast.error("Please connect your wallet and check token details first");
      return;
    }
    
    const burnAmountNumber = parseFloat(burnAmount);
    if (isNaN(burnAmountNumber) || burnAmountNumber <= 0) {
      toast.error("Please enter a valid burn amount");
      return;
    }
    
    if (burnAmountNumber > tokenInfo.balance) {
      toast.error(`You can't burn more than your balance of ${tokenInfo.balance}`);
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
      
      // Calculate token amount with decimals
      const tokenAmount = Math.floor(burnAmountNumber * Math.pow(10, tokenInfo.decimals));
      
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
        
        // Refresh token details
        await checkTokenDetails();
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
        <h2>Simple Burn Component</h2>
        <p>Connect your wallet to burn tokens.</p>
        <WalletMultiButton />
      </div>
    );
  }
  
  return (
    <div>
      <h2>Simple Burn Component</h2>
      <p>Current wallet: {publicKey.toString()}</p>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Token Mint Address</label>
        <input
          type="text"
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
          placeholder="e.g., 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
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
        {loading ? 'Checking...' : 'Check Token Details'}
      </button>
      
      {tokenInfo && (
        <>
          <div style={{ 
            marginBottom: '15px', 
            padding: '10px', 
            backgroundColor: '#e6f7e6', 
            borderRadius: '5px',
            border: '1px solid #c3e6cb'
          }}>
            <p style={{ margin: '0 0 5px 0' }}><strong>Token Decimals:</strong> {tokenInfo.decimals}</p>
            <p style={{ margin: '0' }}><strong>Your Balance:</strong> {tokenInfo.balance}</p>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Amount to Burn</label>
            <input
              type="number"
              value={burnAmount}
              onChange={(e) => setBurnAmount(e.target.value)}
              placeholder={`Max: ${tokenInfo.balance}`}
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
            disabled={loading || !burnAmount || parseFloat(burnAmount) <= 0 || parseFloat(burnAmount) > tokenInfo.balance} 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: loading ? '#cccccc' : '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: loading || !burnAmount || parseFloat(burnAmount) <= 0 || parseFloat(burnAmount) > tokenInfo.balance ? 'not-allowed' : 'pointer',
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

export default SimpleBurnComponent; 