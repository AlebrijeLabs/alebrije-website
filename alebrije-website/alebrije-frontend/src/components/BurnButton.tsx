import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getProgram } from "../utils/getProgram";
import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

const BurnButton = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [amount, setAmount] = useState("1000000000");
  const [loading, setLoading] = useState(false);

  const handleBurn = async () => {
    if (!wallet.publicKey) {
      alert("Wallet not connected");
      return;
    }

    const parsedAmount = parseInt(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      const program = getProgram(connection, wallet);
      const mint = new PublicKey("FSx3upaoPomkueMg7rftj8dy75GeifDL7qGbBSSC9KRt");

      const fromTokenAccount = await connection.getTokenAccountsByOwner(wallet.publicKey, {
        mint,
      });

      if (fromTokenAccount.value.length === 0) {
        alert("No token account found for this wallet");
        return;
      }

      const tokenAccount = fromTokenAccount.value[0].pubkey;

      await program.methods
        .burnTokens(new BN(parsedAmount))
        .accounts({
          authority: wallet.publicKey,
          mint,
          fromTokenAccount: tokenAccount,
          tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        })
        .rpc();

      alert("🔥 Tokens burned successfully!");
    } catch (err: any) {
      console.error("Burn failed:", err);
      alert("Burn failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "400px", margin: "auto" }}>
      <input
        type="number"
        value={amount}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}

        placeholder="Amount to burn"
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />
      <button
        onClick={handleBurn}
        disabled={!wallet.connected || loading}
        style={{
          width: "100%",
          padding: "0.75rem",
          backgroundColor: loading ? "#ccc" : "#d9534f",
          color: "#fff",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "bold",
        }}
      >
        {loading ? "Burning..." : "🔥 Burn Tokens"}
      </button>
    </div>
  );
};

export default BurnButton;
