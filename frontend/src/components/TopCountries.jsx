export default function TopCountries({ data }) {
  const max = data[0]?.revenue || 1;

  return (
    <div className="chart-card">
      <h3 className="chart-title">Top Countries</h3>
      <div className="country-list">
        {data.map((row, i) => (
          <div key={i} className="country-row">
            <div className="country-info">
              <span className="country-rank">#{i + 1}</span>
              <span className="country-name">{row.country}</span>
            </div>
            <div className="country-bar-wrap">
              <div className="country-bar" style={{ width: `${(row.revenue / max) * 100}%` }} />
            </div>
            <span className="country-value">${row.revenue.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
