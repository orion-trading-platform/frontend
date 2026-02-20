import { AlertCircle, X } from "lucide-react";

interface OrderConfirmationProps {
  orderSide: "buy" | "sell";
  orderType: string;
  symbol: string;
  quantity: number;
  price: number;
  totalAmount: number;
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
  onConfirm,
  onCancel,
}: OrderConfirmationProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">Confirm Order</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="size-5" />
          </button>
        </div>

        <div className="mb-4 space-y-3 rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Action</span>
            <span className={`font-bold ${orderSide === "buy" ? "text-green-500" : "text-red-500"}`}>
              {orderSide.toUpperCase()} {symbol}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Order Type</span>
            <span className="font-semibold capitalize">{orderType.replace("_", " ")}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Quantity</span>
            <span className="font-semibold">{quantity} shares</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Price per Share</span>
            <span className="font-semibold">${price.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 pt-3">
            <span className="font-semibold">Total Amount</span>
            <span className="text-lg font-bold">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="mb-4 flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
          <AlertCircle className="mt-0.5 size-5 flex-shrink-0 text-blue-600" />
          <p className="text-sm text-blue-900">
            {orderType === "market"
              ? "Market orders are executed immediately at the best available price. The actual execution price may differ from the current market price."
              : "Your order will be placed with the specified price conditions and will execute when market conditions are met."}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-lg px-4 py-2.5 font-medium text-white transition-colors ${
              orderSide === "buy" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}
