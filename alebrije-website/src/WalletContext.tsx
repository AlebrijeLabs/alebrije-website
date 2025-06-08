import { FC, ReactNode, useMemo } from "react";
import {
    ConnectionProvider,
    WalletProvider
} from "@solana/wallet-adapter-react";
import {
    WalletModalProvider
} from "@solana/wallet-adapter-react-ui";
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    CoinbaseWalletAdapter,
    TrustWalletAdapter
} from "@solana/wallet-adapter-wallets";

import { clusterApiUrl } from "@solana/web3.js";

// Updated to mainnet for production deployment
const network = "mainnet-beta";

import "@solana/wallet-adapter-react-ui/styles.css";

interface WalletContextProviderProps {
    children: ReactNode;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
    const endpoint = useMemo(() => clusterApiUrl(network), []);
    
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new CoinbaseWalletAdapter(),
            new TrustWalletAdapter()
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
