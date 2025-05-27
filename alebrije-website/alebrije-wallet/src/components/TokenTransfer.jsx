import React, { useState } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import TokenService from '../services/token-service';
import WalletService from '../services/wallet-service';

const TokenTransfer = ({ tokenName }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!WalletService.isConnected()) {
      setError('Wallet not connected');
      return;
    }
    
    if (!recipient || !amount) {
      setError('Please fill in all fields');
      return;
    }
    
    // Basic address validation
    if (!recipient.match(/^0x[a-fA-F0-9]{40}$/)) {
      setError('Invalid recipient address');
      return;
    }
    
    // Amount validation
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Invalid amount');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await TokenService.transfer(tokenName, recipient, amountValue);
      
      setSuccess(`Successfully transferred ${amount} ${tokenName} to ${recipient.substring(0, 6)}...${recipient.substring(recipient.length - 4)}`);
      setRecipient('');
      setAmount('');
      
      console.log('Transfer result:', result);
    } catch (err) {
      setError(err.message || 'Transfer failed');
      console.error('Transfer error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!WalletService.isConnected()) {
    return (
      <Card className="token-transfer-card">
        <Card.Body>
          <Card.Title>Transfer {tokenName}</Card.Title>
          <div className="text-center text-muted">
            Connect your wallet to make transfers
          </div>
        </Card.Body>
      </Card>
    );
  }
  
  return (
    <Card className="token-transfer-card">
      <Card.Body>
        <Card.Title>Transfer {tokenName}</Card.Title>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Recipient Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={isSubmitting}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="0.0"
              step="0.000001"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isSubmitting}
            />
          </Form.Group>
          
          <Button 
            variant="primary" 
            type="submit"
            disabled={isSubmitting}
            className="w-100"
          >
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="ms-2">Processing...</span>
              </>
            ) : (
              'Send Tokens'
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default TokenTransfer; 