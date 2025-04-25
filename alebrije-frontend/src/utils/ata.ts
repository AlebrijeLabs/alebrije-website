import { PublicKey } from "@solana/web3.js";

/**
 * ✅ Safe, browser-compatible replacement for getAssociatedTokenAddress
 */
export const getAssociatedTokenAddress = async (
  mint: PublicKey,
  owner: PublicKey,
  allowOwnerOffCurve = false
): Promise<PublicKey> => {
  const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
    "ATokenGPvbdGVxr1JcAT3fF6zgdW2PmpbPZc2xDqvLQ"
  );

  const TOKEN_PROGRAM_ID = new PublicKey(
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
  );

  return (
    await PublicKey.findProgramAddress(
      [
        Buffer.from("ata"),
        owner.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  )[0];
};

