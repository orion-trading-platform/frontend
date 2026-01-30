const API_BASE = ""; 

async function apiGet(path, params = {}) {
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

export const ledgerService = {
  getSummary: ({ startDate, endDate }) =>
    apiGet("/api/ledger/summary", { startDate, endDate }),

  getActivity: ({ startDate, endDate, type, status, symbol, page, pageSize }) =>
    apiGet("/api/ledger/activity", {
      startDate,
      endDate,
      type,
      status,
      symbol,
      page,
      pageSize,
      sort: "desc",
    }),

  getActivityDetail: (id) => apiGet(`/api/ledger/activity/${id}`),
};