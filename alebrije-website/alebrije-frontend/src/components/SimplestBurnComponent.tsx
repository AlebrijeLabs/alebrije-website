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

const SimplestBurnComponent: React.FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [burnAmount, setBurnAmount] = useState<string>('10');
  
  // Log to UI
  const logToUI = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `${timestamp}: ${message}`;
    setLogs(prevLogs => [...prevLogs, logMessage]);
    console.log(logMessage);
  };
  
  // Burn tokens
  const burnTokens = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet");
      return;
    }
    
    try {
      setLoading(true);
      
      // Hardcoded token mint address for FSx3upaoPomkueMg7rftj8dy75GeifDL7qGbBSSC9KRt
      const mintAddress = "FSx3upaoPomkueMg7rftj8dy75GeifDL7qGbBSSC9KRt";
      const mintPublicKey = new PublicKey(mintAddress);
      
      logToUI(`Burning ${burnAmount} tokens from mint ${mintAddress}...`);
      
      // Get token account
      const tokenAccountAddress = await getAssociatedTokenAddress(
        mintPublicKey,
        publicKey
      );
      
      logToUI(`Using token account: ${tokenAccountAddress.toString()}`);
      
      // Get token account info to check balance
      const tokenAccountInfo = await getAccount(connection, tokenAccountAddress);
      const balance = Number(tokenAccountInfo.amount);
      
      logToUI(`Current token balance: ${balance}`);
      
      // Get token mint info for decimals
      const mintInfo = await connection.getParsedAccountInfo(mintPublicKey);
      if (!mintInfo.value) {
        throw new Error("Mint not found");
      }
      
      const data: any = mintInfo.value.data;
      const decimals = data.parsed.info.decimals;
      
      logToUI(`Token decimals: ${decimals}`);
      
      // Calculate token amount with decimals
      const burnAmountNumber = parseFloat(burnAmount);
      const tokenAmount = Math.floor(burnAmountNumber * Math.pow(10, decimals));
      
      if (tokenAmount > balance) {
        throw new Error(`Cannot burn more than your balance of ${balance / Math.pow(10, decimals)}`);
      }
      
      logToUI(`Creating burn instruction for ${tokenAmount} tokens (${burnAmount} with decimals)...`);
      
      // Create burn instruction
      const burnInstruction = createBurnInstruction(
        tokenAccountAddress,
        mintPublicKey,
        publicKey,
        tokenAmount
      );
      
      // Create a transaction with the burn instruction
      const transaction = new Transaction().add(burnInstruction);
      
      // Get the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      logToUI(`Sending burn transaction...`);
      // Sign and send the transaction
      const signature = await sendTransaction(transaction, connection);
      logToUI(`Burn transaction sent: ${signature}`);
      
      // Instead of waiting for confirmation here, just provide the transaction signature
      logToUI(`Transaction submitted. Check status at: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      toast.success(`Transaction submitted. Check status in Solana Explorer.`);
      
      // Don't try to check the new balance immediately, as the transaction might not be confirmed yet
      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logToUI(`Error burning tokens: ${errorMessage}`);
      console.error('Error burning tokens:', error);
      
      toast.error(`Error burning tokens: ${errorMessage}`);
      setLoading(false);
    }
  };
  
  // Add a checkBalance function that doesn't burn tokens
  const checkBalance = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet");
      return;
    }
    
    try {
      setLoading(true);
      
      // Hardcoded token mint address
      const mintAddress = "FSx3upaoPomkueMg7rftj8dy75GeifDL7qGbBSSC9KRt";
      const mintPublicKey = new PublicKey(mintAddress);
      
      logToUI(`Checking token balance for mint ${mintAddress}...`);
      
      // Get token account
      const tokenAccountAddress = await getAssociatedTokenAddress(
        mintPublicKey,
        publicKey
      );
      
      logToUI(`Using token account: ${tokenAccountAddress.toString()}`);
      
      // Get token account info
      const tokenAccountInfo = await getAccount(connection, tokenAccountAddress);
      const balance = Number(tokenAccountInfo.amount);
      
      // Get token mint info for decimals
      const mintInfo = await connection.getParsedAccountInfo(mintPublicKey);
      if (!mintInfo.value) {
        throw new Error("Mint not found");
      }
      
      const data: any = mintInfo.value.data;
      const decimals = data.parsed.info.decimals;
      
      // Calculate token balance with decimals
      const balanceWithDecimals = balance / Math.pow(10, decimals);
      
      logToUI(`Token decimals: ${decimals}`);
      logToUI(`Current token balance: ${balance} (${balanceWithDecimals} with decimals)`);
      
      toast.success("Token balance checked successfully");
      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logToUI(`Error checking token balance: ${errorMessage}`);
      console.error('Error checking token balance:', error);
      
      toast.error(`Error checking token balance: ${errorMessage}`);
      setLoading(false);
    }
  };
  
  if (!publicKey) {
    return (
      <div>
        <h2>Simplest Burn Component</h2>
        <p>Connect your wallet to burn tokens.</p>
        <WalletMultiButton />
      </div>
    );
  }
  
  return (
    <div>
      <h2>Simplest Burn Component</h2>
      <p>Current wallet: {publicKey.toString()}</p>
      
      <div style={{ 
        marginBottom: '15px', 
        padding: '10px', 
        backgroundColor: '#e6f7e6', 
        borderRadius: '5px',
        border: '1px solid #c3e6cb'
      }}>
        <p style={{ margin: '0' }}><strong>Token:</strong> FSx3upaoPomkueMg7rftj8dy75GeifDL7qGbBSSC9KRt</p>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Amount to Burn</label>
        <input
          type="number"
          value={burnAmount}
          onChange={(e) => setBurnAmount(e.target.value)}
          placeholder="Enter amount to burn"
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
        disabled={loading || !burnAmount || parseFloat(burnAmount) <= 0} 
        style={{ 
          padding: '10px 20px', 
          backgroundColor: loading ? '#cccccc' : '#dc3545', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: loading || !burnAmount || parseFloat(burnAmount) <= 0 ? 'not-allowed' : 'pointer',
          width: '100%'
        }}
      >
        {loading ? 'Burning...' : 'Burn Tokens'}
      </button>
      
      <button 
        onClick={checkBalance} 
        disabled={loading} 
        style={{ 
          padding: '10px 20px', 
          backgroundColor: loading ? '#cccccc' : '#4444ff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%',
          marginBottom: '15px'
        }}
      >
        {loading ? 'Checking...' : 'Check Token Balance'}
      </button>
      
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

export default SimplestBurnComponent; 