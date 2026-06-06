import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const client = axios.create({ baseURL: BASE_URL });

export const fetchKPIs = (period) => client.get(`/api/metrics/kpis?period=${period}`).then((r) => r.data);
export const fetchRevenueOverTime = (period) => client.get(`/api/metrics/revenue-over-time?period=${period}`).then((r) => r.data);
export const fetchByCategory = (period) => client.get(`/api/metrics/orders-by-category?period=${period}`).then((r) => r.data);
export const fetchByStatus = (period) => client.get(`/api/metrics/orders-by-status?period=${period}`).then((r) => r.data);
export const fetchTopCountries = (period) => client.get(`/api/metrics/top-countries?period=${period}`).then((r) => r.data);
export const fetchRecentOrders = () => client.get(`/api/metrics/recent-orders?limit=8`).then((r) => r.data);

export const fetchOrders = (params) => client.get("/api/orders", { params }).then((r) => r.data);
export const fetchProducts = () => client.get("/api/products").then((r) => r.data);
export const fetchCustomers = (params) => client.get("/api/customers", { params }).then((r) => r.data);
