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

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label, currency = false }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
        <p className="text-gray-600 font-medium">{label}</p>
        <p className={currency ? "text-green-600 font-bold" : "text-blue-600 font-bold"}>
          {currency ? '$' : ''}{payload[0].value.toLocaleString()}{currency ? '.00' : ''}
        </p>
      </div>
    );
  }
  return null;
};

// Custom legend for pie chart
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Reports() {
  const dispatch = useDispatch();
  const [timeFilter, setTimeFilter] = useState("all"); // all, monthly, quarterly, yearly

  const products = useSelector((s) => s.products.items || []);
  const orders = useSelector((s) => s.orders.items || []);
  const customers = useSelector((s) => s.customers.items || []);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());
    dispatch(fetchCustomers());
  }, [dispatch]);

  // Filter orders based on time filter
  const filteredOrders = React.useMemo(() => {
    const now = new Date();
    let cutoffDate = new Date(0); // Default to all time

    if (timeFilter === "monthly") {
      cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
    } else if (timeFilter === "quarterly") {
      cutoffDate = new Date(now.setMonth(now.getMonth() - 3));
    } else if (timeFilter === "yearly") {
      cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
    }

    return orders.filter(order => {
      if (timeFilter === "all") return true;
      const orderDate = new Date(order.createdAt);
      return orderDate >= cutoffDate;
    });
  }, [orders, timeFilter]);

  // Revenue per month
  const revenueByMonth = filteredOrders.reduce((acc, o) => {
    const month = new Date(o.createdAt).toLocaleString("default", {
      month: "short",
    });
    acc[month] = (acc[month] || 0) + Number(o.total || 0);
    return acc;
  }, {});
  const revenueData = Object.keys(revenueByMonth).map((m) => ({
    month: m,
    revenue: revenueByMonth[m],
  }));

  // Orders per month
  const ordersByMonth = filteredOrders.reduce((acc, o) => {
    const month = new Date(o.createdAt).toLocaleString("default", {
      month: "short",
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const ordersData = Object.keys(ordersByMonth).map((m) => ({
    month: m,
    orders: ordersByMonth[m],
  }));

  // Top 5 selling products
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

  // Calculate totals
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const totalOrders = filteredOrders.length;
  const totalCustomers = customers.length;

  // Payment methods data for pie chart
  const paymentMethodsData = [
    { name: 'Credit Card', value: filteredOrders.filter(o => o.paymentMethod === 'credit_card').length },
    { name: 'PayPal', value: filteredOrders.filter(o => o.paymentMethod === 'paypal').length },
    { name: 'Cash', value: filteredOrders.filter(o => o.paymentMethod === 'cash').length },
    { name: 'Other', value: filteredOrders.filter(o => !['credit_card', 'paypal', 'cash'].includes(o.paymentMethod)).length },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Business insights and performance analytics</p>
        </div>
        <div className="mt-4 md:mt-0">
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
          >
            <option value="all">All Time</option>
            <option value="monthly">Last Month</option>
            <option value="quarterly">Last Quarter</option>
            <option value="yearly">Last Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl shadow-md border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium uppercase tracking-wide">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-blue-500 mt-2">
                <span className="inline-flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  +12.5% from last period
                </span>
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl shadow-md border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium uppercase tracking-wide">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{totalOrders.toLocaleString()}</p>
              <p className="text-xs text-purple-500 mt-2">
                <span className="inline-flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  +8.2% from last period
                </span>
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl shadow-md border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium uppercase tracking-wide">Total Customers</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{totalCustomers.toLocaleString()}</p>
              <p className="text-xs text-green-500 mt-2">
                <span className="inline-flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  +5.7% from last period
                </span>
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Revenue by Month</h2>
            <span className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
              {timeFilter === 'all' ? 'All Time' : 
               timeFilter === 'monthly' ? 'Last Month' : 
               timeFilter === 'quarterly' ? 'Last Quarter' : 'Last Year'}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" tickFormatter={(value) => `$${value/1000}k`} />
              <Tooltip content={<CustomTooltip currency={true} />} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Orders by Month</h2>
            <span className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
              {timeFilter === 'all' ? 'All Time' : 
               timeFilter === 'monthly' ? 'Last Month' : 
               timeFilter === 'quarterly' ? 'Last Quarter' : 'Last Year'}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="orders" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Top Products */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Top Selling Products</h2>
          {topProducts.length === 0 ? (
            <p className="text-gray-500">No sales data available.</p>
          ) : (
            <div className="space-y-4">
              {topProducts.map((p, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-800 font-bold">{idx + 1}</span>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${(p.qty / topProducts[0].qty) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className="text-sm font-semibold text-gray-900">{p.qty.toLocaleString()} units</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Payment Methods</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethodsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentMethodsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                formatter={(value, entry, index) => (
                  <span className="text-sm text-gray-600">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Recent Orders</h2>
        {filteredOrders.slice(0, 5).length === 0 ? (
          <p className="text-gray-500">No orders available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.slice(0, 5).map((order, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id?.substring(0, 8) || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customerName || 'Guest'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.total?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {order.status || 'unknown'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}