import { useEffect, useState } from "react";
import { fetchKPIs, fetchByCategory, fetchTopCountries } from "../api/client";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";

const PERIODS = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
  { label: "1 year", value: "1y" },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState("30d");
  const [kpis, setKpis] = useState(null);
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchKPIs(period), fetchByCategory(period), fetchTopCountries(period)])
      .then(([k, c, co]) => { setKpis(k); setCategories(c); setCountries(co); })
      .finally(() => setLoading(false));
  }, [period]);

  const exportCSV = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Revenue", kpis.total_revenue],
      ["Total Orders", kpis.total_orders],
      ["New Users", kpis.new_users],
      ["Avg Order Value", kpis.avg_order_value],
      [],
      ["Category", "Revenue", "Orders"],
      ...categories.map((c) => [c.category, c.revenue, c.count]),
      [],
      ["Country", "Revenue", "Orders"],
      ...countries.map((c) => [c.country, c.revenue, c.orders]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `report-${period}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const radarData = categories.map((c) => ({ subject: c.category, revenue: c.revenue }));

  return (
    <div className="page-content">
      <div className="table-toolbar">
        <div className="filter-tabs">
          {PERIODS.map((p) => (
            <button key={p.value} className={`filter-tab ${period === p.value ? "active" : ""}`} onClick={() => setPeriod(p.value)}>
              {p.label}
            </button>
          ))}
        </div>
        <button className="export-btn" onClick={exportCSV} disabled={!kpis}>
          ↓ Export CSV
        </button>
      </div>

      {loading ? (
        <div className="loading-state"><div className="spinner" /></div>
      ) : (
        <>
          <div className="report-kpis">
            {[
              { label: "Revenue", value: `$${kpis.total_revenue.toLocaleString()}`, growth: kpis.revenue_growth },
              { label: "Orders", value: kpis.total_orders, growth: kpis.orders_growth },
              { label: "New Users", value: kpis.new_users, growth: kpis.users_growth },
              { label: "Avg Order", value: `$${kpis.avg_order_value.toLocaleString()}`, growth: kpis.revenue_growth },
            ].map((k) => (
              <div key={k.label} className="report-kpi-card">
                <div className="report-kpi-value">{k.value}</div>
                <div className="report-kpi-label">{k.label}</div>
                <span className={`kpi-badge ${k.growth >= 0 ? "badge-up" : "badge-down"}`}>
                  {k.growth >= 0 ? "▲" : "▼"} {Math.abs(k.growth)}%
                </span>
              </div>
            ))}
          </div>

          <div className="charts-row">
            <div className="chart-card">
              <h3 className="chart-title">Category Performance</h3>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#1e2433" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "#9ca3af" }} />
                  <Radar name="Revenue" dataKey="revenue" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                  <Tooltip contentStyle={{ background: "#0f1117", border: "1px solid #1e2433", borderRadius: 8 }} formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3 className="chart-title">Top Countries</h3>
              <div className="country-list" style={{ marginTop: 8 }}>
                {countries.map((c, i) => (
                  <div key={i} className="country-row">
                    <div className="country-info">
                      <span className="country-rank">#{i + 1}</span>
                      <span className="country-name">{c.country}</span>
                    </div>
                    <div className="country-bar-wrap">
                      <div className="country-bar" style={{ width: `${(c.revenue / countries[0].revenue) * 100}%` }} />
                    </div>
                    <span className="country-value">${c.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="chart-card table-card">
            <h3 className="chart-title">Category Breakdown</h3>
            <div className="table-wrap">
              <table className="orders-table">
                <thead>
                  <tr><th>Category</th><th>Revenue</th><th>Orders</th><th>Avg Order</th><th>Share</th></tr>
                </thead>
                <tbody>
                  {categories.map((c) => {
                    const totalRev = categories.reduce((a, b) => a + b.revenue, 0);
                    const share = ((c.revenue / totalRev) * 100).toFixed(1);
                    return (
                      <tr key={c.category}>
                        <td><span className="category-tag">{c.category}</span></td>
                        <td className="amount">${c.revenue.toLocaleString()}</td>
                        <td>{c.count}</td>
                        <td className="text-muted">${(c.revenue / c.count).toFixed(0)}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1, height: 4, background: "#1e2433", borderRadius: 2 }}>
                              <div style={{ width: `${share}%`, height: "100%", background: "#6366f1", borderRadius: 2 }} />
                            </div>
                            <span className="text-muted" style={{ fontSize: 12, width: 36 }}>{share}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
