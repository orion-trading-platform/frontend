import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MdLogout, MdDarkMode, MdLightMode } from "react-icons/md";
import { TickerSearch } from "@/features/dashboard/components/TickerSearch";
import { OrderBook } from "./components/OrderBook";
import { OrderPanel } from "./components/OrderPanel";
import { StockChart } from "./components/StockChart";
import { getAccountBalance } from "./api/user";
import { getStockSnapshot } from "./api/stocks";
import { subscribeToStream } from "./api/stream";
import type { OrderResponse } from "./api/orders";
import { useAuth } from "../auth";
import ProfileModal from "../auth/ProfileModal";

interface Snapshot {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: string;
  marketCap: string;
  marketStatus: string;
  lastUpdated: string;
}

export function OrderingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSymbol = searchParams.get('symbol') ?? 'AAPL';
  const { currentUser, logout } = useAuth();
  const [dark, setDark] = useState<boolean>(false);
  const [symbol, setSymbol] = useState(initialSymbol);
  const [tickerQuery, setTickerQuery] = useState(initialSymbol);
  const [profileOpen, setProfileOpen] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  // Fetch balance once on mount
  useEffect(() => {
    getAccountBalance().then((data) => setBalance(data.balance));
  }, []);

  // Fetch snapshot whenever symbol changes
  useEffect(() => {
    setSnapshot(null);
    getStockSnapshot(symbol).then((data) => {
      setSnapshot(data);
      setCurrentPrice(data.price);
    });
  }, [symbol]);

  const handleOrderPlaced = (result: OrderResponse) => {
    setBalance((prev) =>
      parseFloat(
        (result.side === "BUY" ? prev - result.totalAmount : prev + result.totalAmount).toFixed(2)
      )
    );
  };

  // Subscribe to live price updates via SSE
  useEffect(() => {
    const unsubscribe = subscribeToStream([symbol], (update) => {
      setCurrentPrice(update.price);
    });
    return unsubscribe;
  }, [symbol]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  if (!snapshot) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const isPositive = snapshot.change >= 0;

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
      <header style={{ background: 'rgb(94, 111, 161)', padding: '15px', fontFamily: '"IBM Plex Serif", serif', display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

          {/* LEFT: Brand */}
          <div style={{ paddingLeft: '25px' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'white', fontSize: '22px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: '"Noto Sans", Roboto, sans-serif' }}
            >
              ORION
            </button>
          </div>

          {/* RIGHT: Search + Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '240px', flexShrink: 0 }}>
              <TickerSearch value={tickerQuery} onChange={setTickerQuery} onSelect={(sym) => { setSymbol(sym); setTickerQuery(sym); }} placeholder="Search..." />
            </div>
            <div style={{ width: '140px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
              <button aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} onClick={() => setDark(!dark)} style={{ background: 'none', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: 'white', flexShrink: 0 }}>
                {dark ? <MdLightMode size={22} /> : <MdDarkMode size={22} />}
              </button>
              <button aria-label="Profile" onClick={() => setProfileOpen(true)} style={{ background: 'none', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, overflow: 'hidden', flexShrink: 0 }}>
                {currentUser?.profile_picture_url ? (
                  <img src={currentUser.profile_picture_url} alt="Profile" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>👤</div>
                )}
              </button>
              <button aria-label="Logout" onClick={() => logout().then(() => navigate('/'))} style={{ background: 'none', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, color: 'white', flexShrink: 0 }}>
                <MdLogout size={22} />
              </button>
            </div>
          </div>

        </div>
      </header>

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
            <StatItem label="Mkt Cap" value={snapshot.marketCap} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <StockChart symbol={symbol} />
            <OrderBook symbol={symbol} />
          </div>
          <div className="col-span-1">
            <OrderPanel symbol={symbol} currentPrice={currentPrice} buyingPower={balance} onOrderPlaced={handleOrderPlaced} />
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
