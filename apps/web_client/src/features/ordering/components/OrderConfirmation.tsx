import { AlertCircle, X } from "lucide-react";

interface OrderConfirmationProps {
  orderSide: "buy" | "sell";
  orderType: string;
  symbol: string;
  quantity: number;
  price: number;
  totalAmount: number;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function OrderConfirmation({
  orderSide,
  orderType,
  symbol,
  quantity,
  price,
  totalAmount,
  isSubmitting,
  onConfirm,
  onCancel,
}: OrderConfirmationProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-[#0f1520] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold dark:text-slate-100">Confirm Order</h3>
          <button onClick={onCancel} className="text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200">
            <X className="size-5" />
          </button>
        </div>

        <div className="mb-4 space-y-3 rounded-lg bg-gray-50 dark:bg-[rgba(148,163,184,0.05)] p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-slate-400">Action</span>
            <span className={`font-bold ${orderSide === "buy" ? "text-green-500" : "text-red-500"}`}>
              {orderSide.toUpperCase()} {symbol}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-slate-400">Order Type</span>
            <span className="font-semibold dark:text-slate-100 capitalize">{orderType.replace("_", " ")}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-slate-400">Quantity</span>
            <span className="font-semibold dark:text-slate-100">{quantity} shares</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-slate-400">Price per Share</span>
            <span className="font-semibold dark:text-slate-100">${price.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 dark:border-[rgba(148,163,184,0.10)] pt-3">
            <span className="font-semibold dark:text-slate-100">Total Amount</span>
            <span className="text-lg font-bold dark:text-slate-100">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="mb-4 flex items-start gap-2 rounded-lg border border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 p-3">
          <AlertCircle className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
          <p className="text-sm text-blue-900 dark:text-blue-300">
            {orderType === "market"
              ? "Market orders are executed immediately at the best available price. The actual execution price may differ from the current market price."
              : "Your order will be placed with the specified price conditions and will execute when market conditions are met."}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-300 dark:border-[rgba(148,163,184,0.15)] px-4 py-2.5 font-medium text-gray-700 dark:text-slate-300 transition-colors hover:bg-gray-50 dark:hover:bg-[rgba(148,163,184,0.08)]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`flex-1 rounded-lg px-4 py-2.5 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              orderSide === "buy" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isSubmitting ? "Placing Order..." : "Confirm Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
