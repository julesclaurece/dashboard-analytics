export default function KPICard({ title, value, growth, icon, prefix = "", suffix = "" }) {
  const isPositive = growth >= 0;

  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <span className="kpi-icon">{icon}</span>
        <span className={`kpi-badge ${isPositive ? "badge-up" : "badge-down"}`}>
          {isPositive ? "▲" : "▼"} {Math.abs(growth)}%
        </span>
      </div>
      <div className="kpi-value">
        {prefix}{typeof value === "number" ? value.toLocaleString() : value}{suffix}
      </div>
      <div className="kpi-title">{title}</div>
      <div className="kpi-sub">vs previous period</div>
    </div>
  );
}
