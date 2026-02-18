import { Bell } from "lucide-react";
import { OrderBook } from "./components/OrderBook";
import { OrderPanel } from "./components/OrderPanel";
import { StockChart } from "./components/StockChart";

export function OrderingPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <header className="border-b border-gray-200 bg-white px-6 py-3.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-sm font-bold text-white">S</span>
              </div>
              <span className="text-lg font-semibold">StockPro</span>
            </div>
            <nav className="flex gap-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </a>
              <a href="#" className="font-medium text-gray-900">
                Trade
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Portfolio
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Transactions
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="rounded-lg p-2 hover:bg-gray-100">
              <Bell className="size-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right text-sm">
                <div className="font-medium">Alex Morgan</div>
                <div className="text-xs text-gray-500">Pro Trader</div>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600">
                <span className="text-sm font-medium text-white">AM</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <svg
                className="h-5 w-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Cash in Wallet</div>
              <div className="text-2xl font-bold">$12,450.00</div>
            </div>
            <div className="ml-auto">
              <span className="text-sm text-red-500">-1.2%</span>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h2 className="text-2xl font-bold">AAPL</h2>
                <span className="text-gray-600">Apple Inc.</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">$175.43</span>
                <span className="text-lg font-medium text-green-500">+$2.15 (+1.24%)</span>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>Market Open</div>
              <div>Feb 4, 2026 9:30 AM EST</div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4 border-t border-gray-200 pt-4">
            <StatItem label="Open" value="$173.50" />
            <StatItem label="High" value="$176.20" />
            <StatItem label="Low" value="$173.10" />
            <StatItem label="Volume" value="42.5M" />
            <StatItem label="Mkt Cap" value="$2.71T" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <StockChart />
            <OrderBook />
          </div>
          <div className="col-span-1">
            <OrderPanel symbol="AAPL" currentPrice={175.43} buyingPower={12450.0} />
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
