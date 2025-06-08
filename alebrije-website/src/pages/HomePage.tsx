import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const HomePage: React.FC = () => {
    const { publicKey, connected } = useWallet();
    const [tokenBalance] = useState<number | null>(null);
    
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

            <p style={{ fontSize: "1.2rem", color: "#333", marginBottom: "1.5rem" }}>
                A vibrant global folk art-inspired meme coin on Solana 🎨✨
            </p>

            <div className="stats-container">
                <div className="stat-item">
                    <h3>Total Supply</h3>
                    <p>9,000,000,000 ALBJ</p>
                </div>
                <div className="stat-item">
                    <h3>Burned</h3>
                    <p>4,500,000,000 ALBJ (50%)</p>
                </div>
                <div className="stat-item">
                    <h3>Network</h3>
                    <p>Solana</p>
                </div>
            </div>

            <div className="button-group">
                <button className="burn-btn">🔥 Burn Tokens</button>
                <button className="transfer-btn">🚀 Transfer Tokens</button>
                <a href="/whitepaper.pdf" target="_blank" className="whitepaper-link">
                    📄 Whitepaper
                </a>
            </div>

            {/* Token dashboard for connected wallets */}
            {connected && publicKey && (
                <div className="wallet-dashboard">
                    <h2>🎭 Your ALBJ Balance</h2>
                    <div className="balance-display">
                        <p>{tokenBalance !== null ? `${tokenBalance.toLocaleString()} ALBJ` : "Loading..."}</p>
                        <small>Wallet: {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}</small>
                    </div>
                </div>
            )}

            <div className="alebrije-gallery">
                <h2>🌟 Meet the Alebrijes</h2>
                <div className="creature-grid">
                    <img src="/Dragon-Jaguar.png" alt="Dragon-Jaguar Alebrije" className="creature-img" />
                    <img src="/Owl-Serpent.png" alt="Owl-Serpent Alebrije" className="creature-img" />
                    <img src="/Fox-Butterfly.png" alt="Fox-Butterfly Alebrije" className="creature-img" />
                    <img src="/Crab-Dragonfly.png" alt="Crab-Dragonfly Alebrije" className="creature-img" />
                </div>
            </div>

            <div className="social-links">
                <a href="https://x.com/Alebrije" target="_blank" rel="noopener noreferrer">🕊️ X (Twitter)</a>
                <a href="https://github.com/alebrije-project" target="_blank" rel="noopener noreferrer">💻 GitHub</a>
                <a href="https://t.me/Alebrije" target="_blank" rel="noopener noreferrer">📢 Telegram</a>
            </div>

            <footer style={{ marginTop: "3rem", fontSize: "0.9rem", color: "#666" }}>
                <p>🎨 ALBJ Token - Where Mexican Folk Art Meets DeFi 🦋</p>
                <p>Smart Contract: 26Uv9ibbjvqLYLjGCHuYE9xcPwVmd3JGsMzAqYMaSZY3</p>
            </footer>
        </div>
    );
};

export default HomePage;
