import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor';
import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { WalletContextState } from "@solana/wallet-adapter-react";
import idlJson from "../idl/alebrije_coin.json";

// Program IDs
export const ANCHOR_PROGRAM_ID = new PublicKey('138h1Ad67ppzWK6Q6V8MdcpfJyF6WB9FBJd217p8NMD');
export const TOKEN_PROGRAM_ID = new PublicKey("FSx3upaoPomkueMg7rftj8dy75GeifDL7qGbBSSC9KRt");

// Define the custom IDL structure as a type assertion
// This avoids direct type conflicts with the Anchor IDL interfaces
const programIdl = {
  version: "0.1.0",
  name: "alebrije_token",
  instructions: [
    {
      name: "burn_tokens",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true
        },
        {
          name: "mint",
          isMut: true,
          isSigner: false
        },
        {
          name: "from_token_account",
          isMut: true,
          isSigner: false
        },
        {
          name: "token_program",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "amount",
          type: "u64"
        }
      ]
    },
    {
      name: "transfer_with_tax",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true
        },
        {
          name: "mint",
          isMut: true,
          isSigner: false
        },
        {
          name: "from_token_account",
          isMut: true,
          isSigner: false
        },
        {
          name: "to_token_account",
          isMut: true,
          isSigner: false
        },
        {
          name: "token_program",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "amount",
          type: "u64"
        }
      ]
    }
  ],
  metadata: {
    address: "138h1Ad67ppzWK6Q6V8MdcpfJyF6WB9FBJd217p8NMD"
  }
} as unknown as Idl;

// Return type for getProgram function
interface ProgramData {
  idl: typeof idlJson;
  programId: PublicKey;
  connection: Connection;
  wallet: WalletContextState;
}

/**
 * Get program information and configuration
 * @param connection Solana connection
 * @param wallet Wallet context state
 * @returns Program data object with necessary properties
 */
export const getProgram = (connection: Connection, wallet: WalletContextState): ProgramData => {
  if (
    !wallet.publicKey ||
    !wallet.signTransaction ||
    !wallet.signAllTransactions
  ) {
    throw new Error("Wallet not connected.");
  }

  return {
    idl: idlJson,
    programId: TOKEN_PROGRAM_ID,
    connection,
    wallet,
  };
};

/**
 * Get an Anchor program instance
 * @param connection Solana connection
 * @param wallet Wallet context state
 * @returns Anchor Program or null if initialization fails
 */
export const getAnchorProgram = (connection: Connection, wallet: WalletContextState) => {
  if (!wallet || !wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
    return null;
  }
  
  try {
    // Create a wallet adapter that matches what AnchorProvider expects
    const walletAdapter = {
      publicKey: wallet.publicKey,
      signTransaction: async <T extends Transaction | VersionedTransaction>(tx: T): Promise<T> => {
        if (!wallet.signTransaction) {
          throw new Error("Wallet does not support signing transactions");
        }
        return wallet.signTransaction(tx);
      },
      signAllTransactions: async <T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> => {
        if (!wallet.signAllTransactions) {
          throw new Error("Wallet does not support signing multiple transactions");
        }
        return wallet.signAllTransactions(txs);
      }
    };
    
    const provider = new AnchorProvider(
      connection,
      walletAdapter,
      { commitment: 'confirmed' }
    );
    
    // Create program with the IDL, using a type assertion to bypass type checking
    // @ts-ignore - The programId is incorrectly being flagged as PublicKey instead of Provider
    const program = new Program(programIdl, ANCHOR_PROGRAM_ID, provider);
    return program;
  } catch (error) {
    console.error("Failed to load Anchor program:", error);
    return null;
  }
};
