import axios from "axios";

function marketApiBaseURL(): string {
  return String(import.meta.env.VITE_MARKET_DATA_URL ?? "").replace(/\/$/, "");
}

const marketApi = axios.create({ baseURL: marketApiBaseURL() });

/**
 * circumvent header issue. maybe a bit slapdash.
 */
marketApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Maps to GET /api/stocks/:symbol
export async function getStockSnapshot(symbol: string) {
  const res = await marketApi.get(`/api/stocks/${symbol}`);
  const { daily_bar, previous_daily_bar, latest_quote } = res.data;
  const price = latest_quote?.ask_price ?? daily_bar.close;
  const change = daily_bar.close - previous_daily_bar.close;
  const changePercent = (change / previous_daily_bar.close) * 100;
  return {
    symbol,
    price,
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    open: daily_bar.open,
    high: daily_bar.high,
    low: daily_bar.low,
    volume: daily_bar.volume.toLocaleString(),
    marketStatus: "Open",
    lastUpdated: new Date(daily_bar.timestamp).toLocaleString(),
  };
}

// Maps to GET /api/stocks/:symbol/bars
// timeframe: "1Min" | "5Min" | "15Min" | "30Min" | "1Hour" | "1Day" | "1Week" | "1Month"
export async function getStockBars(symbol: string, timeframe: string, start: string, end?: string) {
  const params: Record<string, string> = { timeframe, start };
  if (end) params.end = end;
  const res = await marketApi.get(`/api/stocks/${symbol}/bars`, { params });
  const bars = res.data.data?.[symbol] ?? [];
  return bars.map((b: any) => ({
    time: new Date(b.timestamp).toLocaleTimeString(),
    open: b.open,
    high: b.high,
    low: b.low,
    close: b.close,
    volume: b.volume,
  }));
}

// Maps to GET /api/stocks/:symbol/quote
export async function getStockQuote(symbol: string) {
  const res = await marketApi.get(`/api/stocks/${symbol}/quote`);
  return {
    symbol,
    bidPrice: res.data.bid_price,
    bidSize: res.data.bid_size ?? 0,
    askPrice: res.data.ask_price,
    askSize: res.data.ask_size ?? 0,
  };
}