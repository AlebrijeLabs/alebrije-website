import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { getTokenBalance } from '../services/token-service';
import { getWalletBalance } from '../services/wallet-service';

interface DashboardProps {
  tokenMintAddress: string;
}

const Dashboard: React.FC<DashboardProps> = ({ tokenMintAddress }) => {
  const { publicKey } = useWallet();
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!publicKey) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch token balance
        const tokenBal = await getTokenBalance(
          new PublicKey(tokenMintAddress),
          publicKey
        );
        setTokenBalance(tokenBal);

        // Fetch SOL balance
        const solBal = await getWalletBalance(publicKey);
        setSolBalance(solBal);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [publicKey, tokenMintAddress]);

  if (!publicKey) {
    return (
      <div className="dashboard-container">
        <h2>Dashboard</h2>
        <p>Please connect your wallet to view your balances.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <h2>Dashboard</h2>
        <p>Loading balances...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <h2>Dashboard</h2>
        <p className="error">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="balance-cards">
        <div className="balance-card">
          <h3>Token Balance</h3>
          <p>{tokenBalance !== null ? tokenBalance.toFixed(2) : 'N/A'} ALBJ</p>
        </div>
        <div className="balance-card">
          <h3>SOL Balance</h3>
          <p>{solBalance !== null ? solBalance.toFixed(4) : 'N/A'} SOL</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 