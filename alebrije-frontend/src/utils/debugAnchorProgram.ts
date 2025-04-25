import { Program, Idl } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

// Define the same interface as in getProgram.ts
interface ProgramData {
  idl: any;
  programId: PublicKey;
  connection: Connection;
  wallet: WalletContextState;
}

export const debugAnchorProgram = (program: Program<Idl> | ProgramData | null) => {
  if (!program) {
    return "No program provided";
  }

  try {
    console.log("Program ID:", program.programId.toString());
    
    // Check if this is an Anchor Program or our custom ProgramData
    if (program instanceof Program) {
      // It's an Anchor Program
      console.log("Type: Anchor Program");
      
      // Try to access program structure safely
      const programMethods = Object.getOwnPropertyNames(program.methods);
      console.log("Available methods:", programMethods);
      
      // Try to get instruction accounts
      if (programMethods.includes('burn')) {
        try {
          // @ts-ignore - Accessing potentially private properties for debugging
          const burnIx = program._idl?.instructions.find((ix: any) => ix.name === 'burn');
          console.log("Burn instruction definition:", burnIx);
          
          if (burnIx) {
            console.log("Burn accounts:", burnIx.accounts);
            
            // Check for any accounts with mut constraint
            const mutAccounts = burnIx.accounts
              .filter((acc: any) => acc.isMut)
              .map((acc: any) => acc.name);
            
            console.log("Mutable accounts required:", mutAccounts);
          }
        } catch (err) {
          console.error("Could not access burn instruction details:", err);
        }
      }
    } else {
      // It's our custom ProgramData
      console.log("Type: ProgramData");
      console.log("IDL:", program.idl ? "Present" : "Not available");
      console.log("Connection:", program.connection ? "Present" : "Not available");
      console.log("Wallet Connected:", program.wallet.connected);
      
      if (program.idl) {
        // Display basic IDL information
        console.log("Program Name:", program.idl.name);
        console.log("Program Version:", program.idl.version);
        
        if (program.idl.instructions) {
          console.log("Available Instructions:", program.idl.instructions.map((ix: any) => ix.name));
        }
      }
    }
    
    return "Debug information logged to console";
  } catch (error) {
    console.error("Error debugging program:", error);
    return "Error debugging program";
  }
}; 