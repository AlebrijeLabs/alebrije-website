import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import WalletConnect from './WalletConnect';
import TokenBalance from './TokenBalance';
import TokenTransfer from './TokenTransfer';
import TransactionHistory from './TransactionHistory';
import BurnToken from './BurnToken';
import TokenService from '../services/token-service';

const Dashboard = () => {
  const { connected, publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState('wallet');
  const [tokenAddress, setTokenAddress] = useState('native');
  const [selectedToken, setSelectedToken] = useState('SOL');
  
  useEffect(() => {
    const network = process.env.REACT_APP_SOLANA_NETWORK || 'devnet';
    const endpoint = process.env.REACT_APP_SOLANA_RPC_URL || 
                    `https://api.${network}.solana.com`;
    TokenService.initialize(endpoint);
  }, []);
  
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <img src="/logo.svg" alt="Alebrije Logo" className="logo me-3" />
              <h1 className="h4 mb-0">Alebrije Wallet</h1>
            </div>
            {connected && (
              <div className="text-end">
                <small className="text-muted">Connected: {publicKey?.toString().slice(0, 6)}...{publicKey?.toString().slice(-4)}</small>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="container py-4">
        <div className="row g-4">
          <div className="col-md-3">
            <div className="card sidebar-card">
              <div className="card-body">
                <h5 className="card-title">Navigation</h5>
                <div className="nav flex-column nav-pills">
                  <button 
                    className={`nav-link text-start ${activeTab === 'wallet' ? 'active' : ''}`}
                    onClick={() => setActiveTab('wallet')}
                  >
                    <i className="bi bi-wallet2 me-2"></i>
                    Wallet
                  </button>
                  <button 
                    className={`nav-link text-start ${activeTab === 'transfer' ? 'active' : ''}`}
                    onClick={() => setActiveTab('transfer')}
                  >
                    <i className="bi bi-arrow-left-right me-2"></i>
                    Transfer Tokens
                  </button>
                  <button 
                    className={`nav-link text-start ${activeTab === 'burn' ? 'active' : ''}`}
                    onClick={() => setActiveTab('burn')}
                  >
                    <i className="bi bi-fire me-2"></i>
                    Burn Tokens
                  </button>
                  <button 
                    className={`nav-link text-start ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                  >
                    <i className="bi bi-clock-history me-2"></i>
                    Transaction History
                  </button>
                </div>
              </div>
            </div>

            <div className="card sidebar-card">
              <div className="card-body">
                <h5 className="card-title">Wallet Connection</h5>
                <WalletConnect />
                {connected && (
                  <>
                    <div className="mt-3">
                      <h6>Network</h6>
                      <p className="mb-1">Devnet</p>
                      <small className="text-muted">To change networks, please disconnect your wallet first.</small>
                    </div>
                    <div className="mt-3">
                      <h6>Status: Connected</h6>
                      <div className="mt-2">
                        <small className="text-muted">Account:</small>
                        <p className="text-break mb-0">{publicKey?.toString()}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-9">
            {!connected ? (
              <div className="text-center p-5 welcome-container">
                <img src="/welcome.svg" alt="Welcome" className="welcome-image mb-4" />
                <h2>Welcome to Alebrije Wallet</h2>
                <p className="lead">
                  Connect your Solana wallet to access the Alebrije token functionalities.
                </p>
                <div className="mt-4">
                  <WalletConnect />
                </div>
              </div>
            ) : (
              <>
                {(activeTab === 'transfer' || activeTab === 'burn') && (
                  <div className="card mb-4">
                    <div className="card-body">
                      <h5 className="card-title">Select Token</h5>
                      <div className="mb-3">
                        <select 
                          className="form-select mb-3" 
                          value={selectedToken} 
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === 'SOL') {
                              setTokenAddress('native');
                              setSelectedToken('SOL');
                            } else if (value === 'custom') {
                              setTokenAddress('');
                              setSelectedToken('custom');
                            }
                          }}
                        >
                          <option value="SOL">SOL (Native)</option>
                          <option value="custom">Custom Token</option>
                        </select>
                        
                        {selectedToken === 'custom' && (
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              value={tokenAddress}
                              onChange={(e) => setTokenAddress(e.target.value)}
                              placeholder="Enter token mint address"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'wallet' && <TokenBalance tokenAddress={tokenAddress} />}
                {activeTab === 'transfer' && <TokenTransfer tokenAddress={tokenAddress} />}
                {activeTab === 'burn' && <BurnToken tokenAddress={tokenAddress} />}
                {activeTab === 'history' && <TransactionHistory tokenAddress={tokenAddress} />}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 