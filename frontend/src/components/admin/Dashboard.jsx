import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/productSlice";
import { fetchOrders } from "../../redux/orderSlice";
import { fetchCustomers } from "../../redux/customerSlice";
import { useNavigate } from "react-router-dom";
import API from "../../api";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector((s) => s.products.items || []);
  const orders = useSelector((s) => s.orders.items || []);
  const customers = useSelector((s) => s.customers.items || []);

  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    const activities = [
      ...orders.slice(-5).reverse().map((o) => ({
        id: `order-${o.id}`,
        type: "order",
        message: `New order #${o.id} placed by ${o.customerName || "Customer"}`,
        time: o.createdAt,
      })),
      ...customers.slice(-5).reverse().map((c) => ({
        id: `customer-${c.id}`,
        type: "customer",
        message: `New customer registered: ${c.name}`,
        time: c.createdAt,
      })),
    ].sort((a, b) => new Date(b.time) - new Date(a.time));

    setRecentActivity(activities);
  }, [orders, customers]);

  const removeActivity = (id) => {
    setRecentActivity((prev) => prev.filter((act) => act.id !== id));
  };

  const saveProduct = async () => {
    if (!form.name || !form.description || !form.price || !form.stock)
      return alert("Please fill all fields!");
    try {
      await API.post("/products", form);
      setOpenAddProduct(false);
      dispatch(fetchProducts());
      setForm({ name: "", description: "", price: "", stock: "" });
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
        Admin Dashboard
      </h1>
      <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
        Your store performance at a glance
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
        {/* Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 sm:p-6 rounded-xl shadow-md hover:scale-105 transition-transform">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-medium text-blue-100">Products</h2>
              <p className="text-2xl sm:text-3xl font-bold mt-2">{products.length}</p>
            </div>
            <div className="bg-blue-400 p-2 sm:p-3 rounded-lg">
              📦
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-5 sm:p-6 rounded-xl shadow-md hover:scale-105 transition-transform">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-medium text-purple-100">Customers</h2>
              <p className="text-2xl sm:text-3xl font-bold mt-2">{customers.length}</p>
            </div>
            <div className="bg-purple-400 p-2 sm:p-3 rounded-lg">👤</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-5 sm:p-6 rounded-xl shadow-md hover:scale-105 transition-transform">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-medium text-amber-100">Orders</h2>
              <p className="text-2xl sm:text-3xl font-bold mt-2">{orders.length}</p>
            </div>
            <div className="bg-amber-400 p-2 sm:p-3 rounded-lg">🛒</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-5 sm:p-6 rounded-xl shadow-md hover:scale-105 transition-transform">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-medium text-green-100">Revenue</h2>
              <p className="text-2xl sm:text-3xl font-bold mt-2">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-green-400 p-2 sm:p-3 rounded-lg">💰</div>
          </div>
        </div>
      </div>

      {/* Activity + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {/* Activity */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Recent Activity</h2>
            <span className="text-xs sm:text-sm text-gray-500">{recentActivity.length} activities</span>
          </div>

          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mt-2 text-sm">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto pr-1 sm:pr-2">
              {recentActivity.map((act) => (
                <div
                  key={act.id}
                  className="p-3 sm:p-4 border border-gray-100 rounded-lg bg-gray-50 hover:bg-white transition-colors flex justify-between items-start"
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`rounded-full p-2 ${
                        act.type === "order"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {act.type === "order" ? "🛒" : "👤"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm sm:text-base">
                        {act.message}
                      </p>
                      <span className="text-xs text-gray-500 block mt-1">
                        {new Date(act.time).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeActivity(act.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
            Quick Actions
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <button
              className="w-full p-3 sm:p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors text-sm sm:text-base"
              onClick={() => setOpenAddProduct(true)}
            >
              ➕ Add Product
            </button>
            <button
              className="w-full p-3 sm:p-4 bg-green-50 text-green-700 rounded-lg border border-green-100 hover:bg-green-100 transition-colors text-sm sm:text-base"
              onClick={() => navigate("/admin/reports")}
            >
              📊 View Reports
            </button>
            <button
              className="w-full p-3 sm:p-4 bg-purple-50 text-purple-700 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors text-sm sm:text-base"
              onClick={() => navigate("/admin/users")}
            >
              👥 Manage Users
            </button>
            <button
              className="w-full p-3 sm:p-4 bg-amber-50 text-amber-700 rounded-lg border border-amber-100 hover:bg-amber-100 transition-colors text-sm sm:text-base"
              onClick={() => navigate("/admin/orders")}
            >
              📦 Process Orders
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {openAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-3">
          <div className="bg-white p-5 sm:p-6 rounded-xl w-full max-w-sm sm:max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Add Product</h2>
              <button
                onClick={() => setOpenAddProduct(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✖
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                className="w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
              />
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description"
                className="w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
              />
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="Price"
                className="w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
              />
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="Stock"
                className="w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-5">
              <button
                onClick={() => setOpenAddProduct(false)}
                className="px-4 py-2 border rounded-lg text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={saveProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm sm:text-base"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
