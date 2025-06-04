import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const HomePage: React.FC = () => {
    const { publicKey } = useWallet();
    
    return (
        <div className="home-container">
            {/* Wallet button in upper right corner */}
            <div style={{position:"absolute", top:"20px", right:"20px", zIndex:"100"}}>
                <WalletMultiButton />
            </div>
            
            <img src="/logo.png" alt="Alebrije Logo" className="logo" />
            
            <h1 style={{ fontSize: "2.5rem", color: "#ff6600", marginBottom: "0.5rem" }}>
                Welcome to Alebrije Token
            </h1>

            <p>
                A vibrant global folk art-inspired meme coin on Solana
            </p>

            <div className="button-group">
                <button className="burn-btn">🔥 Burn Tokens</button>
                <button className="transfer-btn">🚀 Transfer Tokens</button>
            </div>

            {/* Add token dashboard if wallet is connected */}
            {publicKey && (
                <div style={{margin:"2rem 0", padding:"1rem", backgroundColor:"rgba(0,0,0,0.1)", borderRadius:"12px"}}>
                    <h2>Your ALBJ Balance</h2>
                    <p>Connect your wallet to view your token balance</p>
                </div>
            )}

            <div className="social-links">
                <a href="https://x.com/Alebrije" target="_blank" rel="noopener noreferrer">🕊️ X</a>
                <a href="https://github.com/alebrije-project" target="_blank" rel="noopener noreferrer">💻 GitHub</a>
                <a href="https://t.me/Alebrije" target="_blank" rel="noopener noreferrer">📢 Telegram</a>
            </div>
        </div>
    );
};

export default HomePage;
