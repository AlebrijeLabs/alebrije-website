import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Spinner } from 'react-bootstrap';
import TransactionHistoryService from '../services/transaction-history-service';
import WalletService from '../services/wallet-service';
import { formatDistance } from 'date-fns';

const TransactionHistory = ({ tokenAddress }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const loadTransactions = async () => {
    if (!WalletService.isConnected()) {
      setError('Wallet not connected');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await TransactionHistoryService.initialize(tokenAddress);
      const txHistory = await TransactionHistoryService.fetchTransactionHistory(tokenAddress);
      setTransactions(txHistory);
    } catch (err) {
      setError(err.message || 'Failed to load transactions');
      console.error('Failed to load transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (WalletService.isConnected()) {
      loadTransactions();
    }
    
    return () => {
      TransactionHistoryService.cleanup();
    };
  }, [tokenAddress]);
  
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
  };
  
  return (
    <Card>
      <Card.Body>
        <Card.Title>Transaction History</Card.Title>
        
        {error && (
          <div className="alert alert-danger">
            {error}
            <button 
              className="btn btn-link btn-sm float-end" 
              onClick={loadTransactions}
            >
              Retry
            </button>
          </div>
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
          <div className="table-responsive">
            <Table hover>
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
                  <tr key={tx.hash}>
                    <td>
                      <Badge bg={tx.isIncoming ? 'success' : 'primary'}>
                        {tx.isIncoming ? 'Received' : 'Sent'}
                      </Badge>
                    </td>
                    <td>
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
                        {tx.status}
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