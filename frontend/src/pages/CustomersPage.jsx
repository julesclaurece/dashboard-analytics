import { useState, useEffect } from "react";
import { fetchCustomers } from "../api/client";

export default function CustomersPage() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCustomers({ page, limit: 12, search: search || undefined })
      .then(setData)
      .finally(() => setLoading(false));
  }, [page, search]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); setSearch(searchInput); };

  return (
    <div className="page-content">
      <div className="table-toolbar">
        <p className="text-muted" style={{ fontSize: 13 }}>{data?.total ?? "–"} customers</p>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            className="search-input"
            placeholder="Search by name or email…"
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
                    <th>#</th><th>Name</th><th>Email</th><th>Country</th>
                    <th>Orders</th><th>Total Spent</th><th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items.map((c) => (
                    <tr key={c.id}>
                      <td className="text-muted">{c.id}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className="customer-avatar">{c.name[0]}</div>
                          {c.name}
                        </div>
                      </td>
                      <td className="text-muted">{c.email}</td>
                      <td>{c.country}</td>
                      <td>{c.total_orders}</td>
                      <td className="amount">${c.total_spent.toLocaleString()}</td>
                      <td className="text-muted">{c.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span className="pagination-info">{data?.total} customers</span>
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
