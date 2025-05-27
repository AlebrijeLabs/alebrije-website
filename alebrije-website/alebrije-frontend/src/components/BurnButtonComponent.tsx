import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { 
  getAssociatedTokenAddress, 
  createBurnInstruction,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { 
  Connection, 
  PublicKey, 
  Commitment,
  Transaction,
  ComputeBudgetProgram,
  TransactionInstruction
} from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { toast } from 'react-toastify';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { getProgram } from "../utils/getProgram";

const BurnButtonComponent = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = wallet;
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [decimals, setDecimals] = useState<number>(9);
  const [logs, setLogs] = useState<string[]>([]);
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [canBurn, setCanBurn] = useState<boolean>(false);
  const [burnAuthorityMessage, setBurnAuthorityMessage] = useState<string>("");
  const [status, setStatus] = useState("");
  
  // Using your provided mint address
  const mint = new PublicKey('FSx3upaoPomkueMg7rftj8dy75GeifDL7qGbBSSC9KRt');
  
  // Define multiple fast RPC endpoints to try
  const rpcEndpoints = [
    // Helius API endpoint with your key
    'https://devnet.helius-rpc.com/?api-key=83c0ba8a-624c-4e55-9ceb-5084d9501179',
    
    // Fallback endpoints in case Helius has issues
    'https://api.devnet.rpcpool.com',
    'https://devnet.genesysgo.net',
    'https://devnet.rpcpool.com/67f608dc-a353-4191-9c34-293a5061b536',
    
    // Last resort
    'https://api.devnet.solana.com'
  ];

  const logToUI = (message: string) => {
    console.log(message);
    setLogs(prevLogs => [...prevLogs, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Try to connect to each endpoint until one works
  const getWorkingConnection = () => {
    // Start with the first endpoint
    let currentEndpointIndex = 0;
    
    const connection = new Connection(
      rpcEndpoints[currentEndpointIndex],
      { 
        commitment: 'confirmed', 
        confirmTransactionInitialTimeout: 120000,
        disableRetryOnRateLimit: false,
      }
    );
    
    // Add a method to try the next endpoint if the current one fails
    const tryNextEndpoint = () => {
      currentEndpointIndex = (currentEndpointIndex + 1) % rpcEndpoints.length;
      logToUI(`Switching to RPC endpoint: ${rpcEndpoints[currentEndpointIndex]}`);
      
      return new Connection(
        rpcEndpoints[currentEndpointIndex],
        { 
          commitment: 'confirmed', 
          confirmTransactionInitialTimeout: 120000,
          disableRetryOnRateLimit: false,
        }
      );
    };
    
    return { connection, tryNextEndpoint };
  };

  // Initialize connection with fallback capability
  const { connection: fallbackConnection, tryNextEndpoint } = getWorkingConnection();

  // Check token balance with fallback
  const checkTokenBalance = async () => {
    if (!publicKey) return;
    
    let currentConnection = connection || fallbackConnection;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        const tokenAccount = await getAssociatedTokenAddress(mint, publicKey);
        logToUI(`Checking token account: ${tokenAccount.toString()}`);
        
        const accountInfo = await currentConnection.getParsedAccountInfo(tokenAccount);
        
        if (!accountInfo.value) {
          logToUI("Token account not found. You may not have any tokens.");
          setTokenBalance(0);
          return;
        }
        
        // @ts-ignore - Accessing parsed data
        const balance = accountInfo.value.data.parsed.info.tokenAmount.uiAmount;
        logToUI(`Current token balance: ${balance}`);
        setTokenBalance(balance);
        return; // Success, exit the function
      } catch (error: any) {
        logToUI(`Error checking token balance: ${error.message}`);
        console.error("Error checking token balance:", error);
        
        attempts++;
        if (attempts < maxAttempts) {
          logToUI(`Retrying with different endpoint (attempt ${attempts+1}/${maxAttempts})...`);
          currentConnection = tryNextEndpoint();
        }
      }
    }
    
    logToUI("Failed to check token balance after multiple attempts");
    toast.error("Network issues. Please try again later.");
  };

  // Check burn authority
  const checkBurnAuthority = async () => {
    if (!publicKey) return;
    
    try {
      // Get mint info to check authorities
      const mintInfo = await connection.getParsedAccountInfo(mint);
      
      if (!mintInfo.value) {
        logToUI("Could not fetch mint info");
        setCanBurn(false);
        setBurnAuthorityMessage("Could not verify burn permissions");
        return;
      }
      
      // @ts-ignore - Accessing parsed data
      const data = mintInfo.value.data.parsed.info;
      
      // Check if this wallet is the mint authority
      const mintAuthority = data.mintAuthority;
      const freezeAuthority = data.freezeAuthority;
      
      logToUI(`Mint authority: ${mintAuthority}`);
      if (freezeAuthority) {
        logToUI(`Freeze authority: ${freezeAuthority}`);
      }
      
      // Check if the current wallet is the mint authority
      if (mintAuthority === publicKey.toString()) {
        setCanBurn(true);
        setBurnAuthorityMessage("You are the mint authority and can burn tokens");
        logToUI("You are the mint authority and can burn tokens");
      } else {
        // Check if the token has a burn program configured
        // This is a simplification - in reality, you'd need to check the token's program configuration
        const programId = new PublicKey('138h1Ad67ppzWK6Q6V8MdcpfJyF6WB9FBJd217p8NMD');
        
        try {
          // Try to fetch the program to see if it exists
          const provider = new AnchorProvider(
            connection,
            {
              publicKey,
              signTransaction: async (tx) => {
                if (wallet.signTransaction) {
                  return wallet.signTransaction(tx);
                }
                throw new Error("Wallet does not support signTransaction");
              },
              signAllTransactions: async (txs) => {
                if (wallet.signAllTransactions) {
                  return wallet.signAllTransactions(txs);
                }
                throw new Error("Wallet does not support signAllTransactions");
              },
            },
            { commitment: 'confirmed' }
          );
          
          const idl = await Program.fetchIdl(programId, provider);
          
          if (idl) {
            // @ts-ignore - TypeScript incorrectly flags programId as PublicKey instead of Provider
            const program = new Program(idl, programId, provider);
            const methods = Object.keys(program.methods);
            
            if (methods.includes('burnTokens')) {
              logToUI("Custom burn program found with burnTokens method");
              setCanBurn(true);
              setBurnAuthorityMessage("Custom burn program available");
            } else {
              setCanBurn(false);
              setBurnAuthorityMessage(`You are not the mint authority (${mintAuthority}). Only the mint authority can burn tokens.`);
              logToUI(`You are not the mint authority. Only ${mintAuthority} can burn tokens.`);
            }
          } else {
            setCanBurn(false);
            setBurnAuthorityMessage(`You are not the mint authority (${mintAuthority}). Only the mint authority can burn tokens.`);
            logToUI(`You are not the mint authority. Only ${mintAuthority} can burn tokens.`);
          }
        } catch (error) {
          setCanBurn(false);
          setBurnAuthorityMessage(`You are not the mint authority (${mintAuthority}). Only the mint authority can burn tokens.`);
          logToUI(`You are not the mint authority. Only ${mintAuthority} can burn tokens.`);
        }
      }
    } catch (error: any) {
      logToUI(`Error checking burn authority: ${error.message}`);
      setCanBurn(false);
      setBurnAuthorityMessage("Could not verify burn permissions");
    }
  };

  // Check balance when component mounts
  useEffect(() => {
    if (publicKey) {
      logToUI(`Wallet connected: ${publicKey.toString()}`);
      checkTokenBalance();
      checkBurnAuthority();
    }
  }, [publicKey]);

  const handleBurn = async () => {
    if (!publicKey || !amount || amount <= 0) return;
    
    setLoading(true);
    logToUI(`Starting burn process for ${amount} tokens...`);
    setStatus("🔄 Burning...");
    
    try {
      // Check token account and balance
      await checkTokenBalance();
      
      if (!tokenBalance || tokenBalance < amount) {
        toast.error(`Insufficient token balance. You have ${tokenBalance} tokens.`);
        setLoading(false);
        setStatus("❌ Burn failed: Insufficient token balance");
        return;
      }
      
      // Try the new program-based burn implementation first
      try {
        // Get the program ID from utils (adjust based on actual getProgram implementation)
        const programId = new PublicKey('138h1Ad67ppzWK6Q6V8MdcpfJyF6WB9FBJd217p8NMD'); // Use the correct program ID
        
            const tokenProgram = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(wallet.publicKey!, {
                mint,
            });

            if (tokenAccounts.value.length === 0) throw new Error("No token account found for this mint.");

            const fromTokenAccount = tokenAccounts.value[0].pubkey;

            const amountToBurn = BigInt(Number(amount) * 1_000_000_000);

            const BURN_DISCRIMINATOR = [76, 15, 51, 254, 229, 215, 121, 66];
            const amountBuffer = Buffer.alloc(8);
            amountBuffer.writeBigUInt64LE(amountToBurn);

            const data = Buffer.from([...BURN_DISCRIMINATOR, ...amountBuffer]);

            const ix = new TransactionInstruction({
                programId,
                keys: [
                    { pubkey: wallet.publicKey!, isSigner: true, isWritable: true },
                    { pubkey: mint, isSigner: false, isWritable: true },
                    { pubkey: fromTokenAccount, isSigner: false, isWritable: true },
                    { pubkey: tokenProgram, isSigner: false, isWritable: false },
                ],
                data,
            });

            const tx = new Transaction().add(ix);
            const latestBlockhash = await connection.getLatestBlockhash();
            tx.recentBlockhash = latestBlockhash.blockhash;
            tx.feePayer = wallet.publicKey!;

            const signedTx = await wallet.sendTransaction(tx, connection);
            await connection.confirmTransaction(signedTx, "processed");

            setStatus("🔥 Burn successful!");
        logToUI(`Burn successful! Transaction signature: ${signedTx}`);
        toast.success(`Successfully burned ${amount} tokens!`);
        setLoading(false);
        return;
      } catch (error: any) {
        // If the new implementation fails, fall back to the original
        logToUI(`New burn implementation failed: ${error.message}. Falling back to original implementation.`);
        console.error("New burn implementation failed:", error);
        
        // Fallback to original implementation
        // Get token account
        const tokenAccount = await getAssociatedTokenAddress(mint, publicKey);
        logToUI(`Using token account: ${tokenAccount.toString()}`);
        logToUI(`Using mint: ${mint.toString()}`);
        
        // Create burn instruction
        const rawAmount = new BN(amount * Math.pow(10, decimals));
        logToUI(`Burning amount: ${rawAmount.toString()} raw units (${amount} tokens)`);
        
        const burnInstruction = createBurnInstruction(
          tokenAccount,
          mint,
          publicKey,
          rawAmount.toNumber()
        );
        
        // Add priority fee
        const priorityFeeInstruction = ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: 100_000  // Adjust as needed
        });
        
        // Create transaction
        const transaction = new Transaction()
          .add(priorityFeeInstruction)
          .add(burnInstruction);
        
        // Send the transaction
        try {
          const signature = await sendTransaction(transaction, connection);
          logToUI(`Transaction sent: ${signature}`);
          
          // Poll for confirmation
          await pollForConfirmation(signature);
          
          toast.success(`Successfully burned ${amount} tokens!`);
          logToUI(`Burn successful!`);
        } catch (txError: any) {
          logToUI(`Transaction failed: ${txError.message}`);
          console.error("Transaction failed", txError);
          toast.error(`Burn failed: ${txError.message}`);
        }
      }
    } catch (error: any) {
      logToUI(`Burn operation failed: ${error.message}`);
      console.error("Burn operation failed", error);
      toast.error(`Burn failed: ${error.message}`);
      setStatus(`❌ Burn failed: ${error.message || error.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  const pollForConfirmation = async (txSignature: string) => {
    let retries = 20; // Number of retries
    const retryInterval = 1500; // Time between retries in milliseconds
    
    const checkSignature = async () => {
      try {
        logToUI(`Checking transaction status (${retries} attempts left)...`);
        const result = await connection.confirmTransaction(txSignature, 'confirmed');
        
        if (result.value.err) {
          throw new Error(`Transaction failed: ${JSON.stringify(result.value.err)}`);
        }
        
        logToUI('Transaction confirmed!');
        return true;
      } catch (error: any) {
        if (retries <= 0) {
          logToUI(`Transaction could not be confirmed after multiple attempts: ${error.message}`);
          throw error;
        }
        
        retries--;
        logToUI(`Transaction not confirmed yet. Retrying in ${retryInterval/1000} seconds...`);
        
        return new Promise((resolve) => {
          setTimeout(() => resolve(checkSignature()), retryInterval);
        });
      }
    };
    
    return checkSignature();
    };

    return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', marginBottom: '20px' }}>
      <h2 style={{ marginBottom: '15px', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        Burn $ALEBRIJE Tokens
      </h2>
      
      {publicKey ? (
        <>
          <div style={{ marginBottom: '15px' }}>
            {tokenBalance !== null ? (
              <p>Your $ALEBRIJE Balance: {tokenBalance} tokens</p>
            ) : (
              <p>Loading your token balance...</p>
            )}
            
            {burnAuthorityMessage && (
              <p style={{ 
                color: canBurn ? 'green' : 'red',
                fontStyle: 'italic',
                fontSize: '14px'
              }}>
                {burnAuthorityMessage}
              </p>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <input
                type="number"
                value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
                placeholder="Amount to burn"
              style={{ 
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                width: '150px'
              }}
            />
            
            <button
                onClick={handleBurn}
              disabled={!canBurn || loading || !amount || amount <= 0}
                style={{
                padding: '10px 20px',
                backgroundColor: canBurn && !loading && amount > 0 ? '#ff3b30' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: canBurn && !loading && amount > 0 ? 'pointer' : 'not-allowed',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              {loading ? 'Processing...' : '🔥 Burn Tokens'}
            </button>
          </div>
          
          {status && <p style={{ marginTop: "1rem", fontWeight: 'bold' }}>{status}</p>}
        </>
      ) : (
        <p style={{ marginBottom: '15px' }}>
          Please connect your wallet to burn tokens.
        </p>
      )}
      
      <div className="logs-container" style={{
        marginTop: '20px',
        border: '1px solid #ccc',
        padding: '10px',
        maxHeight: '200px',
        overflow: 'auto',
        fontSize: '12px',
        fontFamily: 'monospace',
        backgroundColor: '#f5f5f5'
      }}>
        <h3>Logs:</h3>
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
        </div>
    );
};

export default BurnButtonComponent;
