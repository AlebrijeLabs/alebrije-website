import { Connection, clusterApiUrl } from "@solana/web3.js";
import { getProgram } from "./utils/getProgram";
import { loadWalletKey } from "./utils/getWalletFromKeypair";
import path from "path";

// ✅ Update the path to your actual keypair JSON location
const KEYPAIR_PATH = path.resolve(__dirname, "../../alebrije-wallet/alebrije-keypair.json");

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const main = async () => {
    try {
        const wallet = loadWalletKey(KEYPAIR_PATH); // loads wallet from JSON
        const walletContext = {
            publicKey: wallet.publicKey,
            signTransaction: wallet.signTransaction,
            signAllTransactions: wallet.signAllTransactions,
            connected: true,
        } as any; // Cast to 'any' if WalletContextState has additional properties
        const program = getProgram(connection, walletContext); // gets your Anchor program instance
        console.log("✅ Loaded program:", program.programId.toBase58());
        console.log("🔑 Wallet public key:", wallet.publicKey.toBase58());
    } catch (err) {
        console.error("❌ Error loading program or wallet:", err);
    }
};

main();

