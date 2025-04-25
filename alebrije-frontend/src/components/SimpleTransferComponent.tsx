import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, ComputeBudgetProgram } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { toast } from 'react-toastify';

const SimpleTransferComponent: React.FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Token mint address
  const mint = new PublicKey('FSx3upaoPomkueMg7rftj8dy75GeifDL7qGbBSSC9KRt');
  const decimals = 9;
  
  // Initialize connection
  const connection = new Connection('https://api.devnet.solana.com', {
    commitment: 'confirmed',
    confirmTransactionInitialTimeout: 60000
  });
  
  // Log to UI
  const logToUI = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `${timestamp}: ${message}`;
    setLogs(prevLogs => [...prevLogs, logMessage]);
    console.log(logMessage);
  };
  
  // Check token balance
  const checkTokenBalance = async () => {
    if (!publicKey) return;
    
    try {
      // Get token account
      const tokenAccount = await getAssociatedTokenAddress(mint, publicKey);
      logToUI(`Checking token account: ${tokenAccount.toString()}`);
      
      // Get token balance
      const accountInfo = await connection.getTokenAccountBalance(tokenAccount);
      const balance = Number(accountInfo.value.amount) / Math.pow(10, decimals);
      setTokenBalance(balance);
      logToUI(`Current token balance: ${balance}`);
      return balance;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logToUI(`Error checking token balance: ${errorMessage}`);
      return null;
    }
  };
  
  // Handle simple transfer
  const handleSimpleTransfer = async () => {
    if (!publicKey || !recipient || !amount || amount <= 0) {
      toast.error("Please enter a valid recipient and amount");
      return;
    }
    
    try {
      setLoading(true);
      logToUI(`Starting simple transfer of ${amount} tokens...`);
      
      // Check token balance
      await checkTokenBalance();
      
      if (!tokenBalance || tokenBalance < amount) {
        toast.error(`Insufficient token balance. You have ${tokenBalance} tokens.`);
        setLoading(false);
        return;
      }
      
      // Validate recipient address
      let recipientPubkey: PublicKey;
      try {
        recipientPubkey = new PublicKey(recipient);
        logToUI(`Recipient address validated: ${recipientPubkey.toString()}`);
      } catch (error) {
        toast.error("Invalid recipient address");
        setLoading(false);
        return;
      }
      
      // Get token accounts
      const senderTokenAccount = await getAssociatedTokenAddress(mint, publicKey);
      logToUI(`Sender token account: ${senderTokenAccount.toString()}`);
      
      // Get recipient token account
      const recipientTokenAccount = await getAssociatedTokenAddress(mint, recipientPubkey);
      logToUI(`Recipient token account: ${recipientTokenAccount.toString()}`);
      
      // Create transaction
      const transaction = new Transaction();
      
      // Add priority fee instruction
      const priorityFeeIx = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 1000000, // 1 million microLamports = 0.001 SOL priority fee
      });
      transaction.add(priorityFeeIx);
      
      // Check if recipient token account exists
      let recipientAccountExists = false;
      try {
        const recipientAccountInfo = await connection.getAccountInfo(recipientTokenAccount);
        recipientAccountExists = recipientAccountInfo !== null;
        logToUI(`Recipient token account exists: ${recipientAccountExists}`);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logToUI(`Error checking recipient account: ${errorMessage}`);
      }
      
      // Create recipient token account if it doesn't exist
      if (!recipientAccountExists) {
        logToUI("Creating recipient token account...");
        const createRecipientAccountIx = createAssociatedTokenAccountInstruction(
          publicKey,
          recipientTokenAccount,
          recipientPubkey,
          mint
        );
        transaction.add(createRecipientAccountIx);
      }
      
      // Calculate amount with decimals
      const amountWithDecimals = Math.floor(amount * Math.pow(10, decimals));
      logToUI(`Transfer amount with decimals: ${amountWithDecimals}`);
      
      // Add transfer instruction
      const transferIx = createTransferInstruction(
        senderTokenAccount,
        recipientTokenAccount,
        publicKey,
        amountWithDecimals
      );
      transaction.add(transferIx);
      
      // Get recent blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
      logToUI(`Got blockhash: ${blockhash}, lastValidBlockHeight: ${lastValidBlockHeight}`);
      
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      // Send transaction
      logToUI("Sending transaction...");
      const signature = await sendTransaction(transaction, connection, {
        skipPreflight: true,
        preflightCommitment: 'processed'
      });
      
      logToUI(`Transaction sent: ${signature}`);
      toast.info(`Transaction sent! Signature: ${signature.slice(0, 8)}...`);
      
      // Check for confirmation
      logToUI("Waiting for confirmation...");
      
      // Poll for confirmation
      let confirmed = false;
      let attempts = 0;
      const maxAttempts = 20;
      
      while (!confirmed && attempts < maxAttempts) {
        attempts++;
        logToUI(`Checking confirmation (attempt ${attempts}/${maxAttempts})...`);
        
        try {
          const status = await connection.getSignatureStatus(signature);
          
          if (status.value !== null) {
            if (status.value.err) {
              logToUI(`Transaction failed: ${JSON.stringify(status.value.err)}`);
              toast.error(`Transaction failed: ${JSON.stringify(status.value.err)}`);
              setLoading(false);
              return;
            } else if (status.value.confirmationStatus === 'confirmed' || 
                      status.value.confirmationStatus === 'finalized') {
              logToUI(`Transaction confirmed with status: ${status.value.confirmationStatus}`);
              toast.success("Transfer completed successfully!");
              await checkTokenBalance();
              setAmount(0);
              setRecipient('');
              confirmed = true;
              setLoading(false);
              return;
            }
          }
          
          // Check token balance every 3 attempts
          if (attempts % 3 === 0) {
            const prevBalance = tokenBalance;
            await checkTokenBalance();
            
            if (tokenBalance !== null && prevBalance !== null && tokenBalance < prevBalance) {
              logToUI(`Token balance changed from ${prevBalance} to ${tokenBalance}!`);
              toast.success("Transfer likely succeeded! Token balance updated.");
              setAmount(0);
              setRecipient('');
              confirmed = true;
              setLoading(false);
              return;
            }
          }
          
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          logToUI(`Error checking confirmation: ${errorMessage}`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      if (!confirmed) {
        logToUI("Transaction may have succeeded but couldn't be confirmed.");
        toast.warning("Transaction sent but confirmation timed out. Check your wallet for balance changes.");
        
        // Final balance check
        const prevBalance = tokenBalance;
        await checkTokenBalance();
        
        if (tokenBalance !== null && prevBalance !== null && tokenBalance < prevBalance) {
          logToUI(`Token balance changed from ${prevBalance} to ${tokenBalance}!`);
          toast.success("Transfer likely succeeded! Token balance updated.");
          setAmount(0);
          setRecipient('');
        }
      }
      
      setLoading(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logToUI(`Transfer failed: ${errorMessage}`);
      console.error('Transfer failed:', error);
      
      toast.error(`Transfer failed: ${errorMessage}`);
      setLoading(false);
    }
  };
  
  // Check token balance on component mount
  useEffect(() => {
    if (publicKey) {
      checkTokenBalance();
    }
  }, [publicKey]);
  
  if (!publicKey) {
    return (
      <div>
        <h2>Simple Transfer</h2>
        <p>Connect your wallet to transfer tokens.</p>
      </div>
    );
  }
  
  return (
    <div>
      <h2>Simple Transfer</h2>
      <p>Your token balance: {tokenBalance !== null ? tokenBalance : 'Loading...'}</p>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Recipient Address</label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Enter recipient wallet address"
          style={{ 
            width: '100%', 
            padding: '8px', 
            borderRadius: '5px', 
            border: '1px solid #ccc' 
          }}
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Amount to Transfer</label>
        <input
          type="number"
          value={amount || ''}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter amount"
          style={{ 
            width: '100%', 
            padding: '8px', 
            borderRadius: '5px', 
            border: '1px solid #ccc' 
          }}
        />
      </div>
      
      <button 
        onClick={handleSimpleTransfer} 
        disabled={loading || !amount || amount <= 0 || !recipient} 
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
        {loading ? 'Processing...' : 'Transfer Tokens'}
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

export default SimpleTransferComponent; 