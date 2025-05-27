import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Spinner, Button } from 'react-bootstrap';
import TransactionHistoryService from '../services/transaction-history-service';
import WalletService from '../services/wallet-service';
import { ErrorDisplay } from './ErrorDisplay';
import { formatDistance } from 'date-fns';

const TransactionHistory = ({ tokenName }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const loadTransactions = async () => {
    if (!WalletService.isConnected()) {
      setError(new Error('Wallet not connected'));
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await TransactionHistoryService.initialize(tokenName);
      const txHistory = await TransactionHistoryService.fetchTransactionHistory(tokenName);
      setTransactions(txHistory);
    } catch (err) {
      setError(err);
      console.error('Failed to load transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (WalletService.isConnected()) {
      loadTransactions();
    }
    
    // Cleanup on unmount
    return () => {
      TransactionHistoryService.cleanup();
    };
  }, [tokenName]);
  
  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Format time relative to now
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
  };
  
  if (!WalletService.isConnected()) {
    return (
      <Card className="transaction-history-card">
        <Card.Body>
          <Card.Title>{tokenName} Transaction History</Card.Title>
          <div className="text-center text-muted">
            Connect your wallet to view transaction history
          </div>
        </Card.Body>
      </Card>
    );
  }
  
  return (
    <Card className="transaction-history-card">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-center">
          {tokenName} Transaction History
          <Button 
            variant="link" 
            size="sm" 
            onClick={loadTransactions}
            disabled={isLoading}
          >
            🔄
          </Button>
        </Card.Title>
        
        {error && (
          <ErrorDisplay 
            error={error} 
            onDismiss={() => setError(null)} 
            onRetry={loadTransactions} 
          />
        )}
        
        {isLoading ? (
          <div className="text-center p-4">
            <Spinner animation="border" />
            <p className="mt-2">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-muted p-4">
            No transactions found
          </div>
        ) : (
          <div className="transaction-table-container">
            <Table hover responsive className="transaction-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>From/To</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.hash} className={tx.isIncoming ? 'incoming-tx' : 'outgoing-tx'}>
                    <td>
                      <Badge bg={tx.isIncoming ? 'success' : 'primary'}>
                        {tx.isIncoming ? 'Received' : 'Sent'}
                      </Badge>
                    </td>
                    <td className="amount-cell">
                      <span className={tx.isIncoming ? 'text-success' : 'text-primary'}>
                        {tx.isIncoming ? '+' : '-'}{tx.value}
                      </span>
                    </td>
                    <td>
                      {tx.isIncoming ? (
                        <span title={tx.from}>From: {formatAddress(tx.from)}</span>
                      ) : (
                        <span title={tx.to}>To: {formatAddress(tx.to)}</span>
                      )}
                    </td>
                    <td>{formatTime(tx.timestamp)}</td>
                    <td>
                      <Badge 
                        bg={
                          tx.status === 'confirmed' ? 'success' : 
                          tx.status === 'pending' ? 'warning' : 
                          'danger'
                        }
                      >
                        {tx.status === 'confirmed' ? 'Confirmed' : 
                         tx.status === 'pending' ? 'Pending' : 
                         'Failed'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default TransactionHistory; 