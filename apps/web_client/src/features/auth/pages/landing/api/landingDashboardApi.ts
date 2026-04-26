const MARKET_URL = import.meta.env.VITE_MARKET_DATA_URL ?? 'http://localhost:8001';

export interface Holding {
  ticker: string;
  currentPrice: number;
  changeDaily: number;
}

export interface MoverItem {
  symbol: string;
  price: number;
  changePercent: number;
}

let sp500Cache: { data: Holding[]; fetchedAt: number } | null = null;
const CACHE_TTL = 1_800_000; // 30m matching market data api TTL

export async function fetchSP500Holdings(): Promise<Holding[]> {
  if (sp500Cache && Date.now() - sp500Cache.fetchedAt < CACHE_TTL) {
    return sp500Cache.data;
  }
  const res = await fetch(`${MARKET_URL}/api/indices/sp500`);
  if (!res.ok) throw new Error('Failed to fetch S&P 500 data');
  const json = await res.json();
  const data: Holding[] = Array.isArray(json) ? json : json.data;
  sp500Cache = { data, fetchedAt: Date.now() };
  return data;
}

export async function fetchHeaderBigMovers(): Promise<MoverItem[]> {
  const holdings = await fetchSP500Holdings();
  return [...holdings]
    .sort((a, b) => Math.abs(b.changeDaily) - Math.abs(a.changeDaily))
    .slice(0, 6)
    .map(h => ({ symbol: h.ticker, price: h.currentPrice, changePercent: h.changeDaily }));
}
