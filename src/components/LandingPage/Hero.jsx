import React from 'react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="hero-section">
      <div className="container">
        <h1 className="main-title">ALBJ Token</h1>
        <h2 className="subtitle">Guiding Spirit Creatures and Meme coins into the Multiverse</h2>
        <div className="launch-date">
          Launching June 12, 2025 (VI·XII·MMXXV)
        </div>
        <div className="cta-buttons">
          <button className="primary-btn">Select Wallet</button>
          <button className="secondary-btn">Learn More</button>
        </div>
      </div>
    </section>
  );
};

export default Hero; 