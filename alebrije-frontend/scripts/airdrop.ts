import 'dotenv/config';
import {
    getOrCreateAssociatedTokenAccount,
    transfer,
} from '@solana/spl-token';
import {
    Connection,
    Keypair,
    PublicKey,
    clusterApiUrl,
} from '@solana/web3.js';
import fs from 'fs';

// ✅ Load env variables
console.log("✅ ENV loaded");
console.log("PAYER_KEYPAIR:", process.env.PAYER_KEYPAIR);
console.log("TOKEN_MINT:", process.env.TOKEN_MINT);

// ✅ Check env and file
if (!process.env.PAYER_KEYPAIR || !fs.existsSync(process.env.PAYER_KEYPAIR)) {
    throw new Error("❌ PAYER_KEYPAIR missing or not found");
}
if (!process.env.TOKEN_MINT) {
    throw new Error("❌ TOKEN_MINT is missing");
}

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const payerKeypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(process.env.PAYER_KEYPAIR, "utf8")))
);
const mint = new PublicKey(process.env.TOKEN_MINT);

// ✅ Replace with your actual addresses
const recipients = [
    "BkRepDMEshCTW3s1GGQy8Js2nY3RYrDkXq9e3BareAkc",
    "DRhqzEWvJDUt3vbi3XBSCk8GRfVYZNAQqDFf13N3QhMP",
    "7ziQFR433cyfFpzzLMNxPzhe2iZW3EWcxjFr4PW43fzK",
];

async function airdrop(recipientAddress: string) {
    try {
        const recipient = new PublicKey(recipientAddress);

        const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            payerKeypair,
            mint,
            payerKeypair.publicKey
        );

        const toTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            payerKeypair,
            mint,
            recipient,
            true
        );

        const signature = await transfer(
            connection,
            payerKeypair,
            fromTokenAccount.address,
            toTokenAccount.address,
            payerKeypair,
            1_000_000_000 // 🔥 1 token (if 9 decimals)
        );

        console.log(`✅ Airdropped to ${recipientAddress}: ${signature}`);
    } catch (err) {
        console.error(`❌ Failed to send to ${recipientAddress}`, err);
    }
}

(async () => {
    for (const recipient of recipients) {
        await airdrop(recipient);
    }
})();

