import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

// Mock the wallet adapter dependencies
jest.mock('@solana/wallet-adapter-react', () => ({
  ConnectionProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  WalletProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useWallet: () => ({
    publicKey: null,
    connected: false,
  }),
  useConnection: () => ({
    connection: {},
  }),
}));

jest.mock('@solana/wallet-adapter-react-ui', () => ({
  WalletModalProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<App />);
    expect(getByText('🔥 $ALEBRIJE Token Tools')).toBeTruthy();
  });
}); 