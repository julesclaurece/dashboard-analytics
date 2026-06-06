import { useState, useEffect, useCallback } from "react";
import {
  fetchKPIs,
  fetchRevenueOverTime,
  fetchByCategory,
  fetchByStatus,
  fetchTopCountries,
  fetchRecentOrders,
} from "../api/client";

export function useDashboard() {
  const [period, setPeriod] = useState("30d");
  const [kpis, setKpis] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [k, rev, cat, stat, country, orders] = await Promise.all([
        fetchKPIs(period),
        fetchRevenueOverTime(period),
        fetchByCategory(period),
        fetchByStatus(period),
        fetchTopCountries(period),
        fetchRecentOrders(),
      ]);
      setKpis(k);
      setRevenueData(rev);
      setCategoryData(cat);
      setStatusData(stat);
      setCountryData(country);
      setRecentOrders(orders);
    } catch (e) {
      setError("Failed to load data. Make sure the API is running.");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    load();
  }, [load]);

  return { period, setPeriod, kpis, revenueData, categoryData, statusData, countryData, recentOrders, loading, error, refresh: load };
}
