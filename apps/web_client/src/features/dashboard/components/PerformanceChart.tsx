import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Mock data: This represents the "Performance" of the portfolio
const data = [
  { time: '9:30 AM', value: 4000 },
  { time: '10:00 AM', value: 4200 },
  { time: '10:30 AM', value: 4100 },
  { time: '11:00 AM', value: 4400 },
  { time: '11:30 AM', value: 4300 },
  { time: '12:00 PM', value: 4600 },
  { time: '12:30 PM', value: 4850 },
];

export const PerformanceChart = () => {
  return (
    // We add a little padding inside the chart container itself
    <div style={{ width: '100%', height: 350, padding: '10px' }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#111827' }}>Performance History</h3>
      
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12, fill: '#6b7280' }} 
            tickLine={false} 
            axisLine={false}
            dy={10} // Push labels down slightly
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            formatter={(value) => [`$${value}`, 'Portfolio Value']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb" /* Blue line usually looks better for 'Performance' */
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};