import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link, Navigate } from "react-router-dom";
import { MdLogin, MdDarkMode, MdLightMode } from 'react-icons/md';
import { useAuth } from '@/features/auth';
import logoWhite from '@/assets/logo-white.svg';
import orionTextWhite from '@/assets/orion-text-white.svg';
import { Header } from 'ui-kit';
import { OrderBook } from "@/features/ordering/components/OrderBook";
import { StockChart } from "@/features/ordering/components/StockChart";
import { getStockSnapshot } from "@/features/ordering/api/stocks";
import { subscribeToStream } from "@/features/ordering/api/stream";
import { TickerSearch } from "@/features/dashboard/components/TickerSearch";

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

export function LandingOrdering() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const initialSymbol = searchParams.get('symbol') ?? 'AAPL'; //NOTE(An): presuming placeholder
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  const [symbol, setSymbol] = useState(initialSymbol);
  const [tickerQuery, setTickerQuery] = useState(initialSymbol);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  useEffect(() => {
    setSnapshot(null);
    getStockSnapshot(symbol).then((data) => {
      setSnapshot(data);
      setCurrentPrice(data.price);
    });
  }, [symbol]);

  useEffect(() => {
    const unsubscribe = subscribeToStream([symbol], (update) => {
      setCurrentPrice(update.price);
    });
    return unsubscribe;
  }, [symbol]);

  const isPositive = snapshot ? snapshot.change >= 0 : true;

  if (isLoading) return null;
  if (isAuthenticated) {
    if (symbol != null && symbol != "") {
      return <Navigate to={`/trade?symbol=${symbol}`} replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0D0D14]">
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
                value={tickerQuery}
                onChange={setTickerQuery}
                onSelect={(sym) => setSymbol(sym)}
                placeholder="Search stocks..."
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

      <main className="mx-auto max-w-7xl p-6">
        <Link
          to="/"
          aria-label="Return to home"
          style={{
            color: '#4b5563',
            fontSize: '14px',
            textDecoration: 'none',
            display: 'inline-block',
            paddingBottom: '16px',
          }}
        >
          ← Return to home
        </Link>
        {snapshot ? (
          <>
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

              <dl className="grid grid-cols-5 gap-4 border-t border-gray-200 pt-4">
                <StatItem label="Open" value={`$${snapshot.open.toFixed(2)}`} />
                <StatItem label="High" value={`$${snapshot.high.toFixed(2)}`} />
                <StatItem label="Low" value={`$${snapshot.low.toFixed(2)}`} />
                <StatItem label="Volume" value={snapshot.volume} />
                <StatItem label="Mkt Cap" value={snapshot.marketCap} />
              </dl>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <StockChart symbol={symbol} />
                <OrderBook symbol={symbol} />
              </div>
              <div className="col-span-1">
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="mb-4 text-lg font-bold">Trade {symbol}</h3>
                  <p className="mb-6 text-sm text-gray-600">
                    Sign in to place buy and sell orders.
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full rounded-lg bg-[#5B6AD4] px-4 py-3 font-medium text-white hover:bg-[#4e5cbd] active:bg-[#434fb3] transition-colors"
                  >
                    Log in to Trade
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div role="status" aria-label="Loading stock data" className="flex min-h-[400px] items-center justify-center">
            <span className="text-gray-500">Loading...</span>
          </div>
        )}
      </main>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
