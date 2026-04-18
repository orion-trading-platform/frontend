import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/ThemeContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { MdLogin, MdDarkMode, MdLightMode } from 'react-icons/md';
import { useAuth } from '@/features/auth';
import landingTopTitle from '@/assets/landing-top-title.svg';
import landingTopAccent from '@/assets/landing-top-accent.svg';
import landingTopResponsive from '@/assets/landing-top-responsive.svg';
import landingBottomAsset from '@/assets/landing-bottom-asset.png';
import logoWhite from '@/assets/logo-white.svg';
import orionTextWhite from '@/assets/orion-text-white.svg';
import { LandingDashboardGrid } from './LandingDashboardGrid';
import { Header } from 'ui-kit';
import { SearchBar } from '@/features/dashboard/components/SearchBar';
import { HoldingsTable, Holding } from '@/features/dashboard/components/HoldingsTable';
import { TickerSearch } from '@/features/dashboard/components/TickerSearch';
import { BiggestMovers } from '@/features/dashboard/components/BiggestMovers';
import Papa, { ParseResult } from "papaparse"

/* 
 * This page is where users initially land at 'oriontrading.pro'.
 * A restricted mirror of the real dashboard so visitors can view the
 * market and specific stocks. Auth-required actions redirect to /login.
 */
const LandingDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const { dark, toggleDark } = useTheme();
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

  // Redirect if user logged in but accessed this route instead of /dashboard
  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <>
    <LandingDashboardGrid
      header={
        <Header
          left={
            <button
              onClick={() => navigate('/')}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <img src={logoWhite} alt="" style={{ height: '47px', width: 'auto' }} className="brightness-0 dark:brightness-100" />
              <img src={orionTextWhite} alt="Orion" style={{ height: '29px', width: 'auto' }} className="brightness-0 dark:brightness-100" />
            </button>
          }
          right={
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '240px', flexShrink: 0 }}>
                <TickerSearch
                  value={dashboardSearchQuery}
                  onChange={setDashboardSearchQuery}
                  onSelect={(sym) => navigate(`/tickerview?symbol=${sym}`)}
                  placeholder="Search for stocks..."
                />
              </div>
              <div style={{ width: '140px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                  onClick={toggleDark}
                  style={{ background: 'none', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: 'var(--header-icon-color)', flexShrink: 0 }}
                >
                  {dark ? <MdLightMode size={22} /> : <MdDarkMode size={22} />}
                </button>
                <button
                  onClick={() => navigate('/login')}
                  aria-label="Login"
                  style={{ background: 'none', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: 'var(--header-icon-color)', flexShrink: 0 }}
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
        <div
          className="group relative isolate w-full h-full overflow-hidden rounded-3xl border-2 transition-transform duration-300 motion-safe:animate-[fadeIn_0.6s_ease_both]"
          style={{
            background: dark
              ? 'radial-gradient(ellipse 65% 55% at 18% 28%, rgba(139,92,246,0.22) 0%, transparent 70%), radial-gradient(ellipse 50% 65% at 82% 78%, rgba(59,130,246,0.16) 0%, transparent 70%), radial-gradient(ellipse 55% 45% at 68% 8%, rgba(168,85,247,0.14) 0%, transparent 70%), #0D0D14'
              : 'radial-gradient(ellipse 65% 55% at 18% 28%, rgba(139,92,246,0.10) 0%, transparent 70%), radial-gradient(ellipse 50% 65% at 82% 78%, rgba(59,130,246,0.08) 0%, transparent 70%), radial-gradient(ellipse 55% 45% at 68% 8%, rgba(168,85,247,0.06) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 45% 60%, rgba(20,15,55,0.13) 0%, transparent 65%), radial-gradient(ellipse 35% 40% at 70% 30%, rgba(15,10,45,0.09) 0%, transparent 55%), #F8FAFC',
            borderColor: dark ? 'rgba(91,106,212,0.35)' : 'rgba(91,106,212,0.22)',
          }}
        >
          <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
            <filter id="lp-top-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
              <feColorMatrix type="saturate" values="0"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#lp-top-noise)"/>
          </svg>
          <img src={landingTopAccent} alt="" className="w-full h-full object-cover object-center block" />
          <img src={landingTopResponsive} alt="" className="absolute inset-0 w-full h-full object-cover object-center block brightness-0 dark:brightness-100" />
          <img src={landingTopTitle} alt="" className="absolute inset-0 w-full h-full object-cover object-center block transition-transform duration-300 group-hover:scale-[1.01]" />
          <button
            onClick={() => navigate('/login')}
            className="absolute left-1/2 -translate-x-1/2 top-[64%] z-10 rounded-lg border px-6 py-3 text-sm font-semibold tracking-widest transition duration-300 group-hover:scale-[1.03]"
            style={{ color: '#5B6AD4', borderColor: 'rgba(91,106,212,0.55)', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(91,106,212,0.10)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            Begin your journey
          </button>
        </div>
      }
      assetBottom={
        <div className="relative isolate w-full h-full overflow-hidden rounded-3xl border-2 transition-transform duration-300 motion-safe:animate-[fadeIn_0.6s_ease_both]"
          style={{
            borderColor: dark ? 'rgba(91,106,212,0.35)' : 'rgba(91,106,212,0.22)',
            backgroundColor: dark ? 'rgba(91,106,212,0.35)' : 'rgba(91,106,212,0.22)',
          }}>
          <img src={landingBottomAsset} alt="" className="w-full h-full object-cover object-center block brightness-[0.80] contrast-[1.25] saturate-[1.4]" />
        </div>
      }
    />
    </>
  );
};

export default LandingDashboard;
