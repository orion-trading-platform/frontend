import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { MdLogin, MdDarkMode, MdLightMode } from 'react-icons/md';
import { useAuth } from '@/features/auth';
import landingAsset1 from '@/assets/landing-asset-1.png';
import landingAsset2 from '@/assets/landing-asset-2.png';
import logoWhite from '@/assets/logo-white.svg';
import orionTextWhite from '@/assets/orion-text-white.svg';
import { LandingDashboardGrid } from './LandingDashboardGrid';
import { Header } from 'ui-kit';
import { SearchBar } from '@/features/dashboard/components/SearchBar';
import { HoldingsTable, Holding } from '@/features/dashboard/components/HoldingsTable';
import { TickerSearch } from '@/features/dashboard/components/TickerSearch';
import { BiggestMovers } from '@/features/dashboard/components/BiggestMovers';
import Papa, { ParseResult } from "papaparse"

// This page is where users initially land at 'oriontrading.pro'.
// A restricted mirror of the authenticated dashboard: visitors can browse S&P 500 data,
// search stocks, and navigate to the public ordering page. Auth-required actions redirect to /login.
const LandingDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const emptyTable: Holding[] = [];

  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardSearchQuery, setDashboardSearchQuery] = useState('');
  const [hData, sethData] = useState<Holding[]>([]);

  useEffect(() => {
    fetch('/src/features/dashboard/data/ds4_holdings.csv')
      .then((response) => response.text())
      .then((csvString) => {
        Papa.parse(csvString, {
          header: true,
          dynamicTyping: true,
          complete: (results: ParseResult<Holding>) => {
            sethData(results.data);
          },
        });
      })
      .catch((error) => console.error('Error fetching or parsing data:', error));
  }, []);

  const filteredHoldings = useMemo(() => {
    if (!searchQuery) return hData;
    const q = searchQuery.trim().toLowerCase();
    if (hData.length !== 0) {
      return hData.filter(
        (h) =>
          h.ticker.toLowerCase().includes(q) ||
          h.companyName.toLowerCase().includes(q)
      );
    }
  }, [searchQuery, hData]);

  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <LandingDashboardGrid
      header={
        <Header
          left={
            <button
              onClick={() => navigate('/')}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <img src={logoWhite} alt="" style={{ height: '47px', width: 'auto' }} />
              <img src={orionTextWhite} alt="Orion" style={{ height: '29px', width: 'auto' }} />
            </button>
          }
          right={
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '240px', flexShrink: 0 }}>
                <TickerSearch
                  value={dashboardSearchQuery}
                  onChange={setDashboardSearchQuery}
                  onSelect={(sym) => navigate(`/tickerview?symbol=${sym}`)}
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
                  onClick={() => navigate('/login')}
                  aria-label="Login"
                  style={{ background: 'none', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: 'white', flexShrink: 0 }}
                >
                  <MdLogin size={22} />
                </button>
              </div>
            </div>
          }
        />
      }
      movers={<BiggestMovers />}
      holdings={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <div className="flex-1 min-h-0 overflow-y-auto">
            <HoldingsTable holdings={filteredHoldings ?? emptyTable} publicOnly={true} />
          </div>
        </div>
      }
      assetTop={
        <div className="w-full h-full overflow-hidden rounded-3xl border-2 border-[#26262C] bg-[#26262C] transition-transform duration-300 hover:scale-[1.01] motion-safe:animate-[fadeIn_0.6s_ease_both]">
          <img src={landingAsset1} alt="" className="w-full h-full object-cover object-center block" />
        </div>
      }
      assetBottom={
        <div className="w-full h-full overflow-hidden rounded-3xl border-2 border-[#26262C] bg-[#26262C] transition-transform duration-300 hover:scale-[1.01] motion-safe:animate-[fadeIn_0.6s_ease_both]">
          <img src={landingAsset2} alt="" className="w-full h-full object-cover object-center block" />
        </div>
      }
    />
  );
};

export default LandingDashboard;
