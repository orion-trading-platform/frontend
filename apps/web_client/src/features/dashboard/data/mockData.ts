export const MOCK_STATS = [
  { label: "Total Gains", value: "$18,320.50", change: "+15.3%", isPositive: true, icon: "Graph" },
  { label: "Cash in Wallet", value: "$12,450.00", change: "-1.2%", isPositive: false, icon: "Wallet" },
  { label: "Day's P&L", value: "$432.20", change: "+0.8%", isPositive: true, icon: "Pulse" },
  { label: "Total Portfolio Value", value: "$124,592.00", change: "+2.4%", isPositive: true, icon: "Cash" },
];

export type Holding = {
  symbol: string;
  name: string;
  price: number;
  change: string;
  shares: number;
  value: number;
};

export const MOCK_HOLDINGS: Holding[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 178.35, change: "+1.2%", shares: 50, value: 8917.50 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 235.40, change: "-0.8%", shares: 30, value: 7062.00 },
  { symbol: "NVDA", name: "Nvidia Corp.", price: 460.15, change: "+3.5", shares: 15, value: 6902.25 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 330.20, change: "+0.5", shares: 40, value: 13208.00 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 135.80, change: "-1.1", shares: 60, value: 8148.00 },    
];

export const MOCK_ACTIVITY = [
  { type: "Buy", symbol: "AAPL", date: "Today, 10:23 AM", value: "-$1,250.00", status: "Pending", isPositive: false },
  { type: "Sell", symbol: "TSLA", date: "Yesterday, 2:45 PM", value: "+$4,200.00", status: "Completed",isPositive: true },
  { type: "Deposit", symbol: "USD", date: "Yesterday, 2:45 PM", value: "+$4,200.00", status: "Completed", isPositive: true },
  { type: "Trade", symbol: "NVDA", date: "Yesterday, 1:00 PM", value: "+$3,200.00", status: "Filled", isPositive: true }
];