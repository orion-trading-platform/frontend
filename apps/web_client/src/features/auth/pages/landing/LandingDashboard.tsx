import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/ThemeContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { MdLogin, MdDarkMode, MdLightMode } from 'react-icons/md';
import { useAuth } from '@/features/auth';
import landingCtaTitle from '@/assets/landing-cta-title.svg';
import landingCtaAccent from '@/assets/landing-cta-accent.svg';
import landingCtaResponsive from '@/assets/landing-cta-responsive.svg';
import logoWhite from '@/assets/logo-white.svg';
import orionTextWhite from '@/assets/orion-text-white.svg';
import { LandingDashboardGrid } from './LandingDashboardGrid';
import { Header } from 'ui-kit';
import { LandingSearchBar } from './LandingSearchBar';
import { LandingHoldingsTable } from './LandingHoldingsTable';
import { LandingTickerSearch } from './LandingTickerSearch';
import { LandingBiggestMovers } from './LandingBiggestMovers';
import { fetchSP500Holdings, type Holding } from './api/landingDashboardApi';

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
  const [ctaPanelLoaded, setAssetTopLoaded] = useState(0);
  const ctaPanelReady = ctaPanelLoaded >= 3;

  // Prevent shimmer persistence if images are already cached
  useEffect(() => {
    [landingCtaAccent, landingCtaResponsive, landingCtaTitle].forEach(src => {
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
    fetchSP500Holdings()
      .then(sethData)
      .catch(err => console.error('Failed to load S&P 500:', err));
  }, []);

  const filteredHoldings = useMemo(() => {
    if (!searchQuery) return hData;
    const q = searchQuery.trim().toLowerCase();
    return hData.filter(h => h.ticker.toLowerCase().includes(q));
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
            <div className="max-w-[84rem] mx-auto w-full px-4 sm:px-6 lg:px-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => navigate('/')}
                aria-label="Orion home"
                className="p-0 pr-3 md:pr-0"
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <img src={logoWhite} alt="" style={{ height: '47px', width: 'auto' }} className="brightness-0 dark:brightness-100" />
                <img src={orionTextWhite} alt="Orion" style={{ height: '29px', width: 'auto' }} className="brightness-0 dark:brightness-100 hidden md:block" />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0px, 1.5vw, 9px)', flexShrink: 1, minWidth: 0 }}>
                <div style={{ flex: '1 1 240px', maxWidth: '240px', minWidth: '58px' }}>
                  <LandingTickerSearch
                    value={dashboardSearchQuery}
                    onChange={setDashboardSearchQuery}
                    onSelect={(sym) => navigate(`/tickerview?symbol=${sym}`)}
                    placeholder="Search for stocks..."
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', flexShrink: 0 }}>
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
            </div>
          }
        />
      }
      movers={<LandingBiggestMovers onSelect={(sym) => navigate(`/tickerview?symbol=${sym}`)} />}
      holdings={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: 'calc(100% - 44px)' }}>
          <LandingSearchBar value={searchQuery} onChange={setSearchQuery} />
          <div className="flex-1 min-h-0 overflow-y-auto [@media(max-height:940px)]:max-h-[240px]" tabIndex={-1}>
            <LandingHoldingsTable holdings={filteredHoldings ?? emptyTable} publicOnly={true} onSelect={(sym) => navigate(`/tickerview?symbol=${sym}`)} />
          </div>
        </div>
      }
      marketingPanel={
        <div
          className="group relative isolate w-full h-full overflow-hidden rounded-3xl border-2 transition-transform duration-300 motion-safe:animate-[fadeIn_0.6s_ease_both]"
          style={{
            background: dark
              ? 'radial-gradient(ellipse 65% 55% at 18% 28%, rgba(139,92,246,0.22) 0%, transparent 70%), radial-gradient(ellipse 50% 65% at 82% 78%, rgba(59,130,246,0.16) 0%, transparent 70%), radial-gradient(ellipse 55% 45% at 68% 8%, rgba(168,85,247,0.14) 0%, transparent 70%), #0D0D14'
              : '#F8FAFC',
            borderColor: dark ? 'rgba(91,106,212,0.35)' : 'rgba(91,106,212,0.22)',
          }}
        >
          {/* LOADING SHIMMER */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 z-20 rounded-3xl pointer-events-none transition-opacity duration-700 ${ctaPanelReady ? 'opacity-0' : 'opacity-100 animate-pulse'}`}
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
          <img decoding="async" src={landingCtaAccent} alt="" className="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-[1.005]" style={{ objectPosition: '90% 30%' }} onLoad={() => setAssetTopLoaded(n => n + 1)} />
          <img decoding="async" src={landingCtaResponsive} alt="" className="absolute inset-0 w-full h-full object-cover block brightness-0 dark:brightness-100 transition-transform duration-300 group-hover:scale-[1.005]" style={{ objectPosition: '90% 30%' }} onLoad={() => setAssetTopLoaded(n => n + 1)} />
          <img decoding="async" src={landingCtaTitle} alt="" className="absolute inset-0 w-full h-full object-contain block transition-transform duration-300 group-hover:scale-[1.02]" style={{ objectPosition: '50% 30%' }} onLoad={() => setAssetTopLoaded(n => n + 1)} />
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
      heroText={
        <div
          className="relative isolate w-full h-full overflow-hidden motion-safe:animate-[fadeIn_0.6s_ease_both]"
          style={{
            backgroundColor: dark ? '#0d0d14' : '#F8FAFC',
          }}
        >
          <div className="relative z-10 flex h-full items-center px-0 py-5">
            {/* SERIF HERO TEXT */}
            <div className="flex flex-col justify-center w-full min-w-0">
              <h2
                className="font-display font-bold tracking-tight"
                style={{ color: dark ? '#ffffff' : '#0d0d14', fontSize: 'clamp(1.8rem, 4vw, 4.5rem)', lineHeight: 1.05, marginBottom: 'clamp(0.5rem, 0.625vw, 1rem)' }}
              >
                The Most<br />
                <span style={{ fontStyle: 'italic', color: '#7C8FF5' }}>Transparent</span><br />
                Exchange
              </h2>
              <p
                className="font-sans leading-relaxed"
                style={{ color: dark ? 'rgba(255,255,255,0.70)' : 'rgba(13,13,20,0.70)', fontSize: 'clamp(0.8rem, 0.85vw, 1.25rem)' }}
              >
                Every transaction, fee, and decision—<br />
                Completely in the open.<br />
                Trade with full confidence.
              </p>
            </div>
          </div>
        </div>
      }
    />
    </>
  );
};

export default LandingDashboard;
