import { Adapter } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

declare module '@solana/wallet-adapter-wallets' {
  export class PhantomWalletAdapter implements Adapter {
    constructor();
  }
  
  export class SolflareWalletAdapter implements Adapter {
    constructor();
  }
} 