import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getProgram } from "../utils/getProgram";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { getAssociatedTokenAddress } from "../utils/ata";

// Replace with actual wallet addresses
const LIQUIDITY_TOKEN_ACCOUNT = new PublicKey("BkRepDMEshCTW3s1GGQy8Js2nY3RYrDkXq9e3BareAkc");
const MARKETING_TOKEN_ACCOUNT = new PublicKey("DRhqzEWvJDUt3vbi3XBSCk8GRfVYZNAQqDFf13N3QhMP");
const CHARITY_TOKEN_ACCOUNT = new PublicKey("7ziQFR433cyfFpzzLMNxPzhe2iZW3EWcxjFr4PW43fzK");
const MINT = new PublicKey("FSx3upaoPomkueMg7rftj8dy75GeifDL7qGbBSSC9KRt");

export const TransferWithTaxButton = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { publicKey, sendTransaction } = wallet;

  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("1");
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!publicKey || !sendTransaction) {
      alert("Connect your wallet first.");
      return;
    }

    let recipientPubkey: PublicKey;
    try {
      recipientPubkey = new PublicKey(recipientAddress);
    } catch {
      alert("Invalid recipient address.");
      return;
    }

    setLoading(true);

    try {
      const { programId } = getProgram(connection, wallet);

      const fromATA = await getAssociatedTokenAddress(MINT, publicKey);
      const toATA = await getAssociatedTokenAddress(MINT, recipientPubkey);

      const amountToTransfer = BigInt(Number(amount) * 1_000_000_000);
      const TRANSFER_DISCRIMINATOR = [151, 252, 82, 111, 101, 78, 200, 99];
      const amountBuffer = Buffer.alloc(8);
      amountBuffer.writeBigUInt64LE(amountToTransfer);
      const data = Buffer.from([...TRANSFER_DISCRIMINATOR, ...amountBuffer]);

      const keys = [
        { pubkey: publicKey, isSigner: true, isWritable: true },
        { pubkey: MINT, isSigner: false, isWritable: true },
        { pubkey: fromATA, isSigner: false, isWritable: true },
        { pubkey: toATA, isSigner: false, isWritable: true },
        { pubkey: LIQUIDITY_TOKEN_ACCOUNT, isSigner: false, isWritable: true },
        { pubkey: MARKETING_TOKEN_ACCOUNT, isSigner: false, isWritable: true },
        { pubkey: CHARITY_TOKEN_ACCOUNT, isSigner: false, isWritable: true },
        { pubkey: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), isSigner: false, isWritable: false },
      ];

      const instruction = new TransactionInstruction({
        programId,
        keys,
        data,
      });

      const tx = new Transaction().add(instruction);
      const latestBlockhash = await connection.getLatestBlockhash();
      tx.recentBlockhash = latestBlockhash.blockhash;
      tx.feePayer = publicKey;

      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, "processed");

      alert("✅ Transfer complete!");
    } catch (err: any) {
      console.error("Transfer failed:", err);
      alert("Transfer failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "400px", margin: "auto" }}>
      <TextField
        label="Recipient Address"
        variant="outlined"
        fullWidth
        value={recipientAddress}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecipientAddress(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Amount"
        variant="outlined"
        fullWidth
        type="number"
        value={amount}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleTransfer}
        disabled={loading || !publicKey}
        fullWidth
        sx={{ marginTop: "1rem" }}
      >
        {loading ? "Sending..." : "Transfer with Tax"}
      </Button>
    </div>
  );
};

export default TransferWithTaxButton;
