const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export interface OrderRequest {
  symbol: string;
  side: "BUY" | "SELL";
  type: "market" | "limit" | "stop" | "stop_limit";
  qty: number;
  limit_price?: number;
  stop_price?: number;
}

export interface OrderResponse {
  orderId: string;
  status: "filled" | "pending" | "rejected";
  symbol: string;
  side: "BUY" | "SELL";
  type: string;
  qty: number;
  executedPrice: number;
  totalAmount: number;
  timestamp: string;
}

// NOTE: assuming endpoint POST /api/orders
export async function placeOrder(order: OrderRequest): Promise<OrderResponse> {
  await delay(800);

  return {
    orderId: `ORD-${Date.now()}`,
    status: order.type === "market" ? "filled" : "pending",
    symbol: order.symbol,
    side: order.side,
    type: order.type,
    qty: order.qty,
    executedPrice: 175.43,
    totalAmount: parseFloat((order.qty * 175.43 * 1.0001).toFixed(2)),
    timestamp: new Date().toISOString(),
  };
}

export async function getOrderHistory(): Promise<OrderResponse[]> {
  await delay(400);

  return [
    {
      orderId: "ORD-1001",
      status: "filled",
      symbol: "AAPL",
      side: "BUY",
      type: "market",
      qty: 5,
      executedPrice: 173.20,
      totalAmount: 866.09,
      timestamp: "2026-02-04T09:31:00.000Z",
    },
    {
      orderId: "ORD-1002",
      status: "filled",
      symbol: "AAPL",
      side: "SELL",
      type: "limit",
      qty: 2,
      executedPrice: 174.50,
      totalAmount: 349.03,
      timestamp: "2026-02-04T10:15:00.000Z",
    },
    {
      orderId: "ORD-1003",
      status: "pending",
      symbol: "AAPL",
      side: "BUY",
      type: "limit",
      qty: 10,
      executedPrice: 174.00,
      totalAmount: 1740.17,
      timestamp: "2026-02-04T11:00:00.000Z",
    },
  ];
}
