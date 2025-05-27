import React from 'react';
import { ToastContainer } from 'react-toastify';
import StakingComponent from './components/StakingComponent';
import TokenStats from './components/TokenStats';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  // Mock data for TokenStats
  const tokenStats = {
    circulatingSupply: 9000000000, // 9 billion
    totalHolders: 1000,
    marketCap: 1000000 // $1M
  };

  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={5000} />
      <header className="App-header">
        <h1>ALBJ Token</h1>
      </header>
      <main>
        <TokenStats {...tokenStats} />
        <StakingComponent />
      </main>
    </div>
  );
}

export default App;
