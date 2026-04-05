const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Maps to GET /api/stocks/:symbol
export async function getStockSnapshot(symbol: string) {
  await delay(300);
  return {
    symbol,
    price: 175.43,
    change: 2.15,
    changePercent: 1.24,
    open: 173.50,
    high: 176.20,
    low: 173.10,
    volume: "42.5M",
    marketCap: "$2.71T",
    marketStatus: "Open",
    lastUpdated: "Feb 4, 2026 9:30 AM EST",
  };
}

// Maps to GET /api/stocks/:symbol/bars
// timeframe: "1Min" | "5Min" | "15Min" | "30Min" | "1Hour" | "1Day" | "1Week" | "1Month"
export async function getStockBars(symbol: string, timeframe: string, start: string, end?: string) {
  await delay(400);

  const bases: Record<string, number> = {
    "1Hour": 173.50,
    "1Day": 160.00,
    "1Week": 120.00,
    "1Month": 80.00,
  };

  const points: Record<string, number> = {
    "1Hour": 7,
    "1Day": 30,
    "1Week": 52,
    "1Month": 60,
  };

  const basePrice = bases[timeframe] ?? 173.50;
  const count = points[timeframe] ?? 30;
  const data: { time: string; open: number; high: number; low: number; close: number; volume: number }[] = [];

  let prevClose = basePrice;
  for (let i = 0; i < count; i++) {
    const open = prevClose;
    const change = (Math.random() * 2 - 0.75) * 1.5;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 0.5;
    const low = Math.min(open, close) - Math.random() * 0.5;
    data.push({
      time: `T${i}`,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(Math.random() * 500000 + 100000),
    });
    prevClose = close;
  }

  return data;
}

// Maps to GET /api/stocks/:symbol/quote
export async function getStockQuote(symbol: string) {
  await delay(200);
  return {
    symbol,
    bidPrice: 175.38,
    bidSize: 312,
    askPrice: 175.48,
    askSize: 270,
  };
}
