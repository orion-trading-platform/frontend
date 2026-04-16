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

// 4. 30-DAY GRAPH FETCHER (Composition)
// Fires 30 requests (one for each of the last 30 days) to build the graph data
export const fetch30DayGraphData = async (daysToFetch: number = 30): Promise<GraphDataPoint[]> => {
  const promises = [];
  const currentDate = new Date();

  // Loop backwards from 29 down to 0 so the array is in chronological order (oldest to newest)
  for (let i = daysToFetch - 1; i >= 0; i--) {
    // Create a new date object for each day going backward
    const targetDateObj = new Date();
    targetDateObj.setDate(currentDate.getDate() - i);
    
    // Format to YYYY-MM-DD using your helper
    const targetDateStr = getFormattedDate(targetDateObj);
    
    promises.push(
      fetchLedgerSummary(targetDateStr, targetDateStr).then(summary => ({
        date: targetDateStr, // Keeps the full YYYY-MM-DD label for the x-axis
        value: summary.accountValue
      }))
    );
  }

  // Promise.all fires all 30 requests concurrently
  return Promise.all(promises); 
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

// 1. THE CORE FETCHER
// Grabs the history for a stock. You can reuse this later if you need to build a chart!
export const fetchMarketHistory = async (ticker: string, limit: number = 100): Promise<MarketHistoryRead> => {
  // ==========================================
  // MOCK DATA MODE
  // ==========================================
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockPrices: Record<string, number> = {
        NVDA: 462.80, AAPL: 178.92, MSFT: 332.15,
        AMZN: 134.20, TSLA: 231.40, GOOGL: 142.60, META: 485.30
      };
      
      const basePrice = mockPrices[ticker] || 100.00;
      
      // Generate a fake array of ticks based on the limit requested
      const fakeTicks: MarketTick[] = Array.from({ length: limit }).map((_, index) => ({
        price: basePrice - (index * 0.5), // Just faking some slight price movement
        source: 'NASDAQ',
        ticker: ticker,
        timestamp: Date.now() - (index * 60000), // Faking times going backward
        volume: Math.floor(Math.random() * 5000) + 1000 
      }));

      resolve({
        ticker: ticker,
        ticks: fakeTicks
      });
    }, 200); 
  });

  // ==========================================
  // REAL API MODE - Uncomment when ready
  // ==========================================
  /*
  const queryParams = new URLSearchParams({
    ticker: ticker,
    limit: limit.toString()
  });
  const response = await fetch(`${BASE_URL}/api/market-data/history?${queryParams}`);
  if (!response.ok) throw new Error(`Failed to fetch history for ${ticker}`);
  return response.json();
  */
};

// 2. THE HELPER (Composition)
// Need just the latest tick? Pass limit=1 to our history fetcher and extract the first item.
export const fetchLatestTick = async (ticker: string): Promise<MarketTick> => {
  const history = await fetchMarketHistory(ticker, 1);
  
  if (!history.ticks || history.ticks.length === 0) {
    throw new Error(`No data found for ${ticker}`);
  }
  
  return history.ticks[0];
};

// 3. THE HEADER FETCHER (Composition)
// The exact same as before! It doesn't care that the underlying API endpoint changed.
const BIG_MOVER_TICKERS = ['NVDA', 'AAPL', 'MSFT', 'AMZN', 'TSLA', 'GOOGL', 'META'];

export const fetchHeaderBigMovers = async (): Promise<MarketTick[]> => {
  const fetchPromises = BIG_MOVER_TICKERS.map(ticker => fetchLatestTick(ticker));
  return Promise.all(fetchPromises);
};

export interface ActivityItem {
  id: string;
  fee: number;
  status: string;
  timestamp: string; // RFC3339 string
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
  // ==========================================
  // MOCK DATA MODE 
  // ==========================================
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
        ].slice(0, pageSize) // Ensures the mock data respects your pageSize limit
      });
    }, 300);
  });

  // ==========================================
  // REAL API MODE - Uncomment when ready
  // ==========================================
  /*
  const queryParams = new URLSearchParams({
    account_id: '1', // Hardcoded as requested
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


export const fetchRecentActivity = async (): Promise<ActivityItem[]> => {
  const today = getFormattedDate(new Date());
  const year2000 = '2000-01-01'; // Safe start date to grab all history

  const activityPage = await fetchLedgerActivity(year2000, today, 1, 5);
  
  return activityPage.items;
};