import { Adapter } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

declare module '@solana/wallet-adapter-wallets' {
  export class PhantomWalletAdapter extends Adapter {}
  export class SolflareWalletAdapter extends Adapter {}
} 