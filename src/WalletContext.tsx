import React, { FC, ReactNode, useMemo } from "react";
import {
    ConnectionProvider,
    WalletProvider
} from "@solana/wallet-adapter-react";
import {
    WalletModalProvider
} from "@solana/wallet-adapter-react-ui";
import {
    useStandardWalletAdapters
} from "@solana/wallet-adapter-react";

import { clusterApiUrl } from "@solana/web3.js";

// Default to devnet – change to "mainnet-beta" if needed
const network = "devnet";

require("@solana/wallet-adapter-react-ui/styles.css");

interface WalletContextProviderProps {
    children: ReactNode;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
    const endpoint = useMemo(() => clusterApiUrl(network), []);
    const wallets = useStandardWalletAdapters(); // ✅ Includes Phantom, Solflare, Backpack, etc.

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
