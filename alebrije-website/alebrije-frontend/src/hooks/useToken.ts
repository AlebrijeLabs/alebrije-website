import { useState, useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { getTokenBalance } from '../services/token-service';
import { TOKEN_MINT_ADDRESS } from '../constants';
import type { TokenBalance, TransactionResult } from '../types';

export const useToken = () => {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<TokenBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!publicKey) {
      setError('Wallet not connected');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const tokenBal = await getTokenBalance(TOKEN_MINT_ADDRESS, publicKey);
      setBalance({
        mint: TOKEN_MINT_ADDRESS,
        amount: tokenBal,
        decimals: 9
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  const transfer = useCallback(async (
    to: PublicKey,
    amount: number
  ): Promise<TransactionResult> => {
    if (!publicKey) {
      return {
        signature: '',
        status: 'error',
        error: 'Wallet not connected'
      };
    }

    try {
      setLoading(true);
      setError(null);
      // TODO: Implement transfer logic
      return {
        signature: '',
        status: 'success'
      };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Transfer failed';
      setError(error);
      return {
        signature: '',
        status: 'error',
        error
      };
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  return {
    balance,
    loading,
    error,
    fetchBalance,
    transfer
  };
}; 