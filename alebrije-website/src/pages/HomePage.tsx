// src/pages/HomePage.tsx
import React from "react";
import "./HomePage.css"; // ✅ Make sure this is included
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";


const HomePage: React.FC = () => {
    return (
        <div className="home-container">
            <img src="/logo.png" alt="Alebrije Logo" className="logo" />
            <WalletMultiButton />
            <h1 style={{ fontSize: "2.5rem", color: "#ff6600", marginBottom: "0.5rem" }}>
                Welcome to Alebrije Token
            </h1>

            <p>
                A vibrant Mexican folk art-inspired meme coin on Solana
            </p>

            <div className="button-group">
                <button className="burn-btn">🔥 Burn Tokens</button>
                <button className="transfer-btn">🚀 Transfer Tokens</button>
                <a
                    href="/whitepaper.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whitepaper-link"
                >
                    📄 View Whitepaper
                </a>
            </div>

            <div className="social-links">
                <a href="https://x.com/Alebrije" target="_blank" rel="noopener noreferrer">🕊️ X</a>
                <a href="https://github.com/alebrije-project" target="_blank" rel="noopener noreferrer">💻 GitHub</a>
                <a href="https://t.me/Alebrije" target="_blank" rel="noopener noreferrer">📢 Telegram</a>
            </div>

        </div>
    );
};

export default HomePage;




