import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { getMint, setAuthority, AuthorityType, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { toast } from 'react-toastify';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const TransferMintAuthorityComponent: React.FC = () => {
  const { publicKey, signTransaction } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Token mint address
  const mint = new PublicKey('FSx3upaoPomkueMg7rftj8dy75GeifDL7qGbBSSC9KRt');
  const currentMintAuthority = new PublicKey('2ris4b77d1K2fjRgG1GGsJMJkrKCjNZA3dmgLuhsXBLQ');
  
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
  
  // Check if current wallet is the mint authority
  const checkMintAuthority = async () => {
    if (!publicKey) return false;
    
    try {
      const mintInfo = await getMint(connection, mint);
      
      if (mintInfo.mintAuthority) {
        const isMintAuthority = mintInfo.mintAuthority.equals(publicKey);
        logToUI(`Current wallet is mint authority: ${isMintAuthority}`);
        return isMintAuthority;
      } else {
        logToUI("Token has no mint authority (it's been revoked)");
        return false;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logToUI(`Error checking mint authority: ${errorMessage}`);
      return false;
    }
  };
  
  // Transfer mint authority
  const transferMintAuthority = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet");
      return;
    }
    
    try {
      setLoading(true);
      logToUI("Starting mint authority transfer...");
      
      // Check if current wallet is the mint authority
      const isMintAuthority = await checkMintAuthority();
      
      if (!isMintAuthority) {
        logToUI(`Current wallet (${publicKey.toString()}) is not the mint authority.`);
        logToUI(`The mint authority is: ${currentMintAuthority.toString()}`);
        toast.error("You must connect with the wallet that has mint authority");
        setLoading(false);
        return;
      }
      
      // Create transaction to transfer mint authority
      logToUI("Creating transaction to transfer mint authority...");
      
      // Create a transaction
      const transaction = new Transaction();
      
      // Import the necessary function
      const { createSetAuthorityInstruction } = await import('@solana/spl-token');
      
      // Create the instruction to set authority
      const transferAuthorityIx = createSetAuthorityInstruction(
        mint,                    // Token mint account
        publicKey,               // Current authority
        AuthorityType.MintTokens, // Authority type
        publicKey,               // New authority
        [],                      // Multisig signers (empty array for single signer)
        TOKEN_PROGRAM_ID         // Token program ID
      );
      
      transaction.add(transferAuthorityIx);
      
      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      
      // Sign and send transaction
      if (signTransaction) {
        const signedTx = await signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signedTx.serialize());
        
        logToUI(`Transaction sent: ${signature}`);
        
        // Wait for confirmation
        const confirmation = await connection.confirmTransaction(signature, 'confirmed');
        
        if (confirmation.value.err) {
          logToUI(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
          toast.error("Mint authority transfer failed");
        } else {
          logToUI("Mint authority transferred successfully!");
          toast.success("You now have mint authority for this token!");
        }
      } else {
        toast.error("Wallet doesn't support transaction signing");
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
  
  if (!publicKey) {
    return (
      <div>
        <h2>Transfer Mint Authority</h2>
        <p>Connect your wallet to transfer mint authority.</p>
        <WalletMultiButton />
      </div>
    );
  }
  
  return (
    <div>
      <h2>Transfer Mint Authority</h2>
      <p>Current wallet: {publicKey.toString()}</p>
      <p>Current mint authority: {currentMintAuthority.toString()}</p>
      
      <button 
        onClick={transferMintAuthority} 
        disabled={loading} 
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
        {loading ? 'Processing...' : 'Transfer Mint Authority to My Wallet'}
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

export default TransferMintAuthorityComponent; 