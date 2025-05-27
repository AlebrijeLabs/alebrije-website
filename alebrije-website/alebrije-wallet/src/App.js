import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Wallet from './components/Wallet';
import DarkModeToggle from './components/DarkModeToggle';
import './styles'; // Import all styles

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Wallet />} />
        {/* Add more routes as needed */}
      </Routes>
      <DarkModeToggle />
    </Router>
  );
}

export default App; 