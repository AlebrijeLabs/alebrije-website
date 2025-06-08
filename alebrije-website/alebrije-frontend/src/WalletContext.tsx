import React, { FC, ReactNode, useMemo } from "react";
import {
    ConnectionProvider,
    WalletProvider
} from "@solana/wallet-adapter-react";
import {
    WalletModalProvider
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter
} from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";

// Updated to mainnet for production deployment
const network = "mainnet-beta";

interface WalletContextProviderProps {
    children: ReactNode;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
    const endpoint = useMemo(() => clusterApiUrl(network), []);
    
    // ✅ SIMPLE: Only Phantom and Solflare - guaranteed to work
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter()
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
