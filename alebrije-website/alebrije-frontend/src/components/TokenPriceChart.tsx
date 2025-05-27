import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceData {
  timestamp: number;
  price: number;
}

const TokenPriceChart: React.FC = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        const mockData = Array.from({ length: 24 }, (_, i) => ({
          timestamp: Date.now() - (23 - i) * 3600000,
          price: 0.1 + Math.random() * 0.05
        }));
        setPriceData(mockData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch price data');
      } finally {
        setLoading(false);
      }
    };

    fetchPriceData();
  }, []);

  if (loading) return <div>Loading price chart...</div>;
  if (error) return <div>Error: {error}</div>;

  const data = {
    labels: priceData.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'ALBJ Price (USD)',
        data: priceData.map(d => d.price),
        borderColor: '#9945FF',
        backgroundColor: 'rgba(153, 69, 255, 0.1)',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'ALBJ Token Price (24h)'
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  return (
    <div style={{ 
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default TokenPriceChart; 