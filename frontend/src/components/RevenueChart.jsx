import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const fmt = (v) => `$${(v / 1000).toFixed(1)}k`;

export default function RevenueChart({ data }) {
  return (
    <div className="chart-card">
      <h3 className="chart-title">Revenue Over Time</h3>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2433" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} tickFormatter={(d) => d.slice(5)} />
          <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickFormatter={fmt} />
          <Tooltip
            contentStyle={{ background: "#0f1117", border: "1px solid #1e2433", borderRadius: 8 }}
            labelStyle={{ color: "#e5e7eb" }}
            formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]}
          />
          <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#colorRevenue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
