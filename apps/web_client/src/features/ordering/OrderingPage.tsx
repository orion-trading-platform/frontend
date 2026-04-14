import { useEffect, useState } from "react";
import { OrderBook } from "./components/OrderBook";
import { OrderPanel } from "./components/OrderPanel";
import { StockChart } from "./components/StockChart";
import { getStockSnapshot } from "./api/stocks";
import { subscribeToStream } from "./api/stream";
import type { OrderResponse } from "./api/orders";
import { useAuth, useAccount } from "../auth";

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

const SYMBOL = "AAPL";

export function OrderingPage() {
  const { currentUser } = useAuth();
  const { account } = useAccount();
  const balance = account ? parseFloat(account.balance) : 0;
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  // Derive display name and initials from the real auth user
  const displayName = currentUser?.email?.split("@")[0] ?? "Guest";
  const initials = displayName.slice(0, 2).toUpperCase();

  // Fetch initial snapshot on mount
  useEffect(() => {
    getStockSnapshot(SYMBOL).then((data) => {
      setSnapshot(data);
      setCurrentPrice(data.price);
    });
  }, []);

  const handleOrderPlaced = (_result: OrderResponse) => {
    // balance is now driven by useAccount — no manual update needed
  };

  // Subscribe to live price updates via SSE
  useEffect(() => {
    const unsubscribe = subscribeToStream([SYMBOL], (update) => {
      setCurrentPrice(update.price);
    });
    return unsubscribe; // React calls this on unmount to stop the subscription
  }, []);

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
      <header className="border-b border-gray-200 bg-white px-6 py-3.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-sm font-bold text-white">O</span>
              </div>
              <span className="text-lg font-semibold">Orion</span>
            </div>
            <nav className="flex gap-6 text-sm">
              <a href="#/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
              <a href="#/trade" className="font-medium text-gray-900">Trade</a>
              <a href="#/ledger" className="text-gray-600 hover:text-gray-900">Ledger</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right text-sm">
                <div className="font-medium">{displayName}</div>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600">
                <span className="text-sm font-medium text-white">{initials}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
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
                <span className="text-gray-600">Apple Inc.</span>
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
            <StockChart symbol={SYMBOL} />
            <OrderBook symbol={SYMBOL} />
          </div>
          <div className="col-span-1">
            <OrderPanel symbol={SYMBOL} currentPrice={currentPrice} buyingPower={balance} userId={currentUser?.user_id?.toString() ?? ""} onOrderPlaced={handleOrderPlaced} />
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
