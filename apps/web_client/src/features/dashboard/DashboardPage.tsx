import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLogout, MdDarkMode, MdLightMode } from 'react-icons/md';
import ProfileModal from '../auth/modals/ProfileModal';
import LogoutConfirmationModal from '../auth/modals/LogoutConfirmationModal';
import { useAuth } from '../auth';
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
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  var emptyTable: Holding[] = [];

  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
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
    <>
    <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    <LogoutConfirmationModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
    <DashboardGrid
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

          {/* LEFT SECTION: Brand */}
          <div style={{ paddingLeft: '25px' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'white', fontSize: '22px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: '"Noto Sans", Roboto, sans-serif' }}
            >
              ORION
            </button>
          </div>

          {/* RIGHT SECTION: Search & Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

            <div style={{ width: '240px', flexShrink: 0 }}>
              <TickerSearch
                value={dashboardSearchQuery}
                onChange={setDashboardSearchQuery}
                onSelect={(sym) => navigate(`/trade?symbol=${sym}`)}
                placeholder="Search..."
              />
            </div>

            <div style={{ width: '140px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                onClick={() => setDark(!dark)}
                style={{ background: 'none', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: 'white', flexShrink: 0 }}
              >
                {dark ? <MdLightMode size={22} /> : <MdDarkMode size={22} />}
              </button>
              <button
                aria-label="Profile"
                onClick={() => setProfileOpen(true)}
                style={{ background: 'none', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, overflow: 'hidden', flexShrink: 0 }}
              >
                {currentUser?.profile_picture_url ? (
                  <img src={currentUser.profile_picture_url} alt="Profile" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                    👤
                  </div>
                )}
              </button>
              <button
                aria-label="Logout"
                onClick={() => setLogoutOpen(true)}
                style={{ background: 'none', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: 'white', flexShrink: 0 }}
              >
                <MdLogout size={22} />
              </button>
            </div>
          </div>
        </div>
      }
      movers={<BiggestMovers onSelect={(sym) => navigate(`/trade?symbol=${sym}`)} />}
      stats={
        <>
          {MOCK_STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </>
      }
      chart={<PerformanceChart />}
      activity={
        <div style={{ padding: 20, textAlign: 'left', color: '#ffffff', display: 'flex', flexDirection: 'column', width: '-webkit-fill-available', backdropFilter:'blur(1px)'}}>
          <div>
            <button
              type="button"
              onClick={() => navigate('/ledger')}
              style={{
                marginBlock: '5px',
                color: '#000000',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                font: 'inherit',
                fontSize: '1.17em',
                fontWeight: 600,
                textAlign: 'left',
              }}
              title="View full ledger"
            >
              Recent Activity
            </button>
            <p style={{marginBlock: '3px', color: '#696969'}}>Your recent transactions.</p>
          </div>
          <>
            {rData.slice(0, 5).map((activity) => (
              <RecentActivity key={activity.id} {...activity} onClick={() => navigate('/ledger')} />
            ))}
        </>
        </div>
      }
      
      holdings={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <HoldingsTable holdings={filteredHoldings??emptyTable} onSelect={(ticker) => navigate(`/trade?symbol=${ticker}`)} />
        </div>
      }
    />
    </>
  );
};

export default DashboardPage;