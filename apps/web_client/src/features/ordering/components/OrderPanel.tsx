import { useState } from "react";
import { Info, TrendingDown, TrendingUp } from "lucide-react";
import { OrderConfirmation } from "./OrderConfirmation";
import { placeOrder, type OrderResponse } from "../api/orders";

interface OrderPanelProps {
  symbol: string;
  currentPrice: number;
  buyingPower: number;
  userId: string;
  onOrderPlaced: (result: OrderResponse) => void;
}

type OrderSide = "buy" | "sell";
type OrderType = "market" | "limit" | "stop" | "stop_limit";

export function OrderPanel({ symbol, currentPrice, buyingPower, userId, onOrderPlaced }: OrderPanelProps) {
  const [orderSide, setOrderSide] = useState<OrderSide>("buy");
  const [orderType, setOrderType] = useState<OrderType>("market");
  const [quantity, setQuantity] = useState<string>("");
  const [limitPrice, setLimitPrice] = useState<string>("");
  const [stopPrice, setStopPrice] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResponse | null>(null);

  const shares = Number.parseFloat(quantity) || 0;
  const effectivePrice =
    orderType === "market" ? currentPrice : Number.parseFloat(limitPrice) || currentPrice;
  const totalAmount = shares * effectivePrice;
  const estimatedCost = totalAmount + totalAmount * 0.0001;

  const canAfford = orderSide === "buy" ? estimatedCost <= buyingPower : true;
  const maxShares = orderSide === "buy" ? Math.floor(buyingPower / currentPrice) : 0;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (shares > 0 && canAfford) {
      setOrderResult(null);
      setShowConfirmation(true);
    }
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    try {
      const result = await placeOrder({
        symbol,
        userId,
        side: orderSide.toUpperCase() as "BUY" | "SELL",
        type: orderType,
        qty: shares,
        limit_price: limitPrice ? Number.parseFloat(limitPrice) : undefined,
        stop_price: stopPrice ? Number.parseFloat(stopPrice) : undefined,
      });
      setOrderResult(result);
      onOrderPlaced(result);
      setShowConfirmation(false);
      setQuantity("");
      setLimitPrice("");
      setStopPrice("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-bold">Place Order</h3>

        {orderResult && (
          <div
            className={`mb-4 rounded-lg p-3 text-sm ${
              orderResult.status === "filled"
                ? "bg-green-50 text-green-800"
                : "bg-blue-50 text-blue-800"
            }`}
          >
            <div className="font-semibold">
              Order {orderResult.status === "filled" ? "Filled" : "Pending"}
            </div>
            <div className="mt-0.5 text-xs opacity-75">
              {orderResult.orderId} · {orderResult.qty} shares @ ${orderResult.executedPrice.toFixed(2)}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setOrderSide("buy")}
              className={`rounded-lg px-4 py-3 font-medium transition-colors ${
                orderSide === "buy"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="size-4" />
                Buy
              </div>
            </button>
            <button
              type="button"
              onClick={() => setOrderSide("sell")}
              className={`rounded-lg px-4 py-3 font-medium transition-colors ${
                orderSide === "sell"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <TrendingDown className="size-4" />
                Sell
              </div>
            </button>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Order Type</label>
            <select
              value={orderType}
              onChange={(event) => setOrderType(event.target.value as OrderType)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="market">Market Order</option>
              <option value="limit">Limit Order</option>
              <option value="stop">Stop Loss</option>
              <option value="stop_limit">Stop Limit</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              {orderType === "market" && "Execute immediately at current market price"}
              {orderType === "limit" && "Execute only at specified price or better"}
              {orderType === "stop" && "Trigger market order when price reaches stop price"}
              {orderType === "stop_limit" && "Trigger limit order when price reaches stop price"}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Quantity (Shares)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {orderSide === "buy" && maxShares > 0 && (
              <div className="mt-1 flex items-center justify-between">
                <p className="text-xs text-gray-500">Max: {maxShares} shares</p>
                <button
                  type="button"
                  onClick={() => setQuantity(maxShares.toString())}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  Use max
                </button>
              </div>
            )}
          </div>

          {(orderType === "limit" || orderType === "stop_limit") && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Limit Price</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={limitPrice}
                  onChange={(event) => setLimitPrice(event.target.value)}
                  placeholder={currentPrice.toFixed(2)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-7 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {(orderType === "stop" || orderType === "stop_limit") && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Stop Price</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={stopPrice}
                  onChange={(event) => setStopPrice(event.target.value)}
                  placeholder={currentPrice.toFixed(2)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-7 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-2 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Share Price</span>
              <span className="font-semibold">${currentPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Quantity</span>
              <span className="font-semibold">{shares} shares</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Est. Commission</span>
              <span className="font-semibold">${(estimatedCost - totalAmount).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-2">
              <span className="font-semibold">Total</span>
              <span className="text-lg font-bold">${estimatedCost.toFixed(2)}</span>
            </div>
          </div>

          {orderSide === "buy" && (
            <div className="flex items-start gap-2 text-sm">
              <Info className="mt-0.5 size-4 text-gray-400" />
              <div>
                <div className="text-gray-600">Available Buying Power</div>
                <div className={`font-semibold ${canAfford ? "text-green-500" : "text-red-500"}`}>
                  ${buyingPower.toFixed(2)}
                  {!canAfford && " - Insufficient funds"}
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={shares === 0 || !canAfford}
            className={`w-full rounded-lg px-4 py-3 font-medium text-white transition-colors disabled:cursor-not-allowed ${
              orderSide === "buy"
                ? "bg-green-500 hover:bg-green-600 disabled:bg-gray-300"
                : "bg-red-500 hover:bg-red-600 disabled:bg-gray-300"
            }`}
          >
            Review {orderSide === "buy" ? "Buy" : "Sell"} Order
          </button>
        </form>
      </div>

      {showConfirmation && (
        <OrderConfirmation
          orderSide={orderSide}
          orderType={orderType}
          symbol={symbol}
          quantity={shares}
          price={effectivePrice}
          totalAmount={estimatedCost}
          isSubmitting={isSubmitting}
          onConfirm={handleConfirmOrder}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </>
  );
}
