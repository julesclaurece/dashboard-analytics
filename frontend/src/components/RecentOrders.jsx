const STATUS_STYLES = {
  completed: "status-completed",
  pending: "status-pending",
  cancelled: "status-cancelled",
};

export default function RecentOrders({ data }) {
  return (
    <div className="chart-card table-card">
      <h3 className="chart-title">Recent Orders</h3>
      <div className="table-wrap">
        <table className="orders-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Category</th>
              <th>Country</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((o) => (
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
    </div>
  );
}
