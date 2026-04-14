import api from "@/features/auth/api";

export interface OrderRequest {
  symbol: string;
  userId: string;
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

export async function placeOrder(order: OrderRequest): Promise<OrderResponse> {
  const res = await api.post("/orders", {
    ticker: order.symbol,
    user_id: order.userId,
    side: order.side,
    quantity: order.qty,
    limit_price: order.limit_price,
  });
  const d = res.data;
  const executedPrice = order.limit_price ?? 0;
  return {
    orderId: `${d.ticker}-${d.timestamp}`,
    status: "pending",
    symbol: d.ticker,
    side: d.side,
    type: order.type,
    qty: d.quantity,
    executedPrice,
    totalAmount: parseFloat((d.quantity * executedPrice).toFixed(2)),
    timestamp: new Date(d.timestamp / 1000).toISOString(),
  };
}

export async function getOrderHistory(): Promise<OrderResponse[]> {
  const res = await api.get("/orders/active");
  return res.data.orders.map((d: any) => ({
    orderId: `${d.ticker}-${d.timestamp}`,
    status: d.status === "PENDING" ? "pending" : "filled",
    symbol: d.ticker,
    side: d.side,
    type: "limit",
    qty: d.quantity,
    executedPrice: d.limit_price ?? 0,
    totalAmount: parseFloat((d.quantity * (d.limit_price ?? 0)).toFixed(2)),
    timestamp: new Date(d.timestamp / 1000).toISOString(),
  }));
}
