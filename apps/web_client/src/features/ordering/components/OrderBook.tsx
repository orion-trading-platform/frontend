import { useEffect, useState } from "react";
import { useTheme } from '@/ThemeContext';
import { getStockQuote } from "../api/stocks";
import { subscribeToStream } from "../api/stream";

interface Quote {
  symbol: string;
  bidPrice: number;
  bidSize: number;
  askPrice: number;
  askSize: number;
}

interface OrderBookProps {
  symbol: string;
}

interface BookLevel {
  price: number;
  size: number;
}

export function OrderBook({ symbol }: OrderBookProps) {
  const { dark } = useTheme();
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    let active = true;

    getStockQuote(symbol).then((initialQuote) => {
      if (active) setQuote(initialQuote);
    });

    const unsubscribe = subscribeToStream([symbol], (update) => {
      if (update.symbol !== symbol) return;
      if (update.bidPrice == null || update.askPrice == null) return;

      setQuote({
        symbol,
        bidPrice: update.bidPrice,
        bidSize: update.bidSize ?? 0,
        askPrice: update.askPrice,
        askSize: update.askSize ?? 0,
      });
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [symbol]);

  const spread = quote ? (quote.askPrice - quote.bidPrice).toFixed(2) : "—";
  const bidLevels: BookLevel[] = quote
    ? Array.from({ length: 5 }, (_, index) => ({
        price: quote.bidPrice - index * 0.02,
        size: Math.max(quote.bidSize - index * 24, 1),
      }))
    : [];
  const askLevels: BookLevel[] = quote
    ? Array.from({ length: 5 }, (_, index) => ({
        price: quote.askPrice + index * 0.02,
        size: Math.max(quote.askSize - index * 18, 1),
      }))
    : [];
  const largestBidSize = Math.max(...bidLevels.map((level) => level.size), 1);
  const largestAskSize = Math.max(...askLevels.map((level) => level.size), 1);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-[rgba(148,163,184,0.10)] bg-white dark:bg-[#0f1520] p-6">
      <h3 className="mb-1 text-lg font-bold dark:text-slate-100">Order Book</h3>
      <p className="mb-4 text-xs text-gray-400 dark:text-slate-500">Top 5 bids and asks from latest quote</p>

      {!quote ? (
        <div className="flex h-24 items-center justify-center text-gray-400 dark:text-slate-500">Loading...</div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-2 px-2 text-xs font-medium text-gray-500 dark:text-slate-400">BID (Top 5)</div>
              <div className="space-y-1">
                {bidLevels.map((level, index) => {
                  const width = `${Math.round((level.size / largestBidSize) * 100)}%`;
                  return (
                    <div
                      key={`${level.price}-${index}`}
                      className="relative flex items-center justify-between overflow-hidden rounded px-3 py-2 text-sm"
                    >
                      <div className="absolute bottom-0 left-0 top-0" style={{ width, background: dark ? 'rgba(16,185,129,0.15)' : '#dcfce7' }} />
                      <span className="relative z-10 font-semibold text-green-600 dark:text-green-400">${level.price.toFixed(2)}</span>
                      <span className="relative z-10 text-gray-600 dark:text-slate-400">{level.size} shares</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="mb-2 px-2 text-xs font-medium text-gray-500 dark:text-slate-400">ASK (Top 5)</div>
              <div className="space-y-1">
                {askLevels.map((level, index) => {
                  const width = `${Math.round((level.size / largestAskSize) * 100)}%`;
                  return (
                    <div
                      key={`${level.price}-${index}`}
                      className="relative flex items-center justify-between overflow-hidden rounded px-3 py-2 text-sm"
                    >
                      <div className="absolute bottom-0 left-0 top-0" style={{ width, background: dark ? 'rgba(239,68,68,0.15)' : '#fee2e2' }} />
                      <span className="relative z-10 font-semibold text-red-500 dark:text-red-400">${level.price.toFixed(2)}</span>
                      <span className="relative z-10 text-gray-600 dark:text-slate-400">{level.size} shares</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-[rgba(148,163,184,0.08)] pt-3 text-center text-sm text-gray-500 dark:text-slate-400">
            Spread: <span className="font-semibold text-gray-700 dark:text-slate-200">${spread}</span>
          </div>
        </div>
      )}
    </div>
  );
}
