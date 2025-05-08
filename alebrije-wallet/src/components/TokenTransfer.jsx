import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { PublicKey } from '@solana/web3.js';
import TokenService from '../services/token-service';
import { useWallet } from '../contexts/WalletContext';

const TokenTransfer = ({ tokenAddress: propTokenAddress }) => {
  const { connected, publicKey, wallet } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [customTokenAddress, setCustomTokenAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isValidAddress, setIsValidAddress] = useState(true);
  const [isValidTokenAddress, setIsValidTokenAddress] = useState(true);
  const [balance, setBalance] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);
  
  const effectiveTokenAddress = propTokenAddress || customTokenAddress;
  
  useEffect(() => {
    if (connected && publicKey && effectiveTokenAddress) {
      loadTokenInfo();
      loadBalance();
    }
  }, [connected, publicKey, effectiveTokenAddress]);

  const loadTokenInfo = async () => {
    if (!effectiveTokenAddress) return;
    try {
      const info = await TokenService.getTokenInfo(effectiveTokenAddress);
      setTokenInfo(info);
    } catch (err) {
      console.error('Error loading token info:', err);
      setTokenInfo(null);
    }
  };

  const loadBalance = async () => {
    try {
      if (!effectiveTokenAddress) {
        setBalance(null);
        return;
      }
      
      if (effectiveTokenAddress === 'native') {
        const bal = await TokenService.getNativeBalance(publicKey.toString());
        setBalance(bal);
      } else {
        const bal = await TokenService.getTokenBalance(effectiveTokenAddress, publicKey.toString());
        setBalance(bal);
      }
    } catch (err) {
      console.error('Error loading balance:', err);
      setBalance(null);
    }
  };
  
  const validateAddress = (address) => {
    try {
      if (!address) return true;
      new PublicKey(address);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleTokenAddressChange = (e) => {
    const value = e.target.value;
    setCustomTokenAddress(value);
    setIsValidTokenAddress(validateAddress(value));
    setError(null);
    setBalance(null);
    setTokenInfo(null);
  };

  const handleRecipientChange = (e) => {
    const value = e.target.value;
    setRecipient(value);
    setIsValidAddress(validateAddress(value));
    setError(null);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    setError(null);
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && balance !== null && numValue > balance) {
      setError('Insufficient balance');
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
    
    if (!effectiveTokenAddress) {
      setError('Please enter a token address');
      return;
    }

    if (!isValidTokenAddress && effectiveTokenAddress !== 'native') {
      setError('Invalid token address');
      return;
    }
    
    if (!recipient || !amount) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!validateAddress(recipient)) {
      setError('Invalid recipient address');
      return;
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Invalid amount');
      return;
    }

    // For native SOL, we need to account for transaction fees
    if (effectiveTokenAddress === 'native') {
      const estimatedFee = 0.000005; // 5000 lamports
      if (amountValue + estimatedFee > balance) {
        setError(`Insufficient balance for transfer and network fees. You need ${(amountValue + estimatedFee).toFixed(9)} SOL but have ${balance.toFixed(9)} SOL`);
        return;
      }
    } else if (amountValue > balance) {
      setError(`Insufficient balance. You need ${amountValue} tokens but have ${balance} tokens`);
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Debug information
      console.log('Transfer attempt:', {
        type: effectiveTokenAddress === 'native' ? 'SOL' : 'TOKEN',
        from: publicKey.toString(),
        to: recipient,
        amount: amountValue,
        wallet: wallet ? (wallet.isPhantom ? 'Phantom' : wallet.isSolflare ? 'Solflare' : 'Unknown') : 'None',
        connected: connected,
        hasPublicKey: !!publicKey,
        hasWallet: !!wallet,
        walletMethods: Object.keys(wallet),
        isSolflare: wallet?.isSolflare,
        isPhantom: wallet?.isPhantom
      });

      // Show processing message
      setSuccess('Processing transaction...');
      
      let result;
      
      if (effectiveTokenAddress === 'native') {
        result = await TokenService.transferNativeSOL(
          publicKey.toString(),
          recipient,
          amountValue,
          wallet
        );

        console.log('Transfer result:', result);
        
        if (result.status === 'confirmed') {
          // Clear processing message
          setSuccess(null);
          // Show success message with signature
          setSuccess(`Transfer successful! View transaction: https://explorer.solana.com/tx/${result.signature}?cluster=devnet`);
          setRecipient('');
          setAmount('');
          // Reload balance after a short delay
          setTimeout(loadBalance, 2000);
        } else {
          throw new Error('Transfer failed to confirm');
        }
      } else {
        result = await TokenService.transferToken(
          effectiveTokenAddress,
          publicKey.toString(),
          recipient,
          amountValue,
          wallet
        );

        if (result.status === 'confirmed') {
          // Clear processing message
          setSuccess(null);
          // Show success message with signature
          setSuccess(`Transfer successful! View transaction: https://explorer.solana.com/tx/${result.signature}?cluster=devnet`);
          setRecipient('');
          setAmount('');
          setTimeout(loadBalance, 2000);
        } else {
          throw new Error('Transfer failed to confirm');
        }
      }
    } catch (err) {
      console.error('Transfer error:', err);
      
      // Clear any processing message
      setSuccess(null);
      
      // Extract the most relevant error message
      let errorMessage = 'Transfer failed: ';
      
      if (err.message?.includes('insufficient balance')) {
        errorMessage += 'Insufficient balance for transfer and fees';
      } else if (err.message?.includes('rejected')) {
        errorMessage += 'Transaction cancelled by user';
      } else if (err.message?.includes('failed to confirm')) {
        errorMessage += 'Transaction failed to confirm. Please try again';
      } else if (err.message?.includes('not connected')) {
        errorMessage += 'Wallet not connected. Please reconnect and try again';
      } else if (err.message?.includes('blockhash')) {
        errorMessage += 'Network error. Please try again';
      } else if (err.message?.includes('simulation failed')) {
        errorMessage += 'Transaction simulation failed. Please check your balance and try again';
      } else if (err.message?.includes('Balance not updated')) {
        errorMessage += 'Transaction may have failed. Please check your balance and try again';
      } else if (err.name === 'Ve' || err.message?.includes('Wallet error')) {
        errorMessage = 'Please disconnect your wallet, refresh the page, and connect again';
      } else {
        errorMessage += err.message || 'Unexpected error';
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <Card.Body>
        <Card.Title>Transfer {effectiveTokenAddress === 'native' ? 'SOL' : 'Tokens'}</Card.Title>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        {!propTokenAddress && (
          <Form.Group className="mb-4">
            <Form.Label>Token Address</Form.Label>
            <Form.Control
              type="text"
              value={customTokenAddress}
              onChange={handleTokenAddressChange}
              disabled={isSubmitting}
              isInvalid={!isValidTokenAddress && customTokenAddress !== ''}
              className="font-monospace"
              placeholder="Enter token mint address"
            />
            {tokenInfo && (
              <div className="mt-2 text-muted">
                Token: {tokenInfo.symbol} ({tokenInfo.name})
              </div>
            )}
          </Form.Group>
        )}
        
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Balance</strong>
              <div className="text-muted">
                {balance !== null 
                  ? `${balance} ${tokenInfo?.symbol || (effectiveTokenAddress === 'native' ? 'SOL' : 'tokens')}` 
                  : effectiveTokenAddress 
                    ? 'Loading...' 
                    : 'Enter token address'}
              </div>
            </div>
          </div>
        </div>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>Recipient Address</Form.Label>
            <Form.Control
              type="text"
              value={recipient}
              onChange={handleRecipientChange}
              disabled={isSubmitting}
              isInvalid={!isValidAddress && recipient !== ''}
              className="font-monospace"
              placeholder="Enter recipient's Solana address"
            />
          </Form.Group>
          
          <Form.Group className="mb-4">
            <Form.Label>Amount</Form.Label>
            <div className="input-group">
              <Form.Control
                type="number"
                step="0.000001"
                min="0"
                value={amount}
                onChange={handleAmountChange}
                disabled={isSubmitting || !effectiveTokenAddress}
                placeholder="Enter amount to transfer"
              />
              <span className="input-group-text">
                {tokenInfo?.symbol || (effectiveTokenAddress === 'native' ? 'SOL' : 'tokens')}
              </span>
            </div>
          </Form.Group>
          
          <Button 
            variant="primary" 
            type="submit"
            disabled={
              isSubmitting || 
              !isValidAddress || 
              !isValidTokenAddress || 
              !effectiveTokenAddress ||
              (amount && parseFloat(amount) > balance)
            }
            className="w-100"
          >
            {isSubmitting ? 'Processing...' : 'Transfer'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default TokenTransfer; 