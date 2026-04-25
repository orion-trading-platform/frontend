import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { MdLogout, MdDarkMode, MdLightMode } from 'react-icons/md';
import { FaUserAlt } from 'react-icons/fa';
import { useAccount } from '@/features/auth';
import { WalletHeaderNavButton } from '@/features/wallet/components/WalletHeaderNavButton';
import { LedgerHeaderNavButton } from '../ledger/LedgerHeaderNavButon';
import { accountBalanceToNumber, formatUsdCash } from '@/features/wallet/utils/accountCash';
import ProfileModal from '../auth/modals/ProfileModal';
import LogoutConfirmationModal from '../auth/modals/LogoutConfirmationModal';
import { DashboardGrid } from './layouts/DashboardGrid';
import { Header } from 'ui-kit';
import { StatCard } from './components/StatCard';
import { RecentActivity, RecentActivityProps } from './components/RecentActivity';
import { PerformanceChart } from './components/PerformanceChart';
import { SearchBar } from './components/SearchBar';
import { HoldingsTable, HoldingsTableProps, Holding} from './components/HoldingsTable';
import { TickerSearch } from './components/TickerSearch';
import { BiggestMovers } from './components/BiggestMovers';
import { MOCK_STATS, MOCK_HOLDINGS, MOCK_ACTIVITY } from './data/mockData';
import Papa, { ParseResult } from "papaparse"
import logoWhite from '@/assets/logo-white.svg';
import orionTextWhite from '@/assets/orion-text-white.svg';


export const DashboardPage = () => {
  const navigate = useNavigate();
  const { dark, toggleDark } = useTheme();
  const { account, isLoading: accountsLoading } = useAccount();
  var emptyTable: Holding[] = [];
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardSearchQuery, setDashboardSearchQuery] = useState('');
  const [rData, setrData] = useState<RecentActivityProps[]>([]);
  const [hData, sethData] = useState<Holding[]>([]);

  useEffect(() => {
    fetch('/data/ds5_recent_actions.csv')
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
    fetch('/data/ds4_holdings.csv')
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
  }, []);


  const filteredHoldings = useMemo(() => {
    if (!searchQuery) return hData;
    const q = searchQuery.trim().toLowerCase();
    if (hData.length != 0){
      console.log(hData)
      return hData.filter(
        (h) =>
          h.ticker.toLowerCase().includes(q) ||
          h.companyName.toLowerCase().includes(q)
      );}

  }, [searchQuery, hData]);

  const cashInWalletDisplay = useMemo(() => {
    if (accountsLoading && !account) return '…';
    const n = account ? accountBalanceToNumber(account.balance) : 0;
    return formatUsdCash(n, account?.currency ?? 'USD');
  }, [account, accountsLoading]);


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
              <div style={{ width: '240px', flexShrink: 0 }}>
                <TickerSearch
                  value={dashboardSearchQuery}
                  onChange={setDashboardSearchQuery}
                  onSelect={(sym) => navigate(`/trade?symbol=${sym}`)}
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
                <WalletHeaderNavButton />
                <LedgerHeaderNavButton />
                <button
                  aria-label="Profile"
                  onClick={() => setProfileOpen(true)}
                  style={{ background: 'none', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: 'var(--header-icon-color)', flexShrink: 0 }}
                >
                  <FaUserAlt size={21} />
                </button>
                <button
                  aria-label="Logout"
                  onClick={() => setLogoutOpen(true)}
                  style={{ background: 'none', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: 'var(--header-icon-color)', flexShrink: 0 }}
                >
                  <MdLogout size={22} />
                </button>
              </div>
            </div>
          }
        />
      }
      movers={<BiggestMovers onSelect={(sym) => navigate(`/trade?symbol=${sym}`)} />}
      stats={
        <>
          {MOCK_STATS.map((stat) =>
            stat.label === 'Cash in Wallet' ? (
              <StatCard key={stat.label} {...stat} value={cashInWalletDisplay} hideChange />
            ) : (
              <StatCard key={stat.label} {...stat} />
            )
          )}
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