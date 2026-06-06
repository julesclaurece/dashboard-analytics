export default function PlaceholderPage({ icon, title, description }) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon">{icon}</div>
      <h2 className="placeholder-title">{title}</h2>
      <p className="placeholder-desc">{description}</p>
      <span className="placeholder-badge">Coming soon</span>
    </div>
  );
}
