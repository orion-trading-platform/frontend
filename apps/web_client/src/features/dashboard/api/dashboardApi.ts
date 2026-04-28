// api.ts

import api from '@/features/auth/api';
import { getStockSnapshot } from "@/features/ordering/api/stocks";
import { subscribeToStream } from "@/features/ordering/api/stream";

const apiFetch = async <T>(
  path: string,
  params: Record<string, string | number | undefined | null> = {}
): Promise<T> => {
  const filteredParams: Record<string, string | number> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      filteredParams[key] = typeof value === 'number' ? value : String(value);
    }
  });

  const response = await api.get<T>(path, { params: filteredParams });
  return response.data;
};

// 1. INTERFACES
export interface LedgerSummary {
  accountValue: number;
  buyingPower: number;
  cashBalance: number;
  netPL: number;
  realizedPL: number;
  unrealizedPL: number;
}

export interface GraphDataPoint {
  date: string;
  value: number;
}

// Helper function to get dates formatted as YYYY-MM-DD
const getFormattedDate = (date: Date) => date.toISOString().split('T')[0];

// 2. THE BASE FETCHER (The one you provided, slightly enhanced for mock graphs)
export const fetchLedgerSummary = async (
  accountId: string,
  startDate: string,
  endDate: string
): Promise<LedgerSummary> => {
  // ==========================================
  // MOCK DATA MODE - Use this while developing
  // ==========================================

  // ==========================================
  // REAL API MODE - Uncomment when ready
  // ==========================================
  return apiFetch<LedgerSummary>('/api/ledger/summary', {
    account_id: accountId,
    startDate: startDate,
    endDate: endDate,
  });
};

// 3. CURRENT SNAPSHOT FETCHER (Composition)
// Grabs exactly today's data for your dashboard's main number cards
export const fetchCurrentSnapshot = async (
  accountId: string
): Promise<LedgerSummary> => {
  const today = getFormattedDate(new Date());
  return fetchLedgerSummary(accountId, today, today);
};


export interface MarketTick {
  price: number;
  source: string;
  ticker: string;
  timestamp: number;
  volume: number;
}

export interface MarketHistoryRead {
  ticker: string;
  ticks: MarketTick[];
}


export interface LedgerHistoryItem {
  netPL: number;
  realizedPL: number;
  unrealizedPL: number;
  cashBalance: number;
  accountValue: number;
  buyingPower: number;
  date: string;
}

export interface LedgerHistoryResponse {
  accountId: string;
  history: LedgerHistoryItem[];
}

export const fetchLedgerHistory = async (
  accountId: string,
  startDate: string,
  endDate: string
): Promise<LedgerHistoryResponse> => {
  // ==========================================
  // MOCK DATA MODE 
  // ==========================================

  // ==========================================
  // REAL API MODE - Uncomment when ready
  // ==========================================
  return apiFetch<LedgerHistoryResponse>('/api/ledger/history', {
    account_id: accountId,
    startDate: startDate,
    endDate: endDate
  });
};

export const fetchGraphData = async (
  accountId: string,
  days: number = 30
): Promise<GraphDataPoint[]> => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);

  const startDateStr = getFormattedDate(start);
  const endDateStr = getFormattedDate(end);

  const response = await fetchLedgerHistory(accountId, startDateStr, endDateStr);

  console.log("fetchGraphData ledger history response:", {
    accountId,
    days,
    startDateStr,
    endDateStr,
    response,
    historyLength: response.history?.length,
  });
  
  // Map the backend's heavy response into a lightweight array for your graph
  return response.history.map(item => ({
    date: item.date,
    value: item.accountValue
  }));
};

// ==========================================
// ACTIVITY FEED
// ==========================================

export interface ActivityItem {
  id: string;
  fee: number;
  status: string;
  timestamp: string; 
  type: string;
  amount?: number | null;
  notes?: string | null;
  orderId?: string | null;
  price?: number | null;
  quantity?: number | null;
  subtype?: string | null;
  symbol?: string | null;
  transferId?: string | null;
}

