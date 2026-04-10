import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { MdLogin, MdDarkMode, MdLightMode } from 'react-icons/md';
import { useAuth } from '@/features/auth';
import { DashboardGrid } from '@/features/dashboard/layouts/DashboardGrid';
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
    <DashboardGrid
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

          {/* LEFT SECTION: Brand */}
          <div style={{ paddingLeft: '40px' }}>
            <button
              onClick={() => navigate('/')}
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

        </div>
      }
      movers={<BiggestMovers />}
      holdings={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <HoldingsTable holdings={filteredHoldings ?? emptyTable} publicOnly={true} />
        </div>
      }
    />
  );
};

export default LandingDashboard;
