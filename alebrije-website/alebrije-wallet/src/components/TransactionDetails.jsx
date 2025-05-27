import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import config from '../config';

const TransactionDetails = ({ transaction, tokenName, show, onHide }) => {
  if (!transaction) return null;
  
  const getExplorerUrl = () => {
    const tokenInfo = config.TOKEN_ADDRESSES[tokenName];
    if (!tokenInfo) return null;
    
    const blockchain = tokenInfo.blockchain || config.DEFAULT_NETWORK.blockchain;
    const network = config.DEFAULT_NETWORK.network;
    
    if (blockchain === 'ethereum') {
      const baseUrl = config.NETWORKS.ethereum[network].blockExplorer;
      return `${baseUrl}/tx/${transaction.hash}`;
    } else if (blockchain === 'solana') {
      const baseUrl = config.NETWORKS.solana[network].blockExplorer;
      return `${baseUrl}/tx/${transaction.hash}`;
    }
    
    return null;
  };
  
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Transaction Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table className="transaction-details-table">
          <tbody>
            <tr>
              <td>Transaction Hash</td>
              <td className="text-break">{transaction.hash}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>
                <span className={
                  transaction.status === 'confirmed' ? 'text-success' : 
                  transaction.status === 'pending' ? 'text-warning' : 
                  'text-danger'
                }>
                  {transaction.status === 'confirmed' ? 'Confirmed' : 
                   transaction.status === 'pending' ? 'Pending' : 
                   'Failed'}
                </span>
              </td>
            </tr>
            <tr>
              <td>From</td>
              <td className="text-break">{transaction.from}</td>
            </tr>
            <tr>
              <td>To</td>
              <td className="text-break">{transaction.to}</td>
            </tr>
            <tr>
              <td>Amount</td>
              <td>{transaction.value} {tokenName}</td>
            </tr>
            <tr>
              <td>Date & Time</td>
              <td>{formatDate(transaction.timestamp)}</td>
            </tr>
            <tr>
              <td>Block Number</td>
              <td>{transaction.blockNumber || 'Pending'}</td>
            </tr>
            <tr>
              <td>Confirmations</td>
              <td>{transaction.confirmations || 0}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        {getExplorerUrl() && (
          <Button 
            variant="outline-primary" 
            href={getExplorerUrl()} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            View on Explorer
          </Button>
        )}
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionDetails; 