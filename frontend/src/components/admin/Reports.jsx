// src/pages/admin/Reports.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/productSlice";
import { fetchOrders } from "../../redux/orderSlice";
import { fetchCustomers } from "../../redux/customerSlice";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

/* ---------------------------
   Custom Tooltip
---------------------------- */
const CustomTooltip = ({ active, payload, label, currency = false }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 sm:p-3 shadow-md rounded-md border border-gray-200">
        <p className="text-gray-600 text-xs sm:text-sm font-medium">{label}</p>
        <p className={currency ? "text-green-600 font-bold" : "text-blue-600 font-bold"}>
          {currency ? "$" : ""}
          {payload[0].value.toLocaleString()}
          {currency ? ".00" : ""}
        </p>
      </div>
    );
  }
  return null;
};

/* ---------------------------
   Pie Chart Label
---------------------------- */
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-[10px] sm:text-xs"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Reports() {
  const dispatch = useDispatch();
  const [timeFilter, setTimeFilter] = useState("all");

  const products = useSelector((s) => s.products.items || []);
  const orders = useSelector((s) => s.orders.items || []);
  const customers = useSelector((s) => s.customers.items || []);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());
    dispatch(fetchCustomers());
  }, [dispatch]);

  /* ---------------------------
     Filtered Data
  ---------------------------- */
  const filteredOrders = React.useMemo(() => {
    const now = new Date();
    let cutoffDate = new Date(0);

    if (timeFilter === "monthly") {
      cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
    } else if (timeFilter === "quarterly") {
      cutoffDate = new Date(now.setMonth(now.getMonth() - 3));
    } else if (timeFilter === "yearly") {
      cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
    }

    return orders.filter((order) => {
      if (timeFilter === "all") return true;
      return new Date(order.createdAt) >= cutoffDate;
    });
  }, [orders, timeFilter]);

  const revenueByMonth = filteredOrders.reduce((acc, o) => {
    const month = new Date(o.createdAt).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + Number(o.total || 0);
    return acc;
  }, {});
  const revenueData = Object.keys(revenueByMonth).map((m) => ({
    month: m,
    revenue: revenueByMonth[m],
  }));

  const ordersByMonth = filteredOrders.reduce((acc, o) => {
    const month = new Date(o.createdAt).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const ordersData = Object.keys(ordersByMonth).map((m) => ({
    month: m,
    orders: ordersByMonth[m],
  }));

  const productSales = {};
  filteredOrders.forEach((o) => {
    o.items?.forEach((item) => {
      productSales[item.productName] =
        (productSales[item.productName] || 0) + item.quantity;
    });
  });
  const topProducts = Object.entries(productSales)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const totalOrders = filteredOrders.length;
  const totalCustomers = customers.length;

  const paymentMethodsData = [
    { name: "Credit Card", value: filteredOrders.filter((o) => o.paymentMethod === "credit_card").length },
    { name: "PayPal", value: filteredOrders.filter((o) => o.paymentMethod === "paypal").length },
    { name: "Cash", value: filteredOrders.filter((o) => o.paymentMethod === "cash").length },
    { name: "Other", value: filteredOrders.filter((o) => !["credit_card", "paypal", "cash"].includes(o.paymentMethod)).length },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1 sm:mt-2">
            Business insights and performance analytics
          </p>
        </div>
        <div className="mt-3 md:mt-0">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 text-sm sm:text-base rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
          >
            <option value="all">All Time</option>
            <option value="monthly">Last Month</option>
            <option value="quarterly">Last Quarter</option>
            <option value="yearly">Last Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
        {/* Revenue */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 sm:p-6 rounded-xl shadow-md border border-blue-100">
          <p className="text-blue-600 text-xs sm:text-sm font-medium uppercase">Total Revenue</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>
        {/* Orders */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl shadow-md border border-purple-100">
          <p className="text-purple-600 text-xs sm:text-sm font-medium uppercase">Total Orders</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{totalOrders}</p>
        </div>
        {/* Customers */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 sm:p-6 rounded-xl shadow-md border border-green-100">
          <p className="text-green-600 text-xs sm:text-sm font-medium uppercase">Total Customers</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{totalCustomers}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-10">
        {/* Revenue */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Revenue by Month</h2>
          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip content={<CustomTooltip currency={true} />} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Orders by Month</h2>
          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer>
              <BarChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Top Products */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 lg:col-span-2">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Top Selling Products</h2>
          {topProducts.length === 0 ? (
            <p className="text-gray-500 text-sm">No sales data available.</p>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {topProducts.map((p, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-md bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-800 font-bold text-sm sm:text-base">{idx + 1}</span>
                  </div>
                  <div className="ml-3 sm:ml-4 flex-1">
                    <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{p.name}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${(p.qty / topProducts[0].qty) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <span className="text-xs sm:text-sm font-semibold text-gray-900">{p.qty} units</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Payment Methods</h2>
          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  dataKey="value"
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 mt-6 sm:mt-10">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Order ID", "Date", "Customer", "Amount", "Status"].map((h) => (
                  <th key={h} className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.slice(0, 5).map((order, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-2 sm:py-4 font-medium text-gray-900">#{order._id?.substring(0, 8) || "N/A"}</td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-gray-500">{order.customerName || "Guest"}</td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-gray-900">${order.total?.toFixed(2) || "0.00"}</td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"}`}
                    >
                      {order.status || "unknown"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
