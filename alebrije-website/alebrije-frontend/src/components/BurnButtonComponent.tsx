// src/components/BurnButtonComponent.tsx
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { getAssociatedTokenAddress, createBurnInstruction, TOKEN_PROGRAM_ID } from "@solana/spl-token";
// Removed unused BN import

const MINT_ADDRESS = new PublicKey(import.meta.env.VITE_TOKEN_MINT_ADDRESS || "AHstXMQM3uWETKn3WaztgayZtQhB7iJiPTvqmVi7cbC");

const BurnButtonComponent = () => {
    const [amount, setAmount] = useState("0");
    const [status, setStatus] = useState("");

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const handleBurn = async () => {
        try {
            if (!publicKey || !sendTransaction) {
                setStatus("❌ Wallet not connected");
                return;
            }

            const burnAmount = Math.floor(parseFloat(amount) * 1_000_000_000); // 9 decimals

            if (isNaN(burnAmount) || burnAmount <= 0) {
                setStatus("❌ Invalid amount");
                return;
            }

            // Get associated token account for this wallet + mint
            const ata = await getAssociatedTokenAddress(MINT_ADDRESS, publicKey);

            // Create burn instruction
            const ix = createBurnInstruction(
                ata, // from token account
                MINT_ADDRESS, // mint
                publicKey, // owner
                burnAmount,
                [], // multisig
                TOKEN_PROGRAM_ID
            );

            const tx = new Transaction().add(ix);
            const signature = await sendTransaction(tx, connection);

            setStatus(`🔥 Burned ${amount} $ALEBRIJE – TX: ${signature}`);
            console.log("✅ Burn successful:", signature);
        } catch (err: any) {
            console.error("❌ Burn failed:", err);
            setStatus("❌ Burn failed: " + (err.message || err.toString()));
        }
    };

    return (
        <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #444", borderRadius: "12px" }}>
            <h2>🔥 Burn Tokens</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount to burn"
                    style={{
                        padding: "0.5rem",
                        borderRadius: "6px",
                        border: "1px solid #888",
                        width: "200px",
                    }}
                    min="0"
                    step="0.000001"
                />
                <button
                    onClick={handleBurn}
                    disabled={!publicKey || parseFloat(amount) <= 0 || isNaN(parseFloat(amount))}
                    style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "6px",
                        backgroundColor: "#ff4d4f",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Burn $ALEBRIJE
                </button>
            </div>
            <p>{status}</p>
        </div>
    );
};

export default BurnButtonComponent;





