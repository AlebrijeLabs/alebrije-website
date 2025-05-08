import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletContextProvider } from './contexts/WalletContext';
import Dashboard from './components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';
import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
  return (
    <WalletContextProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </Router>
    </WalletContextProvider>
  );
}

export default App; 