import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLogout, MdDarkMode, MdLightMode } from 'react-icons/md';
import { FaUserAlt } from 'react-icons/fa';
import { useTheme } from '@/ThemeContext';
import logoWhite from '@/assets/logo-white.svg';
import orionTextWhite from '@/assets/orion-text-white.svg';
import { Header } from 'ui-kit';
import { WalletHeaderNavButton } from '@/features/wallet/components/WalletHeaderNavButton';
import { LedgerHeaderNavButton } from '@/features/ledger/LedgerHeaderNavButon';
import ProfileModal from '../auth/modals/ProfileModal';
import LogoutConfirmationModal from '../auth/modals/LogoutConfirmationModal';
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
  const { dark, toggleDark } = useTheme();
  var emptyTable: Holding[] = [];
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
        <Header
          left={
            <button
              onClick={() => navigate('/dashboard')}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <img src={logoWhite} alt="" style={{ height: '47px', width: 'auto' }} className="brightness-0 dark:brightness-100" />
              <img src={orionTextWhite} alt="Orion" style={{ height: '29px', width: 'auto' }} className="brightness-0 dark:brightness-100" />
            </button>
          }
          right={
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '720px', flexShrink: 0 }}>
                <TickerSearch value={dashboardSearchQuery} onChange={setDashboardSearchQuery} onSelect={(sym) => navigate(`/trade?symbol=${sym}`)} placeholder="Search for stocks..." />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', flexShrink: 0 }}>
                <button aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} onClick={toggleDark} style={{ background: 'none', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: 'var(--header-icon-color)', flexShrink: 0 }}>
                  {dark ? <MdLightMode size={22} /> : <MdDarkMode size={22} />}
                </button>
                <WalletHeaderNavButton />
                <LedgerHeaderNavButton />
                <button aria-label="Profile" onClick={() => setProfileOpen(true)} style={{ background: 'none', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: 'var(--header-icon-color)', flexShrink: 0 }}>
                  <FaUserAlt size={21} />
                </button>
                <button aria-label="Logout" onClick={() => setLogoutOpen(true)} style={{ background: 'none', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: 'var(--header-icon-color)', flexShrink: 0 }}>
                  <MdLogout size={22} />
                </button>
              </div>
            </div>
          }
        />
      }
      movers={<BiggestMovers onSelect={(sym) => navigate(`/trade?symbol=${sym}`)} />}
      stats={<AccountStatsGrid />}
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
          
          {/* This single smart component replaces the entire rData map! */}
          <RecentActivityFeed onClick={() => navigate('/ledger')} />
          
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