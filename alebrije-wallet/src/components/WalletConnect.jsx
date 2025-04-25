import React, { useState, useEffect } from 'react';
import { Button, Alert, Spinner } from 'react-bootstrap';
import WalletService from '../services/wallet-service';

const WalletConnect = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [accounts, setAccounts] = useState([]);
  
  useEffect(() => {
    // Check if already connected
    if (WalletService.isConnected()) {
      setAccounts(WalletService.getAccounts());
    }
  }, []);
  
  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const success = await WalletService.connect();
      if (success) {
        setAccounts(WalletService.getAccounts());
      } else {
        setError('Failed to connect wallet');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while connecting');
      console.error('Connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleDisconnect = async () => {
    await WalletService.disconnect();
    setAccounts([]);
  };
  
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <div className="wallet-connect-container">
      {error && <Alert variant="danger">{error}</Alert>}
      
      {accounts.length > 0 ? (
        <div className="connected-wallet">
          <div className="account-info">
            <span className="account-label">Connected Account:</span>
            <span className="account-address">{formatAddress(accounts[0])}</span>
            <Button 
              variant="link" 
              size="sm"
              onClick={() => navigator.clipboard.writeText(accounts[0])}
              title="Copy address"
            >
              📋
            </Button>
          </div>
          <Button 
            variant="outline-danger" 
            onClick={handleDisconnect}
            size="sm"
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button 
          variant="primary" 
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="ms-2">Connecting...</span>
            </>
          ) : (
            'Connect Wallet'
          )}
        </Button>
      )}
    </div>
  );
};

export default WalletConnect; 