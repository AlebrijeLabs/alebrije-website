import React, { useState } from 'react';
import { useWallet, WalletMultiButton } from '../contexts/WalletContext';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

const WalletConnectionTest = () => {
  const { 
    connected, 
    currentAccount, 
    disconnectWallet, 
    loading, 
    error, 
    walletName,
    network,
    switchNetwork
  } = useWallet();
  
  const [selectedNetwork, setSelectedNetwork] = useState(network);

  const handleNetworkChange = (e) => {
    const newNetwork = e.target.value;
    setSelectedNetwork(newNetwork);
    switchNetwork(newNetwork);
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
    }
  };

  return (
    <div className="wallet-test-container p-4 border rounded">
      <h3>Wallet Connection</h3>
      
      <div className="mb-4">
        <label className="form-label">Network</label>
        <select 
          className="form-select mb-3" 
          value={selectedNetwork}
          onChange={handleNetworkChange}
          disabled={connected}
        >
          <option value={WalletAdapterNetwork.Mainnet}>Mainnet</option>
          <option value={WalletAdapterNetwork.Devnet}>Devnet</option>
          <option value={WalletAdapterNetwork.Testnet}>Testnet</option>
        </select>
        
        <div className="alert alert-info">
          <small>
            {connected 
              ? 'To change networks, please disconnect your wallet first.' 
              : 'Select a network before connecting your wallet.'}
          </small>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="mb-2">Status: <span className={`badge ${connected ? 'bg-success' : 'bg-secondary'}`}>
          {connected ? 'Connected' : 'Disconnected'}
        </span></p>
        
        {connected && walletName && (
          <p className="mb-2">Wallet: <span className="badge bg-info">{walletName}</span></p>
        )}
        
        {connected && currentAccount && (
          <div className="mb-2">
            <p className="mb-1">Account:</p>
            <div className="input-group">
              <input 
                type="text" 
                className="form-control form-control-sm" 
                value={currentAccount} 
                readOnly 
              />
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={() => navigator.clipboard.writeText(currentAccount)}
                title="Copy to clipboard"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="d-grid gap-2 mb-4">
        {!connected ? (
          <>
            <p className="text-center mb-3">Connect with your preferred wallet:</p>
            <div className="d-flex justify-content-center">
              <WalletMultiButton />
            </div>
            <div className="mt-3">
              <small className="text-muted">
                Don't have a wallet? We recommend installing{' '}
                <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer">Phantom</a>{' '}
                or{' '}
                <a href="https://solflare.com/" target="_blank" rel="noopener noreferrer">Solflare</a>.
              </small>
            </div>
          </>
        ) : (
          <button 
            className="btn btn-danger" 
            onClick={handleDisconnect}
            disabled={loading}
          >
            {loading ? 'Disconnecting...' : 'Disconnect Wallet'}
          </button>
        )}
      </div>
      
      {error && (
        <div className="alert alert-danger">
          <h5>Connection Error</h5>
          <p>{error.getUserMessage ? error.getUserMessage() : error.message}</p>
          <div className="mt-2">
            <strong>Troubleshooting:</strong>
            <ul className="mb-0">
              <li>Make sure your wallet extension is installed and unlocked</li>
              <li>Check that you're connected to the internet</li>
              <li>Try refreshing the page</li>
              <li>Ensure your wallet supports the selected network</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnectionTest; 