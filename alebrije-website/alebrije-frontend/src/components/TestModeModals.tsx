import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
// import { TokenOperations } from '../utils/tokenOperations';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const BaseModal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🧪 TEST MODE - {title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

interface BurnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestBurnModal: React.FC<BurnModalProps> = ({ isOpen, onClose }) => {
  const { publicKey, signTransaction } = useWallet();
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);

  // const tokenOps = new TokenOperations(true); // Test mode - disabled for now

  useEffect(() => {
    if (isOpen && publicKey) {
      // loadBalance(); // Disabled for now
    }
  }, [isOpen, publicKey]);

  const loadBalance = async () => {
    if (!publicKey) return;
    // const bal = await tokenOps.getTokenBalance(publicKey); // Disabled for now
    // setBalance(bal);
    setBalance(0); // Placeholder
  };

  const handleBurn = async () => {
    if (!publicKey || !signTransaction || !amount) return;

    setIsLoading(true);
    setMessage('');

    try {
      // const result = await tokenOps.burnTokens( // Disabled for now
      //   publicKey,
      //   parseFloat(amount),
      //   signTransaction
      // );

      // Placeholder response for now
      setMessage(`🧪 TEST MODE: Burn functionality temporarily disabled while fixing dependencies. Amount: ${amount} ALBJ`);
      setAmount('');
      await loadBalance(); // Refresh balance
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Burn ALBJ Tokens">
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#e0e0e0', marginBottom: '1rem' }}>
          🔥 <strong>DEVNET TESTING:</strong> Burn your test ALBJ tokens
        </p>
        
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: '#00ff41', fontSize: '0.9rem' }}>
            Current Balance: <strong>{balance} ALBJ</strong>
          </p>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount to burn"
            style={{
              width: '100%',
              padding: '0.8rem',
              background: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(0,255,255,0.3)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '1rem'
            }}
            disabled={isLoading}
          />
        </div>

        {message && (
          <div style={{
            background: message.includes('✅') ? 'rgba(0,255,65,0.1)' : 'rgba(255,107,107,0.1)',
            border: `1px solid ${message.includes('✅') ? '#00ff41' : '#ff6b6b'}`,
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            whiteSpace: 'pre-line',
            fontSize: '0.9rem'
          }}>
            {message}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={handleBurn}
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
            style={{
              background: isLoading ? '#666' : 'linear-gradient(135deg, #ff4500, #ff6347)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.8rem 1.5rem',
              fontSize: '1rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontFamily: 'Orbitron, sans-serif'
            }}
          >
            {isLoading ? '🔄 Burning...' : '🔥 Burn Tokens'}
          </button>
          
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: '#cccccc',
              border: '1px solid #666',
              borderRadius: '8px',
              padding: '0.8rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestTransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose }) => {
  const { publicKey, signTransaction } = useWallet();
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);

  // const tokenOps = new TokenOperations(true); // Test mode - disabled for now

  useEffect(() => {
    if (isOpen && publicKey) {
      // loadBalance(); // Disabled for now
    }
  }, [isOpen, publicKey]);

  const loadBalance = async () => {
    if (!publicKey) return;
    // const bal = await tokenOps.getTokenBalance(publicKey); // Disabled for now
    // setBalance(bal);
    setBalance(0); // Placeholder
  };

  const handleTransfer = async () => {
    if (!publicKey || !signTransaction || !amount || !recipient) return;

    setIsLoading(true);
    setMessage('');

    try {
      // const result = await tokenOps.transferTokens( // Disabled for now
      //   publicKey,
      //   recipient,
      //   parseFloat(amount),
      //   signTransaction
      // );

      // Placeholder response for now
      setMessage(`🧪 TEST MODE: Transfer functionality temporarily disabled while fixing dependencies. Amount: ${amount} ALBJ to ${recipient}`);
      setAmount('');
      setRecipient('');
      await loadBalance(); // Refresh balance
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Transfer ALBJ Tokens">
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#e0e0e0', marginBottom: '1rem' }}>
          🚀 <strong>DEVNET TESTING:</strong> Transfer your test ALBJ tokens
        </p>
        
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: '#00ff41', fontSize: '0.9rem' }}>
            Current Balance: <strong>{balance} ALBJ</strong>
          </p>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Recipient wallet address"
            style={{
              width: '100%',
              padding: '0.8rem',
              background: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(0,255,255,0.3)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '0.9rem',
              marginBottom: '0.5rem'
            }}
            disabled={isLoading}
          />
          
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount to transfer"
            style={{
              width: '100%',
              padding: '0.8rem',
              background: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(0,255,255,0.3)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '1rem'
            }}
            disabled={isLoading}
          />
        </div>

        {message && (
          <div style={{
            background: message.includes('✅') ? 'rgba(0,255,65,0.1)' : 'rgba(255,107,107,0.1)',
            border: `1px solid ${message.includes('✅') ? '#00ff41' : '#ff6b6b'}`,
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            whiteSpace: 'pre-line',
            fontSize: '0.9rem'
          }}>
            {message}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={handleTransfer}
            disabled={isLoading || !amount || !recipient || parseFloat(amount) <= 0}
            style={{
              background: isLoading ? '#666' : 'linear-gradient(135deg, #00bfff, #1e90ff)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.8rem 1.5rem',
              fontSize: '1rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontFamily: 'Orbitron, sans-serif'
            }}
          >
            {isLoading ? '🔄 Sending...' : '🚀 Send Tokens'}
          </button>
          
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: '#cccccc',
              border: '1px solid #666',
              borderRadius: '8px',
              padding: '0.8rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestHistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose }) => {
  const { publicKey } = useWallet();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // const tokenOps = new TokenOperations(true); // Test mode - disabled for now

  useEffect(() => {
    if (isOpen && publicKey) {
      // loadHistory(); // Disabled for now
    }
  }, [isOpen, publicKey]);

  const loadHistory = async () => {
    if (!publicKey) return;
    setIsLoading(true);
    // const history = await tokenOps.getTransactionHistory(publicKey); // Disabled for now
    // setTransactions(history);
    setTransactions([]); // Placeholder
    setIsLoading(false);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Transaction History">
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#e0e0e0', marginBottom: '1rem' }}>
          📋 <strong>DEVNET TESTING:</strong> Your recent transactions
        </p>

        {isLoading ? (
          <div style={{ color: '#00ff41' }}>🔄 Loading transactions...</div>
        ) : transactions.length > 0 ? (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {transactions.map((tx, index) => (
              <div key={index} style={{
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(0,255,255,0.3)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '0.5rem',
                textAlign: 'left'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#00d4ff' }}>
                  Signature: {tx.signature.substring(0, 20)}...
                </div>
                <div style={{ fontSize: '0.8rem', color: '#cccccc' }}>
                  Block: {tx.slot} | Time: {tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : 'Unknown'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: '#cccccc' }}>No transactions found</div>
        )}

        <button
          onClick={onClose}
          style={{
            background: 'linear-gradient(135deg, #00ff41, #00d4ff)',
            color: '#000000',
            border: 'none',
            borderRadius: '8px',
            padding: '0.8rem 2rem',
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '1rem',
            fontFamily: 'Orbitron, sans-serif'
          }}
        >
          Close
        </button>
      </div>
    </BaseModal>
  );
}; 