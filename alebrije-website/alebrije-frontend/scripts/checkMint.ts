import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { getMint } from "@solana/spl-token";

const connection = new Connection(clusterApiUrl("devnet"));

const MINT_ADDRESS = new PublicKey("FSx3upaoPomkueMg7rftj8dy75GeifDL7qGbBSSC9KRt");

async function checkMint() {
    try {
        const mintInfo = await getMint(connection, MINT_ADDRESS);
        console.log("✅ Mint found on Devnet!");
        console.log("Mint Address:", MINT_ADDRESS.toBase58());
        console.log("Decimals:", mintInfo.decimals);
        console.log("Total Supply:", mintInfo.supply.toString());
    } catch (err) {
        console.error("❌ Failed to fetch mint info:", err);
    }
}

checkMint();
