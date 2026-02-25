import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getStockBars } from "../api/stocks";

// Maps UI button labels to API timeframe param and how many days back to fetch
const TIMEFRAME_CONFIG: Record<string, { apiTimeframe: string; daysBack: number }> = {
  "1D": { apiTimeframe: "1Hour", daysBack: 1 },
  "1W": { apiTimeframe: "1Hour", daysBack: 7 },
  "1M": { apiTimeframe: "1Day", daysBack: 30 },
  "3M": { apiTimeframe: "1Day", daysBack: 90 },
  "1Y": { apiTimeframe: "1Week", daysBack: 365 },
  "ALL": { apiTimeframe: "1Month", daysBack: 365 * 5 },
};

interface StockChartProps {
  symbol: string;
}

export function StockChart({ symbol }: StockChartProps) {
  const [timeframe, setTimeframe] = useState("1D");
  const [data, setData] = useState<{ time: string; price: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { apiTimeframe, daysBack } = TIMEFRAME_CONFIG[timeframe];
    const start = new Date();
    start.setDate(start.getDate() - daysBack);

    setIsLoading(true);
    getStockBars(symbol, apiTimeframe, start.toISOString()).then((bars) => {
      // Map 'close' to 'price' so the chart dataKey stays consistent
      setData(bars.map((bar) => ({ time: bar.time, price: bar.close })));
      setIsLoading(false);
    });
  }, [symbol, timeframe]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold">Price Chart</h3>
        <div className="flex gap-2">
          {["1D", "1W", "1M", "3M", "1Y", "ALL"].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                timeframe === tf ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-[300px] items-center justify-center text-gray-400">Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              domain={["dataMin - 1", "dataMax + 1"]}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value: number | undefined) => value !== undefined ? [`$${value.toFixed(2)}`, "Price"] : ["—", "Price"]}
            />
            <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
