import { useState, useEffect, useMemo } from 'react';
import { DashboardGrid } from './layouts/DashboardGrid';
import { StatCard } from './components/StatCard';
import { RecentActivity, RecentActivityProps } from './components/RecentActivity';
import { PerformanceChart } from './components/PerformanceChart';
import { SearchBar } from './components/SearchBar';
import { HoldingsTable } from './components/HoldingsTable';
import { MOCK_STATS, MOCK_HOLDINGS, MOCK_ACTIVITY } from './data/mockData';
import Papa, { ParseResult } from "papaparse"


export const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rData, setrData] = useState<RecentActivityProps[]>([]);

  useEffect(() => {
    fetch('/src/features/dashboard/data/ds5_recent_actions.csv')
      .then((response) => response.text())
      .then((csvString) => {
        Papa.parse(csvString, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const dataWithIds: RecentActivityProps[] = results.data.map((row: any, index: number) => {
            return {
              id: index + 1, // Start IDs from 1, or just use index for 0-based
              ...row,
            } as RecentActivityProps;
        });
            setrData(dataWithIds);
        },
        });
      })
      .catch((error) => console.error('Error fetching or parsing data:', error));
  }, []);

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
        <div style={{ padding: 20, textAlign: 'left', color: '#000000', display: 'flex', flexDirection: 'column', width: '-webkit-fill-available'}}>
          <div>
            <h3 style={{marginBlock: '5px', color: '#000000'}}>Recent Activity</h3>
            <p style={{marginBlock: '3px', color: '#696969'}}>Your recent transactions.</p>
          </div>
          <>
            {rData.slice(0, 5).map((activity) => (
              <RecentActivity key={activity.id} {...activity} />
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