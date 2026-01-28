import express from "express";
const router = express.Router();

// Fake dataset per-user
const USER_DATA = {
  user_123: {
    summary: {
      netPL: 124.5,
      realizedPL: 90.1,
      unrealizedPL: 34.4,
      cashBalance: 3220.18,
      accountValue: 8124.99,
      buyingPower: 5000.0,
    },
    activity: [
      {
        id: "evt_1",
        timestamp: new Date().toISOString(),
        type: "TRADE",
        subtype: "BUY",
        symbol: "AAPL",
        quantity: 2,
        price: 191.2,
        amount: -382.4,
        fee: 0.25,
        status: "FILLED",
        notes: "Market order",
        orderId: "ord_77",
        transferId: null,
      },
      {
        id: "evt_2",
        timestamp: new Date(Date.now() - 3600_000).toISOString(),
        type: "TRANSFER",
        subtype: "DEPOSIT",
        symbol: null,
        quantity: null,
        price: null,
        amount: 500.0,
        fee: 0.0,
        status: "COMPLETED",
        notes: "ACH deposit",
        orderId: null,
        transferId: "tr_99",
      },
      {
        id: "evt_3",
        timestamp: new Date(Date.now() - 7200_000).toISOString(),
        type: "TRADE",
        subtype: "SELL",
        symbol: "TSLA",
        quantity: 1,
        price: 222.1,
        amount: 222.1,
        fee: 0.15,
        status: "FILLED",
        notes: "Limit order",
        orderId: "ord_88",
        transferId: null,
      },
      {
        id: "evt_4",
        timestamp: new Date(Date.now() - 9000_000).toISOString(),
        type: "FEE",
        subtype: null,
        symbol: null,
        quantity: null,
        price: null,
        amount: -0.25,
        fee: 0.0,
        status: "POSTED",
        notes: "SEC fee",
        orderId: null,
        transferId: null,
      }
    ],
  },
};

function getUser(req) {
  const id = req.user?.id;
  return USER_DATA[id];
}

router.get("/ledger/summary", (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ error: "Not logged in" });
  res.json(user.summary);
});

router.get("/ledger/activity", (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ error: "Not logged in" });

  let items = [...user.activity];

  const { type, status, symbol, page = 1, pageSize = 25 } = req.query;

  // Filters
  if (type) items = items.filter((x) => x.type === type);
  if (status) items = items.filter((x) => (x.status || "").toUpperCase() === status.toUpperCase());
  if (symbol) items = items.filter((x) => (x.symbol || "").toUpperCase() === symbol.toUpperCase());

  // Sort newest first
  items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Pagination
  const p = Number(page);
  const ps = Number(pageSize);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ps));
  const startIdx = (p - 1) * ps;
  const paginated = items.slice(startIdx, startIdx + ps);

  res.json({
    items: paginated,
    page: p,
    pageSize: ps,
    totalItems,
    totalPages,
  });
});

router.get("/ledger/activity/:id", (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ error: "Not logged in" });

  const evt = user.activity.find((x) => x.id === req.params.id);
  if (!evt) return res.status(404).json({ error: "Not found" });

  // add extra detail fields like a real backend would
  const detail = {
    ...evt,
    filledQuantity: evt.quantity,
    avgFillPrice: evt.price,
    orderType: evt.type === "TRADE" ? "MARKET" : null,
    failureReason: null,
  };

  res.json(detail);
});

export default router;