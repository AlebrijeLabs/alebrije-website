import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import WalletService from './services/wallet-service';
import TokenService from './services/token-service';
import config from './config/index.js';

const Dashboard = () => {
  const { t } = useTranslation();
  const [balance, setBalance] = useState(0);
  const [network, setNetwork] = useState(config.DEFAULT_NETWORK.network);
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeWallet = async () => {
      try {
        const connected = await WalletService.connect();
        setIsConnected(connected);
        if (connected) {
          const accounts = await WalletService.getAccounts();
          setPublicKey(accounts[0]);
          // Initialize token service and get balance
          await TokenService.initialize();
          const tokenBalance = await TokenService.getBalance('AlebrijeSOL');
          setBalance(tokenBalance);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    initializeWallet();
  }, []);

  const handleTransfer = async () => {
    try {
      setError(null);
      const recipient = prompt('Enter recipient address:');
      if (!recipient) return;

      const amount = prompt('Enter amount to transfer:');
      if (!amount || isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount');
      }

      const tx = await TokenService.transfer(recipient, parseFloat(amount));
      alert(`Transfer successful! Transaction hash: ${tx.hash}`);
      
      // Refresh balance
      const newBalance = await TokenService.getBalance('AlebrijeSOL');
      setBalance(newBalance);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBurn = async () => {
    try {
      setError(null);
      const amount = prompt('Enter amount to burn:');
      if (!amount || isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount');
      }

      const tx = await TokenService.burn(parseFloat(amount));
      alert(`Burn successful! Transaction hash: ${tx.hash}`);
      
      // Refresh balance
      const newBalance = await TokenService.getBalance('AlebrijeSOL');
      setBalance(newBalance);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewHistory = async () => {
    try {
      setError(null);
      const history = await TokenService.getTransactionHistory();
      
      // Create a modal or display the history in a new component
      const historyWindow = window.open('', 'Transaction History', 'width=600,height=400');
      historyWindow.document.write(`
        <html>
          <head>
            <title>Transaction History</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h2>Transaction History</h2>
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${history.map(tx => `
                  <tr>
                    <td>${tx.type}</td>
                    <td>${tx.amount}</td>
                    <td>${new Date(tx.timestamp).toLocaleString()}</td>
                    <td>${tx.status}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="wallet-dashboard">
      <div className="wallet-header">
        <h2>Alebrije Wallet Dashboard</h2>
        <div className="connection-status">
          {isConnected ? (
            <span>Connected: {publicKey?.toString().slice(0, 6)}...{publicKey?.toString().slice(-4)}</span>
          ) : (
            <span>Not Connected</span>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="wallet-actions">
        <button className="action-btn" onClick={handleTransfer}>Transfer Tokens</button>
        <button className="action-btn" onClick={handleBurn}>Burn Tokens</button>
        <button className="action-btn" onClick={handleViewHistory}>Transaction History</button>
      </div>

      <div className="network-status">
        <h3>Network</h3>
        <p>{network}</p>
        <p className="network-note">To change networks, please disconnect your wallet first.</p>
      </div>

      <div className="account-info">
        <h3>Account:</h3>
        <p>{publicKey?.toString()}</p>
        <h3>Balance:</h3>
        <p>{balance} ALBJ</p>
      </div>
    </div>
  );
};

export default Dashboard; 