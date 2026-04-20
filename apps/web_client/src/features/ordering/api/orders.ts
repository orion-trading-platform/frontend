import api, { tradingApi } from "@/features/auth/api";

export interface OrderRequest {
  symbol: string;
  userId: string;
  accountId: string;
  side: "BUY" | "SELL";
  type: "MARKET" | "LIMIT";
  qty: number;
  limit_price?: number;
}

export interface OrderResponse {
  orderId: string;
  status: "filled" | "partially_filled" | "pending" | "rejected";
  symbol: string;
  side: "BUY" | "SELL";
  type: string;
  qty: number;
  executedPrice: number;
  totalAmount: number;
  timestamp: string;
  residualQty?: number;
  rejectionReason?: string | null;
}

export async function placeOrder(order: OrderRequest): Promise<OrderResponse> {
  const res = await tradingApi.post("/api/orders", {
    symbol: order.symbol,
    user_id: order.userId,
    account_id: order.accountId,
    side: order.side,
    type: order.type,
    qty: order.qty,
    limit_price: order.limit_price,
  });
  return res.data as OrderResponse;
}

export async function cancelOrder(
  ticker: string,
  timestamp: number
): Promise<void> {
  await tradingApi.delete(`/api/orders/${ticker}/${timestamp}`);
}

export async function getOrderHistory(): Promise<OrderResponse[]> {
  const res = await api.get("/orders/active");
  return res.data.orders.map((d: any) => ({
    orderId: `${d.ticker}-${d.timestamp}`,
    status: d.status === "PENDING" ? "pending" : d.status === "PARTIALLY_FILLED" ? "partially_filled" : "filled",
    symbol: d.ticker,
    side: d.side,
    type: d.order_type?.toLowerCase() ?? "market",
    qty: d.quantity,
    executedPrice: d.avg_fill_price ?? d.limit_price ?? 0,
    totalAmount: parseFloat(((d.filled_qty ?? d.quantity) * (d.avg_fill_price ?? d.limit_price ?? 0)).toFixed(2)),
    timestamp: new Date(d.timestamp / 1000).toISOString(),
  }));
}
