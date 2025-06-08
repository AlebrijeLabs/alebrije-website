// src/components/BurnButtonComponent.tsx
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
// Import for @solana/spl-token@0.1.8
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";

const MINT_ADDRESS = new PublicKey(import.meta.env.VITE_TOKEN_MINT_ADDRESS || "AHstXMQM3uWETKn3WaztgayZtQhB7iJiPTvqmVi7cbC");

const BurnButtonComponent = () => {
    const [amount, setAmount] = useState("0");
    const [status, setStatus] = useState("");

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const handleBurn = async () => {
        setStatus(""); // Clear previous status
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

            setStatus("🔥 Preparing burn transaction...");

            // Get associated token account for this wallet + mint
            // For @solana/spl-token@0.1.8, getOrCreateAssociatedTokenAccount is often used
            // However, to keep it similar, we'll first get the address then use it.
            // If you want to create if not exists, use Token.getOrCreateAssociatedTokenAccount
            const associatedTokenAddress = await Token.getAssociatedTokenAddress(
                TOKEN_PROGRAM_ID, // AssociatedTokenProgramId - often TOKEN_PROGRAM_ID or a specific ATA program ID
                TOKEN_PROGRAM_ID, // TokenProgramId
                MINT_ADDRESS,
                publicKey,
                false // allowOwnerOffCurve - set to true if using off-curve addresses
            );
            console.log("Associated Token Account:", associatedTokenAddress.toBase58());

            // Create burn instruction - for 0.1.8, it's a method on the Token instance
            // We don't need a Token instance just for the instruction if we build it manually, 
            // but createBurnInstruction as a static method might not be available directly.
            // Let's ensure we have the correct way to create the instruction for 0.1.8
            // createBurnInstruction is a static method in older versions, but its parameters might differ or it might be on the Token class instance
            // The more common way with 0.1.8 was often Token.createBurnInstruction

            const burnIx = Token.createBurnInstruction(
                TOKEN_PROGRAM_ID,
                MINT_ADDRESS, // Program ID of the token mint
                associatedTokenAddress, // Token account to burn from
                publicKey, // Owner of the token account
                [], // Multi-signers (if any)
                burnAmount // Amount to burn
            );
            console.log("Burn instruction created.");

            const tx = new Transaction().add(burnIx);
            tx.feePayer = publicKey;
            const recentBlockhash = await connection.getLatestBlockhash();
            tx.recentBlockhash = recentBlockhash.blockhash;
            console.log("Transaction prepared, recentBlockhash:", recentBlockhash.blockhash);
            
            setStatus("🔥 Sending burn transaction...");
            const signature = await sendTransaction(tx, connection);
            console.log("Transaction sent, signature:", signature);

            setStatus(`⏳ Confirming transaction: ${signature.slice(0,10)}...`);
            await connection.confirmTransaction({
                signature,
                blockhash: recentBlockhash.blockhash,
                lastValidBlockHeight: recentBlockhash.lastValidBlockHeight
            }, 'confirmed');

            setStatus(`✅ Burned ${amount} $ALEBRIJE – TX: ${signature}`);
            console.log("✅ Burn successful:", signature);
            setAmount("0"); // Reset amount
        } catch (err: any) {
            console.error("❌ Burn failed:", err);
            let errorMessage = "❌ Burn failed. ";
            if (err.message) {
                errorMessage += err.message;
            } else if (err.logs) {
                errorMessage += err.logs.join("\n");
            } else {
                errorMessage += err.toString();
            }
            setStatus(errorMessage);
        }
    };

    return (
        <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #444", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.05)" }}>
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
                        backgroundColor: "#333",
                        color: "white"
                    }}
                    min="0"
                    step="any"
                />
                <button
                    onClick={handleBurn}
                    disabled={!publicKey || parseFloat(amount) <= 0 || isNaN(parseFloat(amount)) || status.startsWith("🔥") || status.startsWith("⏳")}
                    style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "6px",
                        backgroundColor: "#ff4d4f",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        opacity: (!publicKey || parseFloat(amount) <= 0 || isNaN(parseFloat(amount)) || status.startsWith("🔥") || status.startsWith("⏳")) ? 0.5 : 1
                    }}
                >
                    {status.startsWith("🔥") || status.startsWith("⏳") ? "Processing..." : "Burn $ALEBRIJE"}
                </button>
            </div>
            {status && <p style={{ wordBreak: "break-all", color: status.startsWith("✅") ? "lightgreen" : "pink" }}>{status}</p>}
        </div>
    );
};

export default BurnButtonComponent;





