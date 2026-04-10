import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
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

  const [loginHovered, setLoginHovered] = useState(false);

  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <DashboardGrid
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

          {/* LEFT SECTION: Title */}
          <div style={{ paddingLeft: '40px' }}>
            <h1 style={{ margin: 0, fontSize: '32px', color: 'white' }}>Orion Trading</h1>
          </div>

          {/* RIGHT SECTION: Search & Login */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ minWidth: 200, maxWidth: 300, width: '100%' }}>
              <TickerSearch
                value={dashboardSearchQuery}
                onChange={setDashboardSearchQuery}
                onSelect={(sym) => navigate(`/tickerview?symbol=${sym}`)}
                placeholder="Search..."
              />
            </div>
            <button
              onClick={() => navigate('/login')}
              onMouseEnter={() => setLoginHovered(true)}
              onMouseLeave={() => setLoginHovered(false)}
              style={{
                background: loginHovered ? 'rgba(255,255,255,0.15)' : 'transparent',
                border: '2px solid white',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 600,
                color: 'white',
                cursor: 'pointer',
                padding: '6px 16px',
                transition: 'background 0.15s',
              }}
            >
              Login
            </button>
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
