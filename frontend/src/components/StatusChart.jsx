import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = { completed: "#22c55e", pending: "#f59e0b", cancelled: "#ef4444" };

export default function StatusChart({ data }) {
  return (
    <div className="chart-card">
      <h3 className="chart-title">Orders by Status</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} innerRadius={45}>
            {data.map((entry, i) => (
              <Cell key={i} fill={COLORS[entry.status] || "#6366f1"} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "#0f1117", border: "1px solid #1e2433", borderRadius: 8 }}
            formatter={(v, name) => [v, name]}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
