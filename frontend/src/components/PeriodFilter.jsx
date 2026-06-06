const PERIODS = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
  { label: "1 year", value: "1y" },
];

export default function PeriodFilter({ period, onChange }) {
  return (
    <div className="period-filter">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          className={`period-btn ${period === p.value ? "active" : ""}`}
          onClick={() => onChange(p.value)}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
