import { useEffect, useState } from "react";
import { useTheme } from '@/ThemeContext';
import { useNavigate, useSearchParams } from "react-router-dom";
import { MdLogout, MdDarkMode, MdLightMode } from "react-icons/md";
import { WalletHeaderNavButton } from "@/features/wallet/components/WalletHeaderNavButton";
import { TickerSearch } from "@/features/dashboard/components/TickerSearch";
import { OrderBook } from "./components/OrderBook";
import { OrderPanel } from "./components/OrderPanel";
import { StockChart } from "./components/StockChart";
import { getStockSnapshot } from "./api/stocks";
import { subscribeToStream } from "./api/stream";
import type { OrderResponse } from "./api/orders";
import { useAuth, useAccount } from "../auth";
import logoWhite from '@/assets/logo-white.svg';
import orionTextWhite from '@/assets/orion-text-white.svg';
import { Header } from 'ui-kit';
import ProfileModal from "../auth/modals/ProfileModal";
import LogoutConfirmationModal from "../auth/modals/LogoutConfirmationModal";

interface Snapshot {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: string;
  marketStatus: string;
  lastUpdated: string;
}

export function OrderingPage() {
  const navigate = useNavigate();
  // keeping apple as default for now. Should definitely have a real default/error. snapshoterror handles for now.
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSymbol = searchParams.get("symbol") ?? "AAPL";
  const { currentUser } = useAuth();
  const { account } = useAccount();
  const balance = account ? parseFloat(account.balance) : 0;
  const { dark, toggleDark } = useTheme();
  const [symbol, setSymbol] = useState(initialSymbol);
  const [tickerQuery, setTickerQuery] = useState(initialSymbol);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [snapshotError, setSnapshotError] = useState<string | null>(null);

  // update symbol. balance is a part of account.
  useEffect(() => {
    setSymbol(initialSymbol);
    setTickerQuery(initialSymbol);
  }, [initialSymbol]);

  // Fetch snapshot whenever symbol changes
  useEffect(() => {
    setSnapshot(null);
    setSnapshotError(null);
    getStockSnapshot(symbol)
      .then((data) => {
        setSnapshot(data);
        setCurrentPrice(data.price);
      })
      .catch((err: unknown) => {
        setSnapshotError(err instanceof Error ? err.message : "Unknown error");
      });
  }, [symbol]);

  const handleOrderPlaced = (_result: OrderResponse) => {
    // balance is now driven by useAccount — no manual update needed
  };

  // Subscribe to live price updates via SSE
  useEffect(() => {
    const unsubscribe = subscribeToStream([symbol], (update) => {
      setCurrentPrice(update.price);
    });
    return unsubscribe;
  }, [symbol]);

  // error handling. could possibly be due to bad symbol.
  if (snapshotError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#f8f9fa] px-6">
        <div className="max-w-md text-center text-sm text-gray-500">{snapshotError}</div>
      </div>
    );
  }

  if (!snapshot) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] dark:bg-[#0D0D14]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const isPositive = snapshot.change >= 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0D0D14]">
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <LogoutConfirmationModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
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
                value={tickerQuery}
                onChange={setTickerQuery}
                onSelect={(sym) => {
                  setTickerQuery(sym);
                  setSymbol(sym);
                  // update url with new symbol
                  setSearchParams((prev) => {
                    const params = new URLSearchParams(prev);
                    params.set("symbol", sym);
                    return params;
                  });
                }}
                placeholder="Search for stocks..."
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', flexShrink: 0 }}>
              <button aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} onClick={toggleDark} style={{ background: 'none', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: 'var(--header-icon-color)', flexShrink: 0 }}>
                {dark ? <MdLightMode size={22} /> : <MdDarkMode size={22} />}
              </button>
              <WalletHeaderNavButton />
              <button aria-label="Profile" onClick={() => setProfileOpen(true)} style={{ background: 'none', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, overflow: 'hidden', flexShrink: 0 }}>
                {currentUser?.profile_picture_url ? (
                  <img src={currentUser.profile_picture_url} alt="Profile" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>👤</div>
                )}
              </button>
              <button aria-label="Logout" onClick={() => setLogoutOpen(true)} style={{ background: 'none', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: 'var(--header-icon-color)', flexShrink: 0 }}>
                <MdLogout size={22} />
              </button>
            </div>
          </div>
        }
      />

      <main className="mx-auto max-w-7xl p-6">
        <button
          onClick={() => navigate('/dashboard')}
          style={{ background: 'none', border: 'none', color: '#4b5563', fontSize: '14px', cursor: 'pointer', padding: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          ← Return to home
        </button>
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Cash in Wallet</div>
              <div className="text-2xl font-bold">
                ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h2 className="text-2xl font-bold">{snapshot.symbol}</h2>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">${currentPrice.toFixed(2)}</span>
                <span className={`text-lg font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
                  {isPositive ? "+" : ""}${snapshot.change.toFixed(2)} ({isPositive ? "+" : ""}{snapshot.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>{snapshot.marketStatus}</div>
              <div>{snapshot.lastUpdated}</div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4 border-t border-gray-200 pt-4">
            <StatItem label="Open" value={`$${snapshot.open.toFixed(2)}`} />
            <StatItem label="High" value={`$${snapshot.high.toFixed(2)}`} />
            <StatItem label="Low" value={`$${snapshot.low.toFixed(2)}`} />
            <StatItem label="Volume" value={snapshot.volume} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <StockChart symbol={symbol} />
            <OrderBook symbol={symbol} />
          </div>
          <div className="col-span-1">
            <OrderPanel
              symbol={symbol}
              currentPrice={currentPrice}
              buyingPower={balance}
              userId={currentUser?.user_id?.toString() ?? ""}
              accountId={account?.account_id?.toString() ?? ""}
              onOrderPlaced={handleOrderPlaced}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
