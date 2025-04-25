import React, { useState, useEffect } from 'react';
import { Card, Spinner, Button } from 'react-bootstrap';
import TokenService from '../services/token-service';
import WalletService from '../services/wallet-service';

const TokenBalance = ({ tokenName }) => {
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);
  
  const loadBalance = async () => {
    if (!WalletService.isConnected()) {
      setError('Wallet not connected');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const account = WalletService.getCurrentAccount();
      const balanceValue = await TokenService.getBalance(tokenName, account);
      setBalance(balanceValue);
      
      // Get token info if not already loaded
      if (!tokenInfo) {
        const info = TokenService.getTokenInfo(tokenName);
        if (info) {
          setTokenInfo(info);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load balance');
      console.error('Balance loading error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (WalletService.isConnected()) {
      loadBalance();
    }
    
    // Subscribe to account changes
    const unsubscribe = WalletService.onAccountsChanged(() => {
      loadBalance();
    });
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [tokenName]);
  
  if (!WalletService.isConnected()) {
    return (
      <Card className="token-balance-card">
        <Card.Body>
          <Card.Title>{tokenName || 'Token'} Balance</Card.Title>
          <div className="text-center text-muted">
            Connect your wallet to view balance
          </div>
        </Card.Body>
      </Card>
    );
  }
  
  return (
    <Card className="token-balance-card">
      <Card.Body>
        <Card.Title>
          {tokenInfo?.symbol || tokenName || 'Token'} Balance
          <Button 
            variant="link" 
            size="sm" 
            className="refresh-button"
            onClick={loadBalance}
            disabled={isLoading}
          >
            🔄
          </Button>
        </Card.Title>
        
        {isLoading ? (
          <div className="text-center">
            <Spinner animation="border" size="sm" />
          </div>
        ) : error ? (
          <div className="text-danger">{error}</div>
        ) : (
          <div className="balance-display">
            <span className="balance-amount">{balance || '0'}</span>
            <span className="balance-symbol">{tokenInfo?.symbol || tokenName}</span>
          </div>
        )}
        
        {tokenInfo && (
          <div className="token-info">
            <small className="text-muted">
              {tokenInfo.name} • {tokenInfo.decimals} decimals
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default TokenBalance; 