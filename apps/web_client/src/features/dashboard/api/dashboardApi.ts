// api.ts

const BASE_URL = 'http://localhost:8000'; // Update this if your local port is different

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
export const fetchLedgerSummary = async (startDate: string, endDate: string): Promise<LedgerSummary> => {
  // ==========================================
  // MOCK DATA MODE - Use this while developing
  // ==========================================
  return new Promise((resolve) => {
    setTimeout(() => {
      // Adding a slight randomizer so the graph isn't a flat line
      const randomFluctuation = (Math.random() * 10000) - 5000; 

      resolve({
        accountValue: 125000.50 + randomFluctuation,
        buyingPower: 45000.00,
        cashBalance: 15000.25,
        netPL: 5500.75 + randomFluctuation,
        realizedPL: 2300.00,
        unrealizedPL: 3200.75
      });
    }, 100); // Lowered fake delay to 100ms so 12 calls resolve quickly
  });

  // ==========================================
  // REAL API MODE - Uncomment when ready
  // ==========================================
  /*
  const queryParams = new URLSearchParams({
    account_id: '1',
    startDate: startDate,
    endDate: endDate,
  });
  const response = await fetch(`${BASE_URL}/api/ledger/summary?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
  */
};

// 3. CURRENT SNAPSHOT FETCHER (Composition)
// Grabs exactly today's data for your dashboard's main number cards
export const fetchCurrentSnapshot = async (): Promise<LedgerSummary> => {
  const today = getFormattedDate(new Date());
  return fetchLedgerSummary(today, today);
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

export const fetchLedgerHistory = async (startDate: string, endDate: string): Promise<LedgerHistoryResponse> => {
  // ==========================================
  // MOCK DATA MODE 
  // ==========================================
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a quick fake array of history items based on the dates
      const mockHistory: LedgerHistoryItem[] = [];
      const start = new Date(startDate);
      const end = new Date(endDate);
      let current = new Date(start);

      while (current <= end) {
        mockHistory.push({
          date: current.toISOString().split('T')[0],
          netPL: 2500 + Math.random() * 200,
          realizedPL: 2472.72,
          unrealizedPL: 1800 + Math.random() * 50,
          cashBalance: 44476.19,
          accountValue: 98000 + (Math.random() * 2000), // Wobbly account value for the graph
          buyingPower: 18684.10
        });
        current.setDate(current.getDate() + 1);
      }

      resolve({
        accountId: "1",
        history: mockHistory
      });
    }, 200);
  });

  // ==========================================
  // REAL API MODE - Uncomment when ready
  // ==========================================
  /*
  const queryParams = new URLSearchParams({
    account_id: '1', // Hardcoded as requested
    startDate: startDate,
    endDate: endDate
  });
  
  const response = await fetch(`${BASE_URL}/api/ledger/history?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch ledger history');
  return response.json();
  */
};

export const fetchGraphData = async (days: number = 30): Promise<GraphDataPoint[]> => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);

  const startDateStr = getFormattedDate(start);
  const endDateStr = getFormattedDate(end);

  const response = await fetchLedgerHistory(startDateStr, endDateStr);
  
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
  startDate: string,
  endDate: string,
  page: number = 1,
  pageSize: number = 100
): Promise<ActivityPage> => {
  // MOCK DATA MODE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        page: page,
        pageSize: pageSize,
        totalItems: 5,
        totalPages: 1,
        items: [
          { id: 'act_1', timestamp: new Date().toISOString(), type: 'TRADE', status: 'COMPLETED', fee: 0, symbol: 'NVDA', quantity: 10, price: 462.80, amount: -4628.00 },
          { id: 'act_2', timestamp: new Date(Date.now() - 86400000).toISOString(), type: 'TRANSFER', subtype: 'DEPOSIT', status: 'COMPLETED', fee: 0, amount: 5000.00, notes: 'ACH Deposit from Chase' },
          { id: 'act_3', timestamp: new Date(Date.now() - 172800000).toISOString(), type: 'TRADE', status: 'COMPLETED', fee: 0.50, symbol: 'AAPL', quantity: -5, price: 178.92, amount: 894.60 },
          { id: 'act_4', timestamp: new Date(Date.now() - 259200000).toISOString(), type: 'DIVIDEND', status: 'COMPLETED', fee: 0, symbol: 'MSFT', amount: 35.50 },
          { id: 'act_5', timestamp: new Date(Date.now() - 345600000).toISOString(), type: 'TRADE', status: 'COMPLETED', fee: 0, symbol: 'TSLA', quantity: 20, price: 231.40, amount: -4628.00 }
        ].slice(0, pageSize) 
      });
    }, 300);
  });

  // REAL API MODE
  /*
  const queryParams = new URLSearchParams({
    account_id: '1', 
    startDate: startDate,
    endDate: endDate,
    page: page.toString(),
    pageSize: pageSize.toString()
  });
  
  const response = await fetch(`${BASE_URL}/api/ledger/activity?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch activity');
  return response.json();
  */
};



export const fetchMarketSnapshots = async (limit: number = 7, sortByChange: boolean = true): Promise<MarketSnapshotList> => {
  // ==========================================
  // MOCK DATA MODE
  // ==========================================
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        total: 500, // Fake total market size
        snapshots: [
          { ticker_symbol: 'NVDA', price: '462.80', daily_change_pct: '4.52', last_updated: new Date().toISOString() },
          { ticker_symbol: 'TSLA', price: '231.40', daily_change_pct: '3.85', last_updated: new Date().toISOString() },
          { ticker_symbol: 'AMD', price: '112.50', daily_change_pct: '2.91', last_updated: new Date().toISOString() },
          { ticker_symbol: 'AAPL', price: '178.92', daily_change_pct: '1.24', last_updated: new Date().toISOString() },
          { ticker_symbol: 'MSFT', price: '332.15', daily_change_pct: '-0.85', last_updated: new Date().toISOString() },
          { ticker_symbol: 'META', price: '485.30', daily_change_pct: '-1.45', last_updated: new Date().toISOString() },
          { ticker_symbol: 'AMZN', price: '134.20', daily_change_pct: '-2.10', last_updated: new Date().toISOString() },
        ].slice(0, limit)
      });
    }, 200);
  });

  // ==========================================
  // REAL API MODE - Uncomment when ready
  // ==========================================
  /*
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    offset: '0',
    sort_by_change: sortByChange.toString()
  });
  
  const response = await fetch(`${BASE_URL}/api/snapshots?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch market snapshots');
  return response.json();
  */
};

// Activity Helper (Composition)
export const fetchRecentActivity = async (): Promise<ActivityItem[]> => {
  const today = getFormattedDate(new Date());
  const year2000 = '2000-01-01'; // Safe start date to grab all history

  // Get just page 1, size 5
  const activityPage = await fetchLedgerActivity(year2000, today, 1, 5);
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

export const fetchHeaderBigMovers = async (): Promise<MoverItem[]> => {
  const now = Date.now();

  // 1. Return cached data if it's fresh
  if (cachedMovers && (now - lastMoversFetchTime < CACHE_TTL)) {
    return cachedMovers;
  }

  // 2. Fetch the top 7 dynamically from the new endpoint
  const snapshotData = await fetchMarketSnapshots(7, true);

  // 3. Map the backend schema to your React component's exact needs
  const freshMovers: MoverItem[] = snapshotData.snapshots.map(snap => ({
    symbol: snap.ticker_symbol,
    price: parseFloat(snap.price),
    // If daily_change_pct is null for some reason, default to 0
    changePercent: snap.daily_change_pct ? parseFloat(snap.daily_change_pct) : 0 
  }));

  // 4. Save to cache
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
export const fetchRawHoldings = async (accountId: string = '1'): Promise<PortfolioRead> => {
  // MOCK MODE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        account_id: accountId,
        holdings: [
          { ticker: 'AAPL', cost_basis: 150.00, quantity: 50 },
          { ticker: 'MSFT', cost_basis: 290.00, quantity: 30 },
          { ticker: 'NVDA', cost_basis: 120.50, quantity: 15 },
          { ticker: 'TSLA', cost_basis: 250.00, quantity: 20 },
        ]
      });
    }, 200);
  });

  // REAL API MODE
  /*
  const response = await fetch(`${BASE_URL}/api/holdings/${accountId}`);
  if (!response.ok) throw new Error('Failed to fetch raw holdings');
  return response.json();
  */
};

// 2. The "Enriched" Fetcher (What your React component actually calls)
export const fetchHoldings = async (): Promise<Holding[]> => {
  // Step 1: Get the barebones portfolio data
  const portfolio = await fetchRawHoldings('1');

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

export const fetchCashBalance = async (accountId: string = '1'): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(15000.25);
    }, 150);
  });

  /*
  const response = await fetch(`${BASE_URL}/accounts/${accountId}/balance`);
  if (!response.ok) {
    throw new Error('Failed to fetch account balance');
  }

  const data: BalanceRead = await response.json();
  return parseFloat(data.balance);
  */
};

// 2. The Composition Function (No Mocks!)
export const fetchAccountStats = async (): Promise<AccountStats> => {
  // Execute our API calls in parallel so the UI loads faster
  const [cashBalance, graphData, holdings] = await Promise.all([
    fetchCashBalance(),
    fetchGraphData(1), // Assuming 1 day to get today's start/current value
    fetchHoldings()
  ]);

  // --- DO THE MATH ---

  // Portfolio Value: The most recent point on our graph
  const currentPortfolioValue = graphData.length > 0 ? graphData[graphData.length - 1].value : 0;
  
  // Day Change: Current Value minus the first point on today's graph
  const startOfDayValue = graphData.length > 0 ? graphData[0].value : currentPortfolioValue;
  const dayChangeAmt = currentPortfolioValue - startOfDayValue;
  const dayChangePct = startOfDayValue > 0 ? (dayChangeAmt / startOfDayValue) * 100 : 0;

  // Total Yield: Calculate Total Return across all holdings vs Total Cost
  let totalCostBasis = 0;
  let totalReturn = 0;

  holdings.forEach(h => {
    totalCostBasis += (h.costBasis * h.quantity);
    totalReturn += h.totalReturn; 
  });

  const totalYield = totalCostBasis > 0 ? (totalReturn / totalCostBasis) * 100 : 0;

  return {
    portfolioValue: currentPortfolioValue,
    dayChangeAmt: parseFloat(dayChangeAmt.toFixed(2)),
    dayChangePct: parseFloat(dayChangePct.toFixed(2)),
    buyingPower: cashBalance, // Directly from your new endpoint
    totalYield: parseFloat(totalYield.toFixed(2)),
  };
};