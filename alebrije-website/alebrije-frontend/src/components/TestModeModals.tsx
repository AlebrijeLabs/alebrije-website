import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
// import { PublicKey } from '@solana/web3.js';
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
  balance: number;
  updateBalance: (newBalance: number) => void;
}

export const TestBurnModal: React.FC<BurnModalProps> = ({ isOpen, onClose, balance, updateBalance }) => {
  const { publicKey, signTransaction } = useWallet();
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  // const tokenOps = new TokenOperations(true); // Test mode - disabled for now

  useEffect(() => {
    // Balance is managed by parent component
  }, [isOpen, publicKey]);

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

      // Simulate successful burn in test mode
      const burnAmount = parseFloat(amount);
      const newBalance = balance - burnAmount;
      updateBalance(newBalance);
      setMessage(`✅ SUCCESS: Burned ${amount} ALBJ tokens!\nNew Balance: ${newBalance.toLocaleString()} ALBJ`);
      setAmount('');
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
            Current Balance: <strong>{balance.toLocaleString()} ALBJ</strong>
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
  balance: number;
  updateBalance: (newBalance: number) => void;
}

export const TestTransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose, balance, updateBalance }) => {
  const { publicKey, signTransaction } = useWallet();
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  // const tokenOps = new TokenOperations(true); // Test mode - disabled for now

  useEffect(() => {
    // Balance is managed by parent component
  }, [isOpen, publicKey]);

  const handleTransfer = async () => {
    if (!publicKey || !signTransaction || !amount || !recipient) return;

    setIsLoading(true);
    setMessage('');

    try {
      // Calculate 5% tax
      const transferAmount = parseFloat(amount);
      const taxAmount = transferAmount * 0.05;
      const totalDeducted = transferAmount + taxAmount;
      
      // Check if sufficient balance
      if (totalDeducted > balance) {
        setMessage(`❌ Insufficient balance!\nRequired: ${totalDeducted.toLocaleString()} ALBJ (${transferAmount.toLocaleString()} + ${taxAmount.toLocaleString()} tax)\nAvailable: ${balance.toLocaleString()} ALBJ`);
        return;
      }

      // Simulate successful transfer
      const newBalance = balance - totalDeducted;
      updateBalance(newBalance);
      
      setMessage(`✅ SUCCESS: Transfer completed!\n\n📤 Sent: ${transferAmount.toLocaleString()} ALBJ\n💰 Tax (5%): ${taxAmount.toLocaleString()} ALBJ\n📊 Total Deducted: ${totalDeducted.toLocaleString()} ALBJ\n📍 To: ${recipient.substring(0, 8)}...${recipient.substring(recipient.length - 8)}\n💳 New Balance: ${newBalance.toLocaleString()} ALBJ`);
      
      setAmount('');
      setRecipient('');
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
            Current Balance: <strong>{balance.toLocaleString()} ALBJ</strong>
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
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && publicKey) {
      loadHistory();
    }
  }, [isOpen, publicKey]);

  const loadHistory = async () => {
    if (!publicKey) return;
    
    setIsLoading(true);
    try {
      const now = new Date();
      const testHistory = [
        { 
          id: 1, 
          type: '🚀 Transfer', 
          amount: '10,000 ALBJ', 
          date: new Date(now.getTime() - 1 * 60000).toLocaleString(),
          status: '✅ Completed',
          to: 'BA8h62nj...oEKweWUG',
          taxPaid: '500 ALBJ (5%)',
          txHash: 'def789...ghi012'
        },
        { 
          id: 2, 
          type: '🔥 Burn', 
          amount: '1,000 ALBJ', 
          date: new Date(now.getTime() - 15 * 60000).toLocaleString(),
          status: '✅ Completed',
          txHash: 'abc123...def456'
        },
        { 
          id: 3, 
          type: '📥 Received', 
          amount: '675,000,000 ALBJ', 
          date: new Date(now.getTime() - 45 * 60000).toLocaleString(),
          status: '✅ Completed',
          from: 'Initial Distribution',
          txHash: 'xyz789...uvw012'
        }
      ];
      setHistory(testHistory);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Transaction History">
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#e0e0e0', marginBottom: '1rem' }}>
          📋 <strong>DEVNET TESTING:</strong> Your recent transactions
        </p>

        {isLoading ? (
          <div style={{ color: '#00ff41' }}>🔄 Loading transactions...</div>
        ) : history.length > 0 ? (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {history.map((tx) => (
              <div key={tx.id} style={{
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(0,255,255,0.3)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '0.5rem',
                textAlign: 'left'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ color: '#00ff41', fontWeight: 'bold' }}>
                    {tx.type}
                  </span>
                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>
                    {tx.amount}
                  </span>
                </div>
                
                <div style={{ fontSize: '0.8rem', color: '#cccccc', marginBottom: '0.3rem' }}>
                  📅 {tx.date}
                </div>
                
                <div style={{ fontSize: '0.8rem', color: '#00d4ff', marginBottom: '0.3rem' }}>
                  {tx.status}
                </div>
                
                {tx.txHash && (
                  <div style={{ fontSize: '0.7rem', color: '#888' }}>
                    🔗 TX: {tx.txHash}
                  </div>
                )}
                
                {tx.from && (
                  <div style={{ fontSize: '0.7rem', color: '#888' }}>
                    📤 From: {tx.from}
                  </div>
                )}
                
                {tx.to && (
                  <div style={{ fontSize: '0.7rem', color: '#888' }}>
                    📥 To: {tx.to}
                  </div>
                )}
                
                {tx.taxPaid && (
                  <div style={{ fontSize: '0.7rem', color: '#ff9500' }}>
                    💰 Tax: {tx.taxPaid}
                  </div>
                )}
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