import { useState } from "react";
import { useDashboard } from "./hooks/useDashboard";
import KPICard from "./components/KPICard";
import RevenueChart from "./components/RevenueChart";
import CategoryChart from "./components/CategoryChart";
import StatusChart from "./components/StatusChart";
import TopCountries from "./components/TopCountries";
import RecentOrders from "./components/RecentOrders";
import PeriodFilter from "./components/PeriodFilter";
import OrdersPage from "./pages/OrdersPage";
import ProductsPage from "./pages/ProductsPage";
import CustomersPage from "./pages/CustomersPage";
import ReportsPage from "./pages/ReportsPage";
import "./App.css";

const NAV = [
  { id: "dashboard", icon: "⊞", label: "Dashboard" },
  { id: "orders",    icon: "◷", label: "Orders" },
  { id: "products",  icon: "⊙", label: "Products" },
  { id: "customers", icon: "◉", label: "Customers" },
  { id: "reports",   icon: "≡", label: "Reports" },
];


export default function App() {
  const [page, setPage] = useState("dashboard");
  const {
    period, setPeriod,
    kpis, revenueData, categoryData, statusData, countryData, recentOrders,
    loading, error,
  } = useDashboard();

  const currentNav = NAV.find((n) => n.id === page);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">AnalyticsPro</span>
        </div>
        <nav className="nav">
          {NAV.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? "active" : ""}`}
              onClick={() => setPage(item.id)}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="avatar">JC</div>
          <div>
            <div className="user-name">Jules Claurece</div>
            <div className="user-role">Admin</div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="page-header">
          <div>
            <h1 className="page-title">{currentNav.label}</h1>
            <p className="page-sub">
              {page === "dashboard" ? "Welcome back — here's what's happening." : `Manage your ${currentNav.label.toLowerCase()}.`}
            </p>
          </div>
          {page === "dashboard" && <PeriodFilter period={period} onChange={setPeriod} />}
        </header>

        {page === "orders"    ? <OrdersPage /> :
         page === "products"  ? <ProductsPage /> :
         page === "customers" ? <CustomersPage /> :
         page === "reports"   ? <ReportsPage /> :
        (
          <>
            {error && <div className="error-banner">{error}</div>}

            {loading ? (
              <div className="loading-state">
                <div className="spinner" />
                <p>Loading metrics…</p>
              </div>
            ) : (
              <>
                <div className="kpi-grid">
                  <KPICard title="Total Revenue"    value={kpis.total_revenue}    growth={kpis.revenue_growth} icon="$" prefix="$" />
                  <KPICard title="Total Orders"     value={kpis.total_orders}     growth={kpis.orders_growth}  icon="◫" />
                  <KPICard title="New Users"        value={kpis.new_users}        growth={kpis.users_growth}   icon="◉" />
                  <KPICard title="Avg Order Value"  value={kpis.avg_order_value}  growth={kpis.revenue_growth} icon="⌀" prefix="$" />
                </div>

                <div className="charts-row">
                  <div className="chart-wide"><RevenueChart data={revenueData} /></div>
                  <StatusChart data={statusData} />
                </div>

                <div className="charts-row">
                  <CategoryChart data={categoryData} />
                  <TopCountries data={countryData} />
                </div>

                <RecentOrders data={recentOrders} />
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
