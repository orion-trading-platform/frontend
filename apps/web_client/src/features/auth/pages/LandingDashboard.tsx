import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/ThemeContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { MdLogin, MdDarkMode, MdLightMode } from 'react-icons/md';
import { useAuth } from '@/features/auth';
import landingTopTitle from '@/assets/landing-top-title.svg';
import landingTopAccent from '@/assets/landing-top-accent.svg';
import landingTopResponsive from '@/assets/landing-top-responsive.svg';
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
  const [assetTopLoaded, setAssetTopLoaded] = useState(0);
  const assetTopReady = assetTopLoaded >= 3;

  // Prevent shimmer persistence if images are already cached
  useEffect(() => {
    [landingTopAccent, landingTopResponsive, landingTopTitle].forEach(src => {
      const img = new Image();
      let counted = false;
      const increment = () => {
        if (counted) return;
        counted = true;
        setAssetTopLoaded(n => n + 1);
      };
      img.onload = increment;
      img.onerror = increment;
      img.src = src;
      if (img.complete) increment();
    });
  }, []);

  useEffect(() => {
    fetch('/data/ds4_holdings.csv')
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
              aria-label="Orion home"
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
              : '#F8FAFC',
            borderColor: dark ? 'rgba(91,106,212,0.35)' : 'rgba(91,106,212,0.22)',
          }}
        >
          {/* LOADING SHIMMER — animate-pulse only while loading; removing it lets opacity-0 take effect */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 z-20 rounded-3xl pointer-events-none transition-opacity duration-700 ${assetTopReady ? 'opacity-0' : 'opacity-100 animate-pulse'}`}
            style={{
              background: dark
                ? 'radial-gradient(ellipse 65% 55% at 18% 28%, rgba(139,92,246,0.30) 0%, transparent 70%), radial-gradient(ellipse 50% 65% at 82% 78%, rgba(59,130,246,0.22) 0%, transparent 70%), #0D0D14'
                : 'linear-gradient(135deg, #eef0f8 25%, #f4f5fb 50%, #eef0f8 75%)',
            }}
          />
          <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
            <filter id="lp-top-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
              <feColorMatrix type="saturate" values="0"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#lp-top-noise)"/>
          </svg>
          <img decoding="async" src={landingTopAccent} alt="" className="w-full h-full object-cover object-center block transition-transform duration-300 group-hover:scale-[1.005]" onLoad={() => setAssetTopLoaded(n => n + 1)} />
          <img decoding="async" src={landingTopResponsive} alt="" className="absolute inset-0 w-full h-full object-cover object-center block brightness-0 dark:brightness-100 transition-transform duration-300 group-hover:scale-[1.005]" onLoad={() => setAssetTopLoaded(n => n + 1)} />
          <img decoding="async" src={landingTopTitle} alt="" className="absolute inset-0 w-full h-full object-cover object-center block transition-transform duration-300 group-hover:scale-[1.02]" onLoad={() => setAssetTopLoaded(n => n + 1)} />
          <button
            onClick={() => navigate('/login')}
            className="absolute left-1/2 -translate-x-1/2 top-[64.5%] z-10 rounded-lg border px-6 py-3 text-sm font-semibold tracking-widest transition duration-300 group-hover:scale-[1.03]"
            style={{ color: '#5B6AD4', borderColor: 'rgba(91,106,212,0.55)', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(91,106,212,0.10)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            Begin your journey
          </button>
        </div>
      }
      assetBottom={
        <div
          className="relative isolate w-full h-full overflow-hidden rounded-3xl border-2 transition-transform duration-300 motion-safe:animate-[fadeIn_0.6s_ease_both]"
          style={{
            borderColor: dark ? 'rgba(91,106,212,0.35)' : 'rgba(91,106,212,0.22)',
            backgroundColor: dark ? '#0d0d14' : '#F8FAFC',
          }}
        >
          {/* GRID */}
          <div
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              backgroundImage: dark
                ? 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)'
                : 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          {/* VIGNETTE FADE */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: dark ? [
                'linear-gradient(to right, #0d0d14 0%, transparent 12%, transparent 88%, #0d0d14 100%)',
                'linear-gradient(to bottom, #0d0d14 0%, transparent 10%, transparent 90%, #0d0d14 100%)',
              ].join(', ') : [
                'linear-gradient(to right, #F8FAFC 0%, transparent 12%, transparent 88%, #F8FAFC 100%)',
                'linear-gradient(to bottom, #F8FAFC 0%, transparent 10%, transparent 90%, #F8FAFC 100%)',
              ].join(', '),
            }}
          />

          <div className="relative z-10 flex h-full px-8 py-5 justify-between">
            {/* SERIF HERO TEXT */}
            <div className="flex flex-col justify-center w-[62%] min-w-0">
              <h2
                className="font-display font-bold tracking-tight"
                style={{ color: dark ? '#ffffff' : '#0d0d14', fontSize: 'clamp(1.8rem, 4vw, 6.25rem)', lineHeight: 1.05, marginBottom: 'clamp(0.5rem, 0.625vw, 1rem)' }}
              >
                The Most<br />
                <span style={{ fontStyle: 'italic', color: '#7C8FF5' }}>Transparent</span><br />
                Exchange
              </h2>
              <p
                className="font-sans leading-relaxed"
                style={{ color: dark ? 'rgba(255,255,255,0.70)' : 'rgba(13,13,20,0.70)', fontSize: 'clamp(0.6rem, 0.85vw, 1.25rem)' }}
              >
                Every transaction, fee, and decision,<br />
                Completely in the open.<br />
                Trade with full confidence.
              </p>
            </div>
            {/* FEATURE CARDS */}
            <div className="flex flex-col w-[35%] flex-shrink-0 gap-8">
              {[
                {
                  title: 'Real-time market data',
                  desc: 'Live order books and price feeds with sub-millisecond latency across all pairs.',
                  icon: (
                    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: 'clamp(0.8rem, 0.92vw, 1.47rem)', height: 'clamp(0.8rem, 0.92vw, 1.47rem)' }}>
                      <circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 7v5l3 3" />
                    </svg>
                  ),
                },
                {
                  title: 'Security protected',
                  desc: 'OWASP security compliance, account safety email alerts, and worry-free asset protection.',
                  icon: (
                    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: 'clamp(0.8rem, 0.92vw, 1.47rem)', height: 'clamp(0.8rem, 0.92vw, 1.47rem)' }}>
                      <path strokeLinejoin="round" d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                    </svg>
                  ),
                },
                {
                  title: 'Advanced analytics',
                  desc: 'Professional charting tools, portfolio insights, and tax reporting built in.',
                  icon: (
                    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: 'clamp(0.8rem, 0.92vw, 1.47rem)', height: 'clamp(0.8rem, 0.92vw, 1.47rem)' }}>
                      <path strokeLinecap="round" d="M4 20h16M7 20V13M12 20V8M17 20v-5" />
                    </svg>
                  ),
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center rounded-xl px-3 flex-1 min-h-0"
                  style={{
                    gap: 'clamp(0.25rem, 0.417vw, 0.67rem)',
                    backgroundColor: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
                  }}
                >
                  <div
                    className="rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      width: 'clamp(1.3rem, 1.67vw, 2.67rem)',
                      height: 'clamp(1.3rem, 1.67vw, 2.67rem)',
                      backgroundColor: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
                      color: dark ? 'rgba(255,255,255,0.60)' : 'rgba(13,13,20,0.60)',
                    }}
                  >
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p
                      className="font-sans font-medium mb-0.5"
                      style={{ color: dark ? '#ffffff' : '#0d0d14', fontSize: 'clamp(0.6rem, 0.83vw, 1.33rem)' }}
                    >
                      {item.title}
                    </p>
                    <p
                      className="font-sans leading-relaxed"
                      style={{ color: dark ? 'rgba(255,255,255,0.65)' : 'rgba(13,13,20,0.65)', fontSize: 'clamp(0.5rem, 0.625vw, 1rem)' }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    />
    </>
  );
};

export default LandingDashboard;
