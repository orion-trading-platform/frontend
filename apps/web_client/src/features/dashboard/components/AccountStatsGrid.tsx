import { useEffect, useState } from 'react';
import { useAccount } from '@/features/auth';
import { fetchAccountStats, AccountStats } from '../api/dashboardApi'; // Adjust path
import { StatCard } from './StatCard';

export const AccountStatsGrid = () => {
  const { account, isLoading: accountLoading } = useAccount();

  const [stats, setStats] = useState<AccountStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!account?.account_id) {
        setStats(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const cashBalance = parseFloat(account.balance);
        const data = await fetchAccountStats(
          String(account.account_id),
          Number.isFinite(cashBalance) ? cashBalance : 0
        );
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch account stats:', error);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [account?.account_id]);

  // What to show while we wait for the account
  if (accountLoading) {
    return <div style={{ padding: '20px', color: '#bcc8e1b7' }}>Loading account...</div>;
  }

  if (!account?.account_id) {
    return <div style={{ padding: '20px', color: '#bcc8e1b7' }}>No account selected.</div>;
  }

  // What to show while we wait for the API
  if (loading || !stats) {
    return <div style={{ padding: '20px', color: '#bcc8e1b7' }}>Loading account summary...</div>;
  }

  // Formatting the raw data for the Dumb components
  const isDayPositive = stats.dayChangeAmt >= 0;
  //const dayChangeFormatted = `${isDayPositive ? '+' : ''}$${Math.abs(stats.dayChangeAmt).toLocaleString(undefined, { minimumFractionDigits: 2 })} (${stats.dayChangePct}%)`;
  const compactDayAmt = Math.abs(stats.dayChangeAmt).toLocaleString(undefined, {
    notation: 'compact',
    maximumFractionDigits: 1,
  });

  const dayChangeFormatted = `${isDayPositive ? '+' : '-'}${Math.abs(stats.dayChangePct)}%|$${compactDayAmt}`;  const isYieldPositive = stats.totalYield >= 0;
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
          label="Portfolio"
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