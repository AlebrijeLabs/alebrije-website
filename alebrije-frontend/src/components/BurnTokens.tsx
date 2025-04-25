import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { 
  getAssociatedTokenAddress, 
  TOKEN_PROGRAM_ID, 
  createBurnCheckedInstruction 
} from '@solana/spl-token';
import { Connection, PublicKey, Commitment, Transaction, TransactionInstruction } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { toast } from 'react-toastify';
import { getProgram, getAnchorProgram } from '../utils/getProgram';
import { debugAnchorProgram } from '../utils/debugAnchorProgram';

const BurnTokens = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { publicKey, signTransaction, sendTransaction } = wallet;
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [decimals, setDecimals] = useState<number>(9); // Default for most SPL tokens
  const mint = new PublicKey('FSx3upaoPomkueMg7rftj8dy75GeifDL7qGbBSSC9KRt'); // Replace with your token mint
  
  // Get program data when wallet is connected
  const programData = publicKey ? getProgram(connection, wallet) : null;
  // Get Anchor program for advanced operations if needed
  const anchorProgram = publicKey ? getAnchorProgram(connection, wallet) : null;
  
  // Debug the program structure on component mount
  useEffect(() => {
    if (anchorProgram) {
      console.log("Debugging Anchor program structure:");
      const debugInfo = debugAnchorProgram(anchorProgram);
      console.log(debugInfo);
    }
  }, [anchorProgram]);

  const handleBurn = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    let signature = '';
    
    try {
      setLoading(true);
      
      // Get the token account
      const tokenAccount = await getAssociatedTokenAddress(
        mint,
        publicKey
      );
      
      console.log("Preparing burn transaction with accounts:");
      console.log("- Mint:", mint.toString());
      console.log("- Token Account:", tokenAccount.toString());
      console.log("- Authority:", publicKey.toString());
      
      // Try a completely different approach using burnChecked instruction
      // This explicitly includes the decimals parameter
      const transaction = new Transaction();
      
      transaction.add(
        createBurnCheckedInstruction(
          tokenAccount,     // Token account to burn from
          mint,             // Mint account
          publicKey,        // Authority
          BigInt(amount * (10 ** decimals)), // Amount to burn (as BigInt)
          decimals          // Decimals
        )
      );
      
      // Get recent blockhash
      transaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
      transaction.feePayer = publicKey;
      
      // Send transaction
      signature = await sendTransaction(transaction, connection, { 
        skipPreflight: true,
        preflightCommitment: 'confirmed'
      });
      
      console.log("Transaction sent with signature:", signature);
      toast.info(`Transaction sent: ${signature.substring(0, 8)}...`);
      
      // Start polling for confirmation
      pollForConfirmation(signature);
      
    } catch (error: any) {
      console.error('Burn failed:', error);
      toast.error(`Burn failed: ${error.message}`);
      setLoading(false);
    }
  };
  
  // Polling function for transaction confirmation
  const pollForConfirmation = async (txSignature: string) => {
    const maxAttempts = 20;
    const initialDelayMs = 3000;
    const maxDelayMs = 30000;
    const backoffFactor = 1.3;
    
    let confirmed = false;
    let attempts = 0;
    
    while (!confirmed && attempts < maxAttempts) {
      try {
        const delayMs = Math.min(
          initialDelayMs * Math.pow(backoffFactor, attempts),
          maxDelayMs
        );
        
        console.log(`Waiting ${delayMs/1000} seconds before checking confirmation (attempt ${attempts+1}/${maxAttempts})...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        
        // Try different commitment levels
        const commitmentLevels: Commitment[] = ['confirmed', 'finalized', 'processed'];
        
        for (const commitment of commitmentLevels) {
          try {
            const status = await connection.getSignatureStatus(txSignature, {searchTransactionHistory: true});
            
            console.log(`Checking status with ${commitment} commitment:`, status);
            
            if (status && status.value) {
              if (status.value.err) {
                throw new Error(`Transaction failed: ${JSON.stringify(status.value.err)}`);
              }
              
              if (status.value.confirmationStatus === 'confirmed' || 
                  status.value.confirmationStatus === 'finalized') {
                confirmed = true;
                toast.success(`Burn successful! ${amount} tokens burned.`);
                setAmount(0);
                setLoading(false);
                return;
              }
            }
          } catch (err) {
            console.warn(`Error checking with ${commitment} commitment:`, err);
          }
        }
        
        attempts++;
        if (!confirmed && attempts < maxAttempts) {
          toast.info(`Still waiting for confirmation... (attempt ${attempts}/${maxAttempts})`);
        }
      } catch (confirmError) {
        console.error('Confirmation check failed:', confirmError);
        attempts++;
      }
    }
    
    if (!confirmed) {
      try {
        const response = await fetch(`https://public-api.solscan.io/transaction/${txSignature}?cluster=devnet`);
        const data = await response.json();
        
        if (data && data.status === "Success") {
          toast.success(`Transaction confirmed via Solscan! ${amount} tokens burned.`);
          setAmount(0);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Error checking Solscan:", err);
      }
      
      toast.warning(
        <div>
          <p>Transaction may have succeeded but couldn't be confirmed.</p>
          <p>Check signature on Solana Explorer:</p>
          <a 
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            {txSignature.substring(0, 12)}...
          </a>
        </div>
      );
    }
    
    setLoading(false);
  };

  return (
    <div className="burn-container">
      <h2>Burn Tokens</h2>
      <div className="input-group">
        <input
          type="number"
          value={amount || ''}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          placeholder="Amount to burn"
          disabled={loading || !publicKey}
        />
        <button 
          onClick={handleBurn} 
          disabled={loading || !publicKey || amount <= 0}
        >
          {loading ? 'Processing...' : 'Burn Tokens'}
        </button>
      </div>
    </div>
  );
};

export default BurnTokens; 