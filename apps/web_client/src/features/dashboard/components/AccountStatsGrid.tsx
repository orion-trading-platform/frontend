import { useEffect, useState } from 'react';
import { fetchAccountStats, AccountStats } from '../api/dashboardApi'; // Adjust path
import { StatCard } from './StatCard';

export const AccountStatsGrid = () => {
  const [stats, setStats] = useState<AccountStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchAccountStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch account stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // What to show while we wait for the API
  if (loading || !stats) {
    return <div style={{ padding: '20px', color: '#bcc8e1b7' }}>Loading account summary...</div>;
  }

  // Formatting the raw data for the Dumb components
  const isDayPositive = stats.dayChangeAmt >= 0;
  const dayChangeFormatted = `${isDayPositive ? '+' : ''}$${Math.abs(stats.dayChangeAmt).toLocaleString(undefined, { minimumFractionDigits: 2 })} (${stats.dayChangePct}%)`;

  const isYieldPositive = stats.totalYield >= 0;
  const yieldFormatted = `${isYieldPositive ? '+' : ''}${stats.totalYield}%`;

  return (
  <div
    style={{
      display: 'flex',
      gap: '12px',
      flexWrap: 'nowrap',
      width: '100%',
    }}
  >
    <div style={{ flex: '0 1 31%', minWidth: 0 }}>
      <StatCard
        label="Portfolio Value"
        value={`$${stats.portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
        change={dayChangeFormatted}
        isPositive={isDayPositive}
        icon="Portfolio"
      />
    </div>

    <div style={{ flex: '0 1 31%', minWidth: 0 }}>
      <StatCard
        label="Buying Power"
        value={`$${stats.buyingPower.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
        change="Available"
        isPositive={true}
        icon="Cash"
      />
    </div>

    <div style={{ flex: '0 1 31%', minWidth: 0 }}>
      <StatCard
        label="Total Yield"
        value={yieldFormatted}
        change="All Time"
        isPositive={isYieldPositive}
        icon="Yield"
      />
    </div>
  </div>
);
};