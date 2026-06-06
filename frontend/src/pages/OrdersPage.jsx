import { useState, useEffect } from "react";
import { fetchOrders } from "../api/client";

const STATUS_STYLES = {
  completed: "status-completed",
  pending: "status-pending",
  cancelled: "status-cancelled",
};

const STATUSES = ["all", "completed", "pending", "cancelled"];

export default function OrdersPage() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchOrders({ page, limit: 12, status: status === "all" ? undefined : status, search: search || undefined })
      .then(setData)
      .finally(() => setLoading(false));
  }, [page, status, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleStatus = (s) => { setStatus(s); setPage(1); };

  return (
    <div className="page-content">
      <div className="table-toolbar">
        <div className="filter-tabs">
          {STATUSES.map((s) => (
            <button key={s} className={`filter-tab ${status === s ? "active" : ""}`} onClick={() => handleStatus(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            className="search-input"
            placeholder="Search customer or product…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>

      <div className="chart-card table-card">
        {loading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : (
          <>
            <div className="table-wrap">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>#</th><th>Customer</th><th>Product</th><th>Category</th>
                    <th>Country</th><th>Amount</th><th>Status</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items.map((o) => (
                    <tr key={o.id}>
                      <td className="text-muted">{o.id}</td>
                      <td>{o.customer}</td>
                      <td>{o.product}</td>
                      <td><span className="category-tag">{o.category}</span></td>
                      <td>{o.country}</td>
                      <td className="amount">${o.amount.toLocaleString()}</td>
                      <td><span className={`status-badge ${STATUS_STYLES[o.status]}`}>{o.status}</span></td>
                      <td className="text-muted">{o.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <span className="pagination-info">{data?.total} orders</span>
              <div className="pagination-btns">
                <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                <span className="page-indicator">{page} / {data?.pages}</span>
                <button className="page-btn" disabled={page === data?.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
