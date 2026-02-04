import { useState, useMemo } from 'react';
import { DashboardGrid } from './layouts/DashboardGrid';
import { StatCard } from './components/StatCard';
import { RecentActivity } from './components/RecentActivity';
import { PerformanceChart } from './components/PerformanceChart';
import { SearchBar } from './components/SearchBar';
import { HoldingsTable } from './components/HoldingsTable';
import { MOCK_STATS, MOCK_HOLDINGS, MOCK_ACTIVITY } from './data/mockData';

export const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHoldings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MOCK_HOLDINGS;
    return MOCK_HOLDINGS.filter(
      (h) =>
        h.symbol.toLowerCase().includes(q) ||
        h.name.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <DashboardGrid
      header={<h1>My Dashboard</h1>}
      stats={
        <>
          {MOCK_STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </>
      }
      chart={<PerformanceChart />}
      activity={
        <div style={{ padding: 20, textAlign: 'center', color: '#000000' }}>
          <h3>Recent Activity</h3>
          <p>Your recent transactions.</p>
          <>
            {MOCK_ACTIVITY.map((activity) => (
              <RecentActivity key={activity.type} {...activity} />
            ))}
        </>
        </div>
      }
      holdings={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <HoldingsTable holdings={filteredHoldings} />
        </div>
      }
    />
  );
};


export default DashboardPage;