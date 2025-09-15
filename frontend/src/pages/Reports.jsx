import React, { useEffect, useState } from "react";
import API from "../api";
import Chart from "../components/Chart";
import { addDays, startOfWeek, startOfMonth, format } from "date-fns";

export default function Reports() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState("daily"); // daily | weekly | monthly

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [custRes, prodRes, orderRes] = await Promise.all([
          API.get("/customers"),
          API.get("/products"),
          API.get("/orders"),
        ]);

        setCustomers(custRes.data?.data || custRes.data || []);
        setProducts(prodRes.data?.data || prodRes.data || []);
        setOrders(orderRes.data?.data || orderRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch report data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate totals
  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.total || 0),
    0
  );
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const totalProducts = products.length;

  // Helper: format chart data based on report type
  const getChartData = () => {
    const map = {};

    orders.forEach((o) => {
      if (!o.created_at) return;
      const dateObj = new Date(o.created_at);
      let key;

      if (reportType === "daily") {
        key = format(dateObj, "yyyy-MM-dd");
      } else if (reportType === "weekly") {
        const weekStart = startOfWeek(dateObj, { weekStartsOn: 1 }); // Monday
        key = format(weekStart, "yyyy-MM-dd");
      } else if (reportType === "monthly") {
        const monthStart = startOfMonth(dateObj);
        key = format(monthStart, "yyyy-MM");
      }

      if (!map[key]) map[key] = 0;
      map[key] += Number(o.total || 0);
    });

    return Object.keys(map)
      .sort()
      .map((k) => ({ date: k, revenue: map[k] }));
  };

  const chartData = getChartData();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600 mb-8">Track your business performance and key metrics</p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-exclamation-circle text-red-400 text-xl"></i>
              </div>
              <div className="ml-3">
                <h3 className="text-red-800 font-medium">Error loading data</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-50">
                    <i className="fas fa-users text-blue-500 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500 text-sm font-medium">Total Customers</p>
                    <h3 className="text-2xl font-bold text-gray-800">{totalCustomers}</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-50">
                    <i className="fas fa-box text-green-500 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500 text-sm font-medium">Total Products</p>
                    <h3 className="text-2xl font-bold text-gray-800">{totalProducts}</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-purple-50">
                    <i className="fas fa-shopping-cart text-purple-500 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                    <h3 className="text-2xl font-bold text-gray-800">{totalOrders}</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-indigo-50">
                    <i className="fas fa-dollar-sign text-indigo-500 text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-gray-800">${totalRevenue.toFixed(2)}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart for Revenue Over Time */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Revenue Over Time</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setReportType("daily")}
                    className={`px-3 py-1 text-sm rounded-md ${
                      reportType === "daily"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => setReportType("weekly")}
                    className={`px-3 py-1 text-sm rounded-md ${
                      reportType === "weekly"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setReportType("monthly")}
                    className={`px-3 py-1 text-sm rounded-md ${
                      reportType === "monthly"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              <Chart data={chartData} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
