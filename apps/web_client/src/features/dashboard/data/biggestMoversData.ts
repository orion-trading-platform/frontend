export interface MoverItem {
  symbol: string;
  price: number;
  changePercent: number;
}

export const MOCK_BIGGEST_MOVERS: MoverItem[] = [
  { symbol: 'NVDA', price: 462.80, changePercent: 5.2 },
  { symbol: 'AAPL', price: 178.92, changePercent: 2.4 },
  { symbol: 'MSFT', price: 332.15, changePercent: 1.8 },
  { symbol: 'AMZN', price: 134.20, changePercent: -1.5 },
  { symbol: 'TSLA', price: 231.40, changePercent: -2.1 },
  { symbol: 'GOOGL', price: 142.60, changePercent: 0.9 },
  { symbol: 'META', price: 485.30, changePercent: 3.0 },
  { symbol: 'AMD', price: 128.45, changePercent: 4.1 },
  { symbol: 'NFLX', price: 485.20, changePercent: -0.8 },
  { symbol: 'JPM', price: 198.60, changePercent: 1.2 },
  { symbol: 'V', price: 285.40, changePercent: 0.5 },
  { symbol: 'WMT', price: 168.90, changePercent: -1.0 },
];
