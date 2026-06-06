import { useState, useEffect } from "react";
import { fetchProducts } from "../api/client";

const CATEGORY_COLORS = {
  Electronics: "#6366f1",
  Clothing:    "#8b5cf6",
  Books:       "#a78bfa",
  Home:        "#22c55e",
  Sports:      "#f59e0b",
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts().then(setProducts).finally(() => setLoading(false));
  }, []);

  const maxRevenue = products[0]?.revenue || 1;
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <div className="table-toolbar">
        <p className="text-muted" style={{ fontSize: 13 }}>{filtered.length} products</p>
        <input
          className="search-input"
          placeholder="Search product or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state"><div className="spinner" /></div>
      ) : (
        <div className="products-grid">
          {filtered.map((p, i) => (
            <div key={i} className="product-card">
              <div className="product-header">
                <span className="product-category" style={{ background: CATEGORY_COLORS[p.category] + "22", color: CATEGORY_COLORS[p.category] }}>
                  {p.category}
                </span>
                <span className="text-muted" style={{ fontSize: 12 }}>{p.sales} sales</span>
              </div>
              <div className="product-name">{p.name}</div>
              <div className="product-price">avg ${p.avg_price.toLocaleString()}</div>
              <div className="product-bar-wrap">
                <div className="product-bar" style={{ width: `${(p.revenue / maxRevenue) * 100}%`, background: CATEGORY_COLORS[p.category] }} />
              </div>
              <div className="product-revenue">${p.revenue.toLocaleString()} total</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
