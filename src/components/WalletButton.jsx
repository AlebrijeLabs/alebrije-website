import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function WalletButton() {
  const { connected, connecting, disconnect, wallet } = useWallet();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (err) {
      setError('Failed to disconnect wallet');
      console.error('Disconnect error:', err);
    }
  };

  return (
    <div className="wallet-button" style={{ margin: '20px 0' }}>
      <WalletMultiButton />
      {connecting && <p>Connecting to wallet...</p>}
      {connected && (
        <div>
          <p>Connected to {wallet?.adapter?.name || 'wallet'}</p>
          <button 
            onClick={handleDisconnect}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Disconnect
          </button>
        </div>
      )}
      {error && (
        <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>
      )}
    </div>
  );
} 