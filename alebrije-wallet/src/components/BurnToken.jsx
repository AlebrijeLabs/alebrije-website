import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import TokenService from '../services/token-service';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { PublicKey } from '@solana/web3.js';

const BurnToken = ({ tokenAddress: propTokenAddress }) => {
  const { connected, publicKey, wallet } = useWallet();
  const [amount, setAmount] = useState('');
  const [tokenInfo, setTokenInfo] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const tokenAddress = propTokenAddress;

  useEffect(() => {
    if (connected && publicKey && tokenAddress) {
      loadTokenInfo();
      loadBalance();
    }
  }, [connected, publicKey, tokenAddress]);

  const loadTokenInfo = async () => {
    try {
      setError(null);
      const info = await TokenService.getTokenInfo(tokenAddress);
      console.log('Token info loaded:', info);
      setTokenInfo(info);
    } catch (err) {
      console.error('Error loading token info:', err);
      setError('Failed to load token information');
      setTokenInfo(null);
    }
  };

  const loadBalance = async () => {
    if (!connected || !publicKey || !tokenAddress) return;
    
    try {
      setError(null);
      const balance = await TokenService.getTokenBalance(tokenAddress, publicKey.toString());
      console.log('Token balance loaded:', balance);
      setBalance(balance);
    } catch (err) {
      console.error('Error loading balance:', err);
      setError('Failed to load token balance');
      setBalance(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!connected || !publicKey) {
      setError('Wallet not connected');
      return;
    }

    if (!wallet) {
      setError('No wallet adapter found');
      return;
    }
    
    if (!tokenAddress) {
      setError('Token address is required');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    const burnAmount = parseFloat(amount);
    if (balance !== null && burnAmount > balance) {
      setError(`Insufficient balance. You have ${balance.toLocaleString()} ${tokenInfo?.symbol || 'tokens'} available`);
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log('Initiating token burn:', {
        tokenAddress,
        owner: publicKey.toString(),
        amount: burnAmount,
        wallet: wallet ? (wallet.isPhantom ? 'Phantom' : wallet.isSolflare ? 'Solflare' : 'Unknown') : 'None',
        tokenInfo
      });

      // Show processing message
      setSuccess('Processing burn transaction...');

      const result = await TokenService.burnToken(
        tokenAddress,
        publicKey.toString(),
        burnAmount,
        wallet
      );

      console.log('Burn result:', result);
      
      if (result.status === 'confirmed') {
        const symbol = tokenInfo?.symbol || 'tokens';
        const name = tokenInfo?.name || 'Unknown Token';
        setSuccess(
          `Successfully burned ${burnAmount.toLocaleString()} ${symbol} (${name}). ` +
          `View transaction: https://explorer.solana.com/tx/${result.signature}?cluster=devnet`
        );
        setAmount('');
        setTimeout(loadBalance, 2000);
      } else {
        throw new Error('Burn transaction failed to confirm');
      }
    } catch (err) {
      console.error('Burn error:', err);
      
      // Clear processing message
      setSuccess(null);
      
      // Handle specific error cases
      if (err.message?.includes('insufficient balance')) {
        setError('Insufficient balance for burn');
      } else if (err.message?.includes('rejected')) {
        setError('Transaction cancelled by user');
      } else if (err.message?.includes('Invalid token')) {
        setError('Invalid token address');
      } else if (err.message?.includes('Token account not found')) {
        setError('You don\'t have any tokens to burn');
      } else if (err.name === 'Ve' || err.message?.includes('Wallet error')) {
        setError('Please disconnect your wallet, refresh the page, and connect again');
      } else {
        setError(err.message || 'Failed to burn tokens');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMaxAmount = () => {
    if (balance !== null) {
      setAmount(balance.toString());
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          {tokenInfo?.isAlebrije ? 'Burn Alebrije Tokens' : `Burn ${tokenInfo?.symbol || 'Unknown'} Tokens`}
        </Card.Title>
        
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Warning: Burning tokens permanently removes them from circulation. This action cannot be undone.
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Token Information</strong>
              <div className="text-muted">
                {tokenInfo ? (
                  <>
                    <div>{tokenInfo.symbol} ({tokenInfo.name})</div>
                    <small className="text-break">Mint: {tokenAddress}</small>
                    <div className="mt-1">Decimals: {tokenInfo.decimals}</div>
                  </>
                ) : (
                  'Loading token information...'
                )}
              </div>
              <div className="mt-3">
                <strong>Your Balance</strong>
                <div className="text-muted">
                  {balance !== null 
                    ? `${balance.toLocaleString()} ${tokenInfo?.symbol || 'tokens'}` 
                    : 'Loading balance...'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>Amount to Burn</Form.Label>
            <div className="input-group">
              <Form.Control
                type="number"
                step="1"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Enter amount of ${tokenInfo?.symbol || 'tokens'} to burn`}
                disabled={loading || !connected || balance === null}
              />
              <Button
                variant="outline-secondary"
                onClick={handleMaxAmount}
                disabled={loading || balance === null}
              >
                MAX
              </Button>
            </div>
          </Form.Group>
          
          <Button
            variant="danger"
            type="submit"
            disabled={loading || !connected || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > (balance || 0)}
            className="w-100"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              `Burn ${tokenInfo?.symbol || ''} Tokens`
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default BurnToken; 