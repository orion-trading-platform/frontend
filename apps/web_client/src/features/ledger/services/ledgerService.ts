// ── Types ──────────────────────────────────────────────────────────────────

export interface LedgerSummary {
  netPL: number;
  realizedPL: number;
  unrealizedPL: number;
  cashBalance: number;
  accountValue: number;
  buyingPower: number;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  type: string;
  subtype: string | null;
  symbol: string | null;
  quantity: number | null;
  price: number | null;
  amount: number | null;
  fee: number;
  status: string;
  notes: string | null;
  orderId: string | null;
  transferId: string | null;
}

export interface ActivityDetail extends ActivityItem {
  filledQuantity: number | null;
  avgFillPrice: number | null;
  orderType: string | null;
  failureReason: string | null;
}

export interface ActivityPage {
  items: ActivityItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface GetSummaryParams {
  startDate: string;
  endDate: string;
}

interface GetActivityParams {
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  symbol: string;
  page: number;
  pageSize: number;
}

// ── API helper ─────────────────────────────────────────────────────────────

const API_BASE = "";
const ACCOUNT_ID = "2000000000"; // will change once auth is integrated

async function apiGet<T>(path: string, params: Record<string, string | number | undefined | null> = {}): Promise<T> {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  });

  const res = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${path} failed (${res.status}) ${text}`);
  }

  return res.json();
}

// ── Service ────────────────────────────────────────────────────────────────

export const ledgerService = {
  getSummary: (params: GetSummaryParams): Promise<LedgerSummary> =>
    apiGet<LedgerSummary>("/api/ledger/summary", {
      account_id: ACCOUNT_ID,
      ...params,
    }),

  getActivity: (params: GetActivityParams): Promise<ActivityPage> =>
    apiGet<ActivityPage>("/api/ledger/activity", {
      account_id: ACCOUNT_ID,
      ...params,
      sort: "timestamp_desc",
    }),

  getActivityDetail: (id: string): Promise<ActivityDetail> =>
    apiGet<ActivityDetail>(`/api/ledger/activity/${id}`),
};
