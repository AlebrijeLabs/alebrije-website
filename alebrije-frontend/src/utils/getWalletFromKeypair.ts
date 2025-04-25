import {
    Keypair,
    Transaction,
    VersionedTransaction,
} from "@solana/web3.js";
import { readFileSync } from "fs";
import { Wallet } from "@coral-xyz/anchor";

export function loadWalletKey(keypairPath: string): Wallet {
    const secretKeyString = readFileSync(keypairPath, "utf8");
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    const keypair = Keypair.fromSecretKey(secretKey);

    return {
        publicKey: keypair.publicKey,
        signTransaction: async (tx: Transaction | VersionedTransaction) => {
            if ("partialSign" in tx) {
                tx.partialSign(keypair);
            } else {
                console.warn("⚠️ Can't sign VersionedTransaction with keypair directly.");
            }
            return tx;
        },
        signAllTransactions: async (
            txs: (Transaction | VersionedTransaction)[]
        ) => {
            for (const tx of txs) {
                if ("partialSign" in tx) {
                    tx.partialSign(keypair);
                } else {
                    console.warn("⚠️ Can't sign VersionedTransaction with keypair directly.");
                }
            }
            return txs;
        },
    } as Wallet;
}

