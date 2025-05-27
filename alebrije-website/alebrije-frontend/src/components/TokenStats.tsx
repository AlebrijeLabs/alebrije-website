import React from 'react';
import { TOKEN_TOTAL_SUPPLY } from '../constants';

interface TokenStatsProps {
  circulatingSupply: number;
  totalHolders: number;
  marketCap: number;
}

const TokenStats: React.FC<TokenStatsProps> = ({
  circulatingSupply = 0,
  totalHolders = 0,
  marketCap = 0
}) => {
  const stats = [
    {
      label: 'Total Supply',
      value: TOKEN_TOTAL_SUPPLY.toLocaleString(),
      unit: 'ALBJ'
    },
    {
      label: 'Circulating Supply',
      value: circulatingSupply.toLocaleString(),
      unit: 'ALBJ'
    },
    {
      label: 'Total Holders',
      value: totalHolders.toLocaleString(),
      unit: 'Wallets'
    },
    {
      label: 'Market Cap',
      value: `$${marketCap.toLocaleString()}`,
      unit: 'USD'
    }
  ];

  return (
    <div className="token-stats">
      <h2>Token Statistics</h2>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <h3>{stat.label}</h3>
            <p>{stat.value} {stat.unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenStats; 