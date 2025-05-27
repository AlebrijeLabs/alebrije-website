import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';

// Mock useWallet hook
jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: () => ({
    publicKey: { toString: () => 'AEBNG73sEZtiYdeDCmuy6ZGrWUaCUQoU5tTeuDw9u7zQ' },
    connected: true,
  }),
}));

describe('Wallet Dashboard Component', () => {
  test('renders dashboard title', () => {
    render(<Dashboard />);
    const titleElement = screen.getByText(/Alebrije Wallet Dashboard/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('displays connected wallet address', () => {
    render(<Dashboard />);
    const walletAddress = screen.getByText(/AEBNG7...u7zQ/i);
    expect(walletAddress).toBeInTheDocument();
  });

  test('renders action buttons', () => {
    render(<Dashboard />);
    const transferButton = screen.getByText(/Transfer Tokens/i);
    const burnButton = screen.getByText(/Burn Tokens/i);
    const historyButton = screen.getByText(/Transaction History/i);
    
    expect(transferButton).toBeInTheDocument();
    expect(burnButton).toBeInTheDocument();
    expect(historyButton).toBeInTheDocument();
  });

  test('displays network information', () => {
    render(<Dashboard />);
    const networkHeading = screen.getByRole('heading', { name: /Network/i });
    expect(networkHeading).toBeInTheDocument();
  });
}); 