import { useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const generateChartData = () => {
  const data: { time: string; price: number }[] = [];
  const basePrice = 173.5;

  for (let i = 0; i < 50; i += 1) {
    const time = `${9 + Math.floor(i / 6)}:${((i * 10) % 60).toString().padStart(2, "0")}`;
    const variance = Math.random() * 4 - 2;
    const price = basePrice + variance + i * 0.04;
    data.push({
      time,
      price: Number.parseFloat(price.toFixed(2)),
    });
  }

  return data;
};

export function StockChart() {
  const [timeframe, setTimeframe] = useState("1D");
  const data = useMemo(() => generateChartData(), []);

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
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
          />
          <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
