import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import WalletService from '../services/wallet-service';

const WalletConnect = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [accounts, setAccounts] = useState([]);
  
  useEffect(() => {
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
        setError('Failed to connect wallet. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while connecting to your wallet.');
      console.error('Connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleDisconnect = async () => {
    try {
      await WalletService.disconnect();
      setAccounts([]);
    } catch (err) {
      console.error('Disconnect error:', err);
      setError('Failed to disconnect wallet. Please try again.');
    }
  };
  
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return accounts.length > 0 ? (
    <div className="wallet-connected">
      <div className="d-flex align-items-center mb-3">
        <div className="wallet-status-indicator connected me-2"></div>
        <span className="text-success">Connected</span>
      </div>
      <div className="wallet-address mb-3">
        <small className="text-muted d-block mb-1">Wallet Address:</small>
        <code className="d-block text-break">{accounts[0]}</code>
      </div>
      <Button 
        variant="outline-danger" 
        onClick={handleDisconnect}
        className="disconnect-button w-100"
      >
        <i className="bi bi-x-circle me-2"></i>
        Disconnect Wallet
      </Button>
    </div>
  ) : (
    <div className="wallet-connect">
      <Button 
        variant="primary" 
        onClick={handleConnect}
        disabled={isConnecting}
        className="connect-button w-100"
      >
        {isConnecting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Connecting...
          </>
        ) : (
          <>
            <i className="bi bi-wallet2 me-2"></i>
            Connect Wallet
          </>
        )}
      </Button>
      {error && (
        <Alert variant="danger" className="mt-3 mb-0">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}
    </div>
  );
};

export default WalletConnect; 