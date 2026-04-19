import { useState, useEffect, useMemo } from 'react';
import { DashboardGrid } from './layouts/DashboardGrid';
import { SearchBar } from './components/SearchBar';
import { TickerSearch } from './components/TickerSearch';
import { BiggestMovers } from './components/BiggestMovers';
import { PerformanceChart } from './components/PerformanceChart';

// Import our new Smart Container components
import { AccountStatsGrid } from './components/AccountStatsGrid';
import { RecentActivityFeed } from './components/RecentActivity'; 

// Import the Holdings components and API hook
import { HoldingsTable } from './components/HoldingsTable';
import { fetchHoldings, Holding } from './api/dashboardApi'; // Adjust path to your api.ts

export const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardSearchQuery, setDashboardSearchQuery] = useState('');
  
  // We only need to manage Holdings state here now, because the Table needs the SearchBar filter
  const [hData, sethData] = useState<Holding[]>([]);

  // Fetch holdings via our API instead of PapaParse!
  useEffect(() => {
    const loadHoldings = async () => {
      try {
        const data = await fetchHoldings();
        sethData(data);
      } catch (error) {
        console.error('Error fetching holdings:', error);
      }
    };
    loadHoldings();
  }, []);

  // Filter holdings based on search bar
  const filteredHoldings = useMemo(() => {
    if (!searchQuery) return hData;
    const q = searchQuery.trim().toLowerCase();
    
    return hData.filter((h) => 
      h.ticker.toLowerCase().includes(q)
    );
  }, [searchQuery, hData]);

  return (
    <DashboardGrid
      header={
        <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'left', width: '100%' }}>
          
          {/* LEFT SECTION: Title */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', width:'max-content', paddingRight:'64px', paddingLeft: '40px' }}>
            <h1 style={{ margin: 0, fontSize: '32px', color: 'white' }}>My Dashboard</h1>
          </div>
          
          {/* MIDDLE SECTION: Navigation Links */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'left', gap: '48px', width: '-webkit-fill-available' }}>
            <button 
              onClick={() => console.log('Route to /dashboard')}
              style={{ background: 'transparent', border: 'none', fontSize: '20px', fontWeight: 500, color: '#eceef5', cursor: 'pointer', padding: 0 }}
            >
              Dashboard
            </button>
            <button 
              onClick={() => console.log('Route to /ledger')}
              style={{ background: 'transparent', border: 'none', fontSize: '20px', fontWeight: 500, color: '#eceef5', cursor: 'pointer', padding: 0 }}
            >
              Ledger
            </button>
            <button 
              onClick={() => console.log('Route to /ordering')}
              style={{ background: 'transparent', border: 'none', fontSize: '20px', fontWeight: 500, color: '#eceef5', cursor: 'pointer', padding: 0 }}
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
              <button title="Settings" style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: 0 }}>⚙️</button>
              <button title="Profile" style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', padding: 0 }}>👤</button>
            </div>
          </div>
        </div>
      }
      movers={<BiggestMovers />}
      
      // Look how clean these next three props are now!
      stats={<AccountStatsGrid />}
      chart={<PerformanceChart />}
      activity={
        <div style={{ padding: 20, textAlign: 'left', color: '#ffffff', display: 'flex', flexDirection: 'column', width: '-webkit-fill-available', backdropFilter:'blur(1px)'}}>
          <div>
            <h3 style={{marginBlock: '5px', color: '#ffffff'}}>Recent Activity</h3>
            <p style={{marginBlock: '3px', color: '#d6d6d6'}}>Your recent transactions.</p>
          </div>
          {/* Drops right in and handles its own logic */}
          <RecentActivityFeed />
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