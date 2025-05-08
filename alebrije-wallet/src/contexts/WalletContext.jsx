import React, { createContext, useContext, useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { clusterApiUrl } from '@solana/web3.js';
import {
  ConnectionProvider,
  WalletProvider,
  useWallet as useSolanaWallet,
  useConnection
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { AlebrijeError, ErrorTypes } from '../utils/error-handler';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletContext = createContext(null);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [connection, setConnection] = useState(null);
  const [error, setError] = useState(null);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    // Initialize connection
    const conn = new Connection(
      process.env.REACT_APP_SOLANA_RPC_URL || clusterApiUrl('devnet'),
      'confirmed'
    );
    setConnection(conn);

    // Check for available wallets
    const checkWallets = () => {
      const phantomWallet = window.solana;
      const solflareWallet = window.solflare;

      if (phantomWallet?.isPhantom) {
        console.log('Phantom wallet found');
        return phantomWallet;
      } else if (solflareWallet?.isSolflare) {
        console.log('Solflare wallet found');
        return solflareWallet;
      }
      return null;
    };

    // Check if wallet is already connected
    const checkConnection = async () => {
      try {
        const availableWallet = checkWallets();
        if (availableWallet?.isConnected) {
          console.log('Wallet is connected:', availableWallet.publicKey?.toString());
          setWallet(availableWallet);
          setConnected(true);
          setPublicKey(availableWallet.publicKey);
        }
      } catch (err) {
        console.error('Wallet connection check error:', err);
        setError(err.message);
      }
    };

    checkConnection();

    // Listen for wallet connection changes
    const handleConnect = () => {
      const availableWallet = checkWallets();
      if (availableWallet?.publicKey) {
        console.log('Wallet connected:', availableWallet.publicKey.toString());
        setWallet(availableWallet);
        setConnected(true);
        setPublicKey(availableWallet.publicKey);
        setError(null);
      }
    };

    const handleDisconnect = () => {
      console.log('Wallet disconnected');
      setWallet(null);
      setConnected(false);
      setPublicKey(null);
      setError(null);
    };

    window.addEventListener('solana#connect', handleConnect);
    window.addEventListener('solflare#connect', handleConnect);
    window.addEventListener('solana#disconnect', handleDisconnect);
    window.addEventListener('solflare#disconnect', handleDisconnect);

    return () => {
      window.removeEventListener('solana#connect', handleConnect);
      window.removeEventListener('solflare#connect', handleConnect);
      window.removeEventListener('solana#disconnect', handleDisconnect);
      window.removeEventListener('solflare#disconnect', handleDisconnect);
    };
  }, []);

  const connect = async () => {
    try {
      setError(null);
      
      // Check for available wallets
      const phantomWallet = window.solana;
      const solflareWallet = window.solflare;
      
      let selectedWallet = null;
      
      if (phantomWallet?.isPhantom) {
        selectedWallet = phantomWallet;
      } else if (solflareWallet?.isSolflare) {
        selectedWallet = solflareWallet;
      }
      
      if (!selectedWallet) {
        throw new Error('Please install Phantom or Solflare wallet');
      }

      // Request connection
      console.log('Requesting wallet connection...');
      const response = await selectedWallet.connect();
      
      if (response?.publicKey) {
        console.log('Wallet connected successfully:', response.publicKey.toString());
        setWallet(selectedWallet);
        setConnected(true);
        setPublicKey(response.publicKey);
      } else {
        throw new Error('Failed to connect wallet');
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message);
      throw err;
    }
  };

  const disconnect = async () => {
    try {
      if (wallet?.disconnect) {
        console.log('Disconnecting wallet...');
        await wallet.disconnect();
      }
      setWallet(null);
      setConnected(false);
      setPublicKey(null);
      setError(null);
    } catch (err) {
      console.error('Wallet disconnection error:', err);
      setError(err.message);
      throw err;
    }
  };

  const signTransaction = async (transaction) => {
    if (!wallet) {
      throw new Error('No wallet connected');
    }

    try {
      console.log('Requesting transaction signature...');
      const signed = await wallet.signTransaction(transaction);
      console.log('Transaction signed successfully');
      return signed;
    } catch (err) {
      console.error('Transaction signing error:', err);
      throw err;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        publicKey,
        connection,
        error,
        wallet,
        connect,
        disconnect,
        signTransaction
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export function WalletContextProvider({ children }) {
  // Network configuration
  const [network, setNetwork] = useState(WalletAdapterNetwork.Devnet);
  const endpoint = clusterApiUrl(network);
  
  // Get wallet adapters
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter()
  ];
  
  const switchNetwork = (newNetwork) => {
    if (Object.values(WalletAdapterNetwork).includes(newNetwork)) {
      setNetwork(newNetwork);
      return true;
    }
    return false;
  };
  
  // Create a wrapper to provide our custom context
  const AlebrijeWalletContextProvider = ({ children }) => {
    const { publicKey, connected, connecting, disconnect, select, wallet } = useSolanaWallet();
    const { connection } = useConnection();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const contextValue = {
      publicKey,
      connected,
      connecting,
      connection,
      currentAccount: publicKey?.toString() || null,
      loading,
      error,
      walletName: wallet?.name || null,
      disconnectWallet: async () => {
        try {
          setLoading(true);
          await disconnect();
          return true;
        } catch (err) {
          setError(err);
          throw err;
        } finally {
          setLoading(false);
        }
      },
      connectWallet: async (walletName) => {
        try {
          setLoading(true);
          if (walletName) {
            select(walletName);
          }
          return connected;
        } catch (err) {
          setError(err);
          throw err;
        } finally {
          setLoading(false);
        }
      },
      switchNetwork,
      network
    };
    
    return (
      <WalletContext.Provider value={contextValue}>
        {children}
      </WalletContext.Provider>
    );
  };
  
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AlebrijeWalletContextProvider>
            {children}
          </AlebrijeWalletContextProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

// Custom hook to use our wallet context
export function useAlebrijeWallet() {
  const context = useContext(WalletContext);
  
  if (!context) {
    throw new Error('useAlebrijeWallet must be used within a WalletContextProvider');
  }
  
  return context;
}

// Export the WalletMultiButton component for easy access
export { WalletMultiButton }; 