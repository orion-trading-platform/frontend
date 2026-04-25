import api from "@/features/auth/api";

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
  accountId: string,
  startDate: string;
  endDate: string;
}

interface GetActivityParams {
  accountId: string,
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  symbol: string;
  page: number;
  pageSize: number;
}

// ── API helper ─────────────────────────────────────────────────────────────

async function apiGet<T>(path: string, params: Record<string, string | number | undefined | null> = {}): Promise<T> {
  const filteredParams: Record<string, string | number> = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      filteredParams[k] = typeof v === "number" ? v : String(v);
    }
  });
  //An: fetch() had no axios interceptor and 401 flows weren't working, so I had to change to api
  const res = await api.get<T>(path, { params: filteredParams });
  return res.data;
}

// ── Service ────────────────────────────────────────────────────────────────

export const ledgerService = {
  getSummary: ({ accountId, ...params }: GetSummaryParams): Promise<LedgerSummary> =>
    apiGet<LedgerSummary>("/api/ledger/summary", {
      account_id: accountId,
      ...params,
    }),

  getActivity: ({ accountId, ...params }: GetActivityParams): Promise<ActivityPage> =>
    apiGet<ActivityPage>("/api/ledger/activity", {
      account_id: accountId,
      ...params,
      sort: "timestamp_desc",
    }),

  getActivityDetail: (accountId: string, id: string): Promise<ActivityDetail> =>
    apiGet<ActivityDetail>(`/api/ledger/activity/${id}`, {
      account_id: accountId,
    }),
};