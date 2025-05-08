import React, { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import TokenService from '../services/token-service';
import WalletService from '../services/wallet-service';

const TokenBalance = ({ tokenAddress = 'native' }) => {
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
      let balanceValue;
      
      if (tokenAddress === 'native') {
        balanceValue = await TokenService.getNativeBalance(account);
      } else {
        balanceValue = await TokenService.getTokenBalance(tokenAddress, account);
      }
      
      setBalance(balanceValue);
      
      if (!tokenInfo) {
        const info = await TokenService.getTokenInfo(tokenAddress);
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
    
    const unsubscribe = WalletService.onAccountsChanged(() => {
      loadBalance();
    });
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [tokenAddress]);
  
  return (
    <Card>
      <Card.Body>
        <Card.Title>Balance</Card.Title>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{tokenAddress === 'native' ? 'SOL' : tokenInfo?.symbol || 'Tokens'}</strong>
              <div className="text-muted">
                {isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  `${balance !== null ? balance : '0'} ${tokenAddress === 'native' ? 'SOL' : tokenInfo?.symbol || 'tokens'}`
                )}
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TokenBalance; 