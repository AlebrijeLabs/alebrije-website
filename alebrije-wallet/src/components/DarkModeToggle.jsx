import React, { useEffect, useState } from 'react';

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check if user has a preference stored
    const storedPreference = localStorage.getItem('darkMode');
    
    // Check if user has a system preference
    const prefersDarkMode = window.matchMedia && 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial state based on stored preference or system preference
    const initialDarkMode = storedPreference 
      ? storedPreference === 'true'
      : prefersDarkMode;
    
    setIsDarkMode(initialDarkMode);
    
    // Apply the initial theme
    if (initialDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);
  
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    // Apply or remove the dark-mode class
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };
  
  return (
    <button 
      className="dark-mode-toggle" 
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default DarkModeToggle; 