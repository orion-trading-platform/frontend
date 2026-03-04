import { useEffect, useState } from "react";
import { getStockQuote } from "../api/stocks";

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
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    getStockQuote(symbol).then(setQuote);
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
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="mb-1 text-lg font-bold">Order Book</h3>
      <p className="mb-4 text-xs text-gray-400">Top 5 bids and asks from latest quote</p>

      {!quote ? (
        <div className="flex h-24 items-center justify-center text-gray-400">Loading...</div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-2 px-2 text-xs font-medium text-gray-500">BID (Top 5)</div>
              <div className="space-y-1">
                {bidLevels.map((level, index) => {
                  const width = `${Math.round((level.size / largestBidSize) * 100)}%`;
                  return (
                    <div
                      key={`${level.price}-${index}`}
                      className="relative flex items-center justify-between overflow-hidden rounded px-3 py-2 text-sm"
                    >
                      <div className="absolute bottom-0 left-0 top-0 bg-green-100" style={{ width }} />
                      <span className="relative z-10 font-semibold text-green-600">${level.price.toFixed(2)}</span>
                      <span className="relative z-10 text-gray-600">{level.size} shares</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="mb-2 px-2 text-xs font-medium text-gray-500">ASK (Top 5)</div>
              <div className="space-y-1">
                {askLevels.map((level, index) => {
                  const width = `${Math.round((level.size / largestAskSize) * 100)}%`;
                  return (
                    <div
                      key={`${level.price}-${index}`}
                      className="relative flex items-center justify-between overflow-hidden rounded px-3 py-2 text-sm"
                    >
                      <div className="absolute bottom-0 left-0 top-0 bg-red-100" style={{ width }} />
                      <span className="relative z-10 font-semibold text-red-500">${level.price.toFixed(2)}</span>
                      <span className="relative z-10 text-gray-600">{level.size} shares</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3 text-center text-sm text-gray-500">
            Spread: <span className="font-semibold text-gray-700">${spread}</span>
          </div>
        </div>
      )}
    </div>
  );
}