export interface ActivityPage {
  items: ActivityItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export const fetchLedgerActivity = async (
  accountId: string,
  startDate: string,
  endDate: string,
  page: number = 1,
  pageSize: number = 100
): Promise<ActivityPage> => {
  // MOCK DATA MODE

  // REAL API MODE
  return apiFetch<ActivityPage>('/api/ledger/activity', {
    account_id: accountId, 
    startDate: startDate,
    endDate: endDate,
    page: page,
    pageSize: pageSize
  });
};



export const fetchMarketSnapshots = async (limit: number = 7, sortByChange: boolean = true): Promise<MarketSnapshotList> => {
  // ==========================================
  // MOCK DATA MODE
  // ==========================================

  // ==========================================
  // REAL API MODE - Uncomment when ready
  // ==========================================
  return apiFetch<MarketSnapshotList>('/snapshots', {
    limit: limit,
    offset: 0,
    sort_by_change: sortByChange.toString()
  });
};

// Activity Helper (Composition)
export const fetchRecentActivity = async (
  accountId: string
): Promise<ActivityItem[]> => {
  const today = getFormattedDate(new Date());
  const year2000 = '2000-01-01'; // Safe start date to grab all history

  // Get just page 1, size 5
  const activityPage = await fetchLedgerActivity(accountId, year2000, today, 1, 5);
  return activityPage.items;
};

export interface MarketSnapshot {
  ticker_symbol: string;
  price: string;
  daily_change_pct: string | null;
  last_updated: string | null;
}

export interface MarketSnapshotList {
  total: number;
  snapshots: MarketSnapshot[];
}

// The UI interface stays exactly the same!
export interface MoverItem {
  symbol: string;
  price: number;
  changePercent: number;
}
// ==========================================
// CACHE SETUP
// ==========================================
let cachedMovers: MoverItem[] | null = null;
let lastMoversFetchTime = 0;
const CACHE_TTL = 60 * 1000; // 60 seconds

const DEMO_MOVER_SYMBOLS = ["AAPL", "MSFT", "NVDA", "AMZN", "GOOGL", "META", "TSLA"];

export const fetchHeaderBigMovers = async (): Promise<MoverItem[]> => {
  const now = Date.now();

  if (cachedMovers && now - lastMoversFetchTime < CACHE_TTL) {
    return cachedMovers;
  }

  const freshMovers: MoverItem[] = await Promise.all(
    DEMO_MOVER_SYMBOLS.map(async (symbol) => {
      const snap = await getStockSnapshot(symbol);

      return {
        symbol: snap.symbol,
        price: snap.price > 0 ? snap.price : snap.open,
        changePercent: snap.changePercent,
      };
    })
  );

  cachedMovers = freshMovers;
  lastMoversFetchTime = now;

  return freshMovers;
};
// ==========================================
// HOLDINGS / POSITIONS
// ==========================================

// 1. The Real Backend Schemas
export interface BackendHolding {
  cost_basis: number;
  quantity: number;
  ticker: string;
}

export interface PortfolioRead {
  account_id: string;
  holdings: BackendHolding[];
}

// 2. The Trimmed UI Interface
export interface Holding {
  ticker: string;
  currentPrice: number;
  costBasis: number;
  changeDaily: number;
  quantity: number;
  totalReturn: number;
}

// 1. The "Raw" Fetcher (Exactly matching the backend schema)
export const fetchRawHoldings = async (accountId: string): Promise<PortfolioRead> => {
  // MOCK MODE

  // REAL API MODE
  return apiFetch<PortfolioRead>(`/holdings/${accountId}`);
};

// 2. The "Enriched" Fetcher (What your React component actually calls)
export const fetchHoldings = async (
  accountId: string
): Promise<Holding[]> => {
  // Step 1: Get the barebones portfolio data
  const portfolio = await fetchRawHoldings(accountId);

  // Step 2: Get the live market snapshots
  const marketData = await fetchMarketSnapshots(500, false); 

  // Step 3: Mash them together!
  return portfolio.holdings.map((holding) => {
    const snapshot = marketData.snapshots.find(s => s.ticker_symbol === holding.ticker);

    const currentPrice = snapshot ? parseFloat(snapshot.price) : holding.cost_basis;
    const changeDaily = snapshot && snapshot.daily_change_pct ? parseFloat(snapshot.daily_change_pct) : 0;
    const totalReturn = (currentPrice - holding.cost_basis) * holding.quantity;

    return {
      ticker: holding.ticker,
      currentPrice: currentPrice,
      costBasis: holding.cost_basis,
      changeDaily: changeDaily,
      quantity: holding.quantity,
      totalReturn: parseFloat(totalReturn.toFixed(2))
    };
  });
};

// ==========================================
// ACCOUNT BALANCE & STATS
// ==========================================

// The exact schema from your backend docs
export interface BalanceRead {
  account_id: string;
  balance: string; // Comes in as a string regex!
  currency: string;
  version: number;
}

export interface AccountStats {
  portfolioValue: number;
  dayChangeAmt: number;
  dayChangePct: number;
  buyingPower: number;
  totalYield: number;
}

export const fetchCashBalance = async (accountId: string): Promise<number> => {
  const data = await apiFetch<BalanceRead>(`/api/accounts/${accountId}/balance`);
  return parseFloat(data.balance);
};

// 2. The Composition Function (No Mocks!)
export const fetchAccountStats = async (
  accountId: string,
  cashBalance: number
): Promise<AccountStats> => {
  const today = getFormattedDate(new Date());

  const [summary, holdings] = await Promise.all([
    fetchLedgerSummary(accountId, today, today),
    fetchHoldings(accountId),
  ]);

  const totalHoldingsMarketValue = holdings.reduce((sum, holding) => {
    return sum + holding.quantity * holding.currentPrice;
  }, 0);

  const netPL = summary.netPL || 0;

  const portfolioValue = cashBalance + totalHoldingsMarketValue;

  const dayChangeAmt = netPL;
  const dayChangePct =
    portfolioValue > 0 ? (dayChangeAmt / portfolioValue) * 100 : 0;

  const totalYield =
    portfolioValue > 0 ? (netPL / portfolioValue) * 100 : 0;

  return {
    portfolioValue: parseFloat(portfolioValue.toFixed(2)),
    dayChangeAmt: parseFloat(dayChangeAmt.toFixed(2)),
    dayChangePct: parseFloat(dayChangePct.toFixed(2)),
    buyingPower: cashBalance,
    totalYield: parseFloat(totalYield.toFixed(2)),
  };
};