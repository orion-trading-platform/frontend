import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link, Navigate } from "react-router-dom";
import { useAuth } from '@/features/auth';
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
  const [symbol, setSymbol] = useState(initialSymbol);
  const [loginHovered, setLoginHovered] = useState(false);
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
    <div className="min-h-screen bg-[#f8f9fa]">
      <header style={{ background: 'rgb(94, 111, 161)', padding: '15px', fontFamily: '"IBM Plex Serif", serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ paddingLeft: '25px' }}>
            <h1 style={{ margin: 0, fontSize: '32px', color: 'white' }}>Orion Trading</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ minWidth: 200, maxWidth: 280 }}>
              <TickerSearch
                value={tickerQuery}
                onChange={setTickerQuery}
                onSelect={(sym) => setSymbol(sym)}
                placeholder="Search stocks..."
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
      </header>

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
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
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
