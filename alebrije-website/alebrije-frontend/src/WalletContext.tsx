import React, { FC, useMemo } from 'react';
import { clusterApiUrl } from '@solana/web3.js';
import {
    ConnectionProvider,
    WalletProvider
} from '@solana/wallet-adapter-react';
import {
    WalletModalProvider
} from '@solana/wallet-adapter-react-ui';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter
} from '@solana/wallet-adapter-wallets';

import('@solana/wallet-adapter-react-ui/styles.css');

export const WalletContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const network = 'devnet';
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(
        () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
