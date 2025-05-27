import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Tab, Nav, Alert } from 'react-bootstrap';
import WalletConnect from './WalletConnect';
import TokenBalance from './TokenBalance';
import TokenTransfer from './TokenTransfer';
import TransactionHistory from './TransactionHistory';
import TransactionDetails from './TransactionDetails';
import ErrorDisplay from './ErrorDisplay';
import WalletService from '../services/wallet-service';
import TokenService from '../services/token-service';
import config from '../config';
import { withErrorBoundary } from '../utils/error-handler';

const Wallet = () => {
  const [activeToken, setActiveToken] = useState(null);
  const [availableTokens, setAvailableTokens] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  
  useEffect(() => {
    // Get available tokens from config
    const tokens = Object.keys(config.TOKEN_ADDRESSES);
    setAvailableTokens(tokens);
    
    // Set default active token
    if (tokens.length > 0 && !activeToken) {
      setActiveToken(tokens[0]);
    }
    
    // Initialize wallet service
    const initWallet = async () => {
      try {
        // Try to connect if previously connected
        if (localStorage.getItem('walletConnected') === 'true') {
          await WalletService.connect();
        }
      } catch (err) {
        console.error('Failed to auto-connect wallet:', err);
        // Don't show error for auto-connect failures
      }
    };
    
    initWallet();
    
    // Cleanup on unmount
    return () => {
      // Any cleanup needed
    };
  }, []);
  
  const handleSelectToken = (token) => {
    setActiveToken(token);
  };
  
  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
  };
  
  return (
    <Container className="wallet-container my-4">
      <Row className="mb-4">
        <Col>
          <WalletConnect />
        </Col>
      </Row>
      
      {error && (
        <Row className="mb-4">
          <Col>
            <ErrorDisplay 
              error={error} 
              onDismiss={() => setError(null)} 
            />
          </Col>
        </Row>
      )}
      
      {availableTokens.length === 0 ? (
        <Row>
          <Col>
            <Alert variant="warning">
              No tokens configured. Please add token configurations to your config file.
            </Alert>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <Tab.Container 
              activeKey={activeToken || availableTokens[0]} 
              onSelect={handleSelectToken}
            >
              <Row>
                <Col md={3}>
                  <Nav variant="pills" className="flex-column">
                    {availableTokens.map(token => (
                      <Nav.Item key={token}>
                        <Nav.Link eventKey={token}>{token}</Nav.Link>
                      </Nav.Item>
                    ))}
                  </Nav>
                </Col>
                <Col md={9}>
                  <Tab.Content>
                    {availableTokens.map(token => (
                      <Tab.Pane key={token} eventKey={token}>
                        <Row className="mb-4">
                          <Col md={6}>
                            <TokenBalance tokenName={token} />
                          </Col>
                          <Col md={6}>
                            <TokenTransfer tokenName={token} />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <TransactionHistory 
                              tokenName={token} 
                              onTransactionClick={handleTransactionClick}
                            />
                          </Col>
                        </Row>
                      </Tab.Pane>
                    ))}
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </Col>
        </Row>
      )}
      
      <TransactionDetails 
        transaction={selectedTransaction}
        tokenName={activeToken}
        show={showTransactionDetails}
        onHide={() => setShowTransactionDetails(false)}
      />
    </Container>
  );
};

// Wrap with error boundary
export default withErrorBoundary(Wallet, (error) => (
  <Container className="my-4">
    <Alert variant="danger">
      <Alert.Heading>Something went wrong</Alert.Heading>
      <p>{error.getUserMessage()}</p>
      <hr />
      <p className="mb-0">
        Please refresh the page and try again. If the problem persists, contact support.
      </p>
    </Alert>
  </Container>
)); 