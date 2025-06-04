import { FC, ReactNode, useMemo, useState } from "react";
import {
    PhantomWalletAdapter
} from "@solana/wallet-adapter-wallets";
import {
    ConnectionProvider,
    WalletProvider
} from "@solana/wallet-adapter-react";
import {
    WalletModalProvider
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

// Default styles for wallet modal
require("@solana/wallet-adapter-react-ui/styles.css");

export const WalletConnectionProvider: FC<{ children: ReactNode }> = ({ children }) => {
    // Add console logs for debugging
    console.log("WalletConnectionProvider initializing");

    const endpoint = useMemo(() => {
        console.log("Setting endpoint");
        return clusterApiUrl("devnet");
    }, []);

    const wallets = useMemo(() => {
        console.log("Creating wallet adapters");
        // Check for browser environment
        return typeof window !== 'undefined' ? [new PhantomWalletAdapter()] : [];
    }, []);

    // Add a simple fallback UI in case of errors
    const [error, setError] = useState<Error | null>(null);

    if (error) {
        return (
            <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                <h2>Wallet Connection Error</h2>
                <p>There was an error connecting to your wallet: {error.message}</p>
                <p>Please refresh the page and try again.</p>
            </div>
        );
    }

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider
                wallets={wallets}
                autoConnect={false} // Disable autoConnect initially
                onError={(error) => {
                    console.error("Wallet error:", error);
                    setError(error as Error);
                }}
            >
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
