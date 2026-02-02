import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type Timeline = 'hours' | 'days' | 'months' | 'years';

interface ChartPoint {
  time: string;
  value: number;
}

// Dummy data per timeline
const DATA_BY_TIMELINE: Record<Timeline, ChartPoint[]> = {
  hours: [
    { time: '9:00 AM', value: 44200 },
    { time: '10:00 AM', value: 44500 },
    { time: '11:00 AM', value: 44100 },
    { time: '12:00 PM', value: 44800 },
    { time: '1:00 PM', value: 45200 },
    { time: '2:00 PM', value: 44900 },
    { time: '3:00 PM', value: 45500 },
    { time: '4:00 PM', value: 45320 },
  ],
  days: [
    { time: 'Mon', value: 43800 },
    { time: 'Tue', value: 44200 },
    { time: 'Wed', value: 44100 },
    { time: 'Thu', value: 44800 },
    { time: 'Fri', value: 45200 },
    { time: 'Sat', value: 45100 },
    { time: 'Sun', value: 45320 },
  ],
  months: [
    { time: 'Jul', value: 41200 },
    { time: 'Aug', value: 42500 },
    { time: 'Sep', value: 41800 },
    { time: 'Oct', value: 43200 },
    { time: 'Nov', value: 44100 },
    { time: 'Dec', value: 44800 },
    { time: 'Jan', value: 45320 },
  ],
  years: [
    { time: '2020', value: 38000 },
    { time: '2021', value: 39500 },
    { time: '2022', value: 37200 },
    { time: '2023', value: 41800 },
    { time: '2024', value: 45320 },
  ],
};

const TIMELINE_LABELS: Record<Timeline, string> = {
  hours: 'Hours',
  days: 'Days',
  months: 'Months',
  years: 'Years',
};

export const PerformanceChart = () => {
  const [timeline, setTimeline] = useState<Timeline>('days');
  const data = DATA_BY_TIMELINE[timeline];

  return (
    <div style={{ width: '100%', height: 350, padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h3 style={{ margin: 0, color: '#111827' }}>Performance History</h3>
        <div style={{ display: 'flex', gap: 4 }}>
          {(Object.keys(TIMELINE_LABELS) as Timeline[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTimeline(key)}
              style={{
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 500,
                border: '1px solid #e5e7eb',
                borderRadius: 6,
                background: timeline === key ? '#2563eb' : '#fff',
                color: timeline === key ? '#fff' : '#6b7280',
                cursor: 'pointer',
              }}
            >
              {TIMELINE_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Portfolio Value']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};