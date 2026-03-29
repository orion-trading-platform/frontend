import { useState, useEffect, useMemo } from 'react';
import { DashboardGrid } from './layouts/DashboardGrid';
import { StatCard } from './components/StatCard';
import { RecentActivity, RecentActivityProps } from './components/RecentActivity';
import { PerformanceChart } from './components/PerformanceChart';
import { SearchBar } from './components/SearchBar';
import { HoldingsTable } from './components/HoldingsTable';
import { TickerSearch } from './components/TickerSearch';
import { BiggestMovers } from './components/BiggestMovers';
import { MOCK_STATS, MOCK_HOLDINGS, MOCK_ACTIVITY } from './data/mockData';
import Papa, { ParseResult } from "papaparse"


export const DashboardPage = () => {
  var emptyTable: Holding[] = [];

  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardSearchQuery, setDashboardSearchQuery] = useState('');
  const [rData, setrData] = useState<RecentActivityProps[]>([]);
  const [hData, sethData] = useState<Holding[]>([]);

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

  useEffect(()=> {
    fetch('/src/features/dashboard/data/ds4_holdings.csv')
      .then((response) => response.text())
      .then((csvString) => {
        Papa.parse(csvString, {
          header: true,
          dynamicTyping: true,
          complete: (results: ParseResult<Holding>) => {
            sethData(results.data)
        },
        });
      })
      .catch((error) => console.error('Error fetching or parsing data:', error));
  }, );


  const filteredHoldings = useMemo(() => {
    if (!searchQuery) return hData;
    const q = searchQuery.trim().toLowerCase();
    if (hData.length != 0){
      return hData.filter(
        (h) =>
          h.ticker.toLowerCase().includes(q) ||
          h.companyName.toLowerCase().includes(q)
      );}

  }, [searchQuery, hData]);


  return (
    <DashboardGrid
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          
          {/* LEFT SECTION: Title */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <h1 style={{ margin: 0, fontSize: '24px' }}>My Dashboard</h1>
          </div>
          
          {/* MIDDLE SECTION: Navigation Links */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '32px' }}>
            <button 
              onClick={() => console.log('Route to /ledger')}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                fontSize: '16px', 
                fontWeight: 500, 
                color: '#4b5563', /* Dark gray text */
                cursor: 'pointer', 
                padding: 0 
              }}
            >
              Ledger
            </button>
            <button 
              onClick={() => console.log('Route to /ordering')}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                fontSize: '16px', 
                fontWeight: 500, 
                color: '#4b5563', 
                cursor: 'pointer', 
                padding: 0 
              }}
            >
              Ordering
            </button>
          </div>

          {/* RIGHT SECTION: Search & Icons */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
            
            <div style={{ minWidth: 200, maxWidth: 300, width: '100%' }}>
              <TickerSearch
                value={dashboardSearchQuery}
                onChange={setDashboardSearchQuery}
                placeholder="Search..."
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                title="Settings"
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: 0 }}
              >
                ⚙️
              </button>
              <button 
                title="Profile"
                style={{ 
                  background: '#f3f4f6', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '50%', 
                  width: '36px', 
                  height: '36px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  padding: 0
                }}
              >
                👤
              </button>
            </div>

          </div>
        </div>
      }
      movers={<BiggestMovers />}
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
          <HoldingsTable holdings={filteredHoldings??emptyTable}/>
        </div>
      }
    />
  );
};


export default DashboardPage;