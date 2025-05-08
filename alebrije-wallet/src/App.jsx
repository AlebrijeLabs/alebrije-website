import BurnToken from './components/BurnToken';

const tabs = [
  { id: 'wallet', label: 'Wallet', component: WalletConnectionTest },
  { id: 'transfer', label: 'Transfer Tokens', component: TokenTransfer },
  { id: 'burn', label: 'Burn Tokens', component: BurnToken },
  { id: 'history', label: 'Transaction History', component: TransactionHistory }
]; 