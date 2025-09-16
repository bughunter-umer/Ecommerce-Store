import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";
import { fetchOrders } from "../redux/orderSlice";
import { fetchCustomers } from "../redux/customerSlice";
import { useNavigate } from "react-router-dom";
import API from "../api";

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

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());
    dispatch(fetchCustomers());
  }, [dispatch]);

  // Revenue calculation
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);

  // Recent activity dynamically
  const recentActivity = [
    ...orders
      .slice(-5)
      .reverse()
      .map((o) => ({
        type: "order",
        message: `New order #${o.id} placed by ${o.customerName || "Customer"}`,
        time: o.createdAt,
      })),
    ...customers
      .slice(-5)
      .reverse()
      .map((c) => ({
        type: "customer",
        message: `New customer registered: ${c.name}`,
        time: c.createdAt,
      })),
  ].sort((a, b) => new Date(b.time) - new Date(a.time));

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Ecommerce Overview</h1>
        <p className="text-gray-600 mb-8">Your store performance at a glance</p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow">
            <h2 className="font-semibold">Products</h2>
            <p className="text-3xl font-bold">{products.length}</p>
          </div>
          <div className="bg-purple-500 text-white p-6 rounded-xl shadow">
            <h2 className="font-semibold">Customers</h2>
            <p className="text-3xl font-bold">{customers.length}</p>
          </div>
          <div className="bg-amber-500 text-white p-6 rounded-xl shadow">
            <h2 className="font-semibold">Orders</h2>
            <p className="text-3xl font-bold">{orders.length}</p>
          </div>
          <div className="bg-green-500 text-white p-6 rounded-xl shadow">
            <h2 className="font-semibold">Revenue</h2>
            <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            {recentActivity.length === 0 ? (
              <p className="text-gray-500">No recent activity</p>
            ) : (
              recentActivity.map((act, idx) => (
                <div key={idx} className="mb-3 p-3 border rounded bg-gray-50">
                  <p>{act.message}</p>
                  <span className="text-xs text-gray-400">
                    {new Date(act.time).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                className="bg-blue-500 text-white p-3 rounded"
                onClick={() => setOpenAddProduct(true)}
              >
                Add Product
              </button>
              <button
                className="bg-green-500 text-white p-3 rounded"
                onClick={() => navigate("/reports")}
              >
                View Reports
              </button>
              <button
                className="bg-purple-500 text-white p-3 rounded"
                onClick={() => navigate("/users")}
              >
                Manage Users
              </button>
              <button
                className="bg-amber-500 text-white p-3 rounded"
                onClick={() => navigate("/orders")}
              >
                Process Orders
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {openAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Add Product</h2>
            <input
              type="text"
              placeholder="Product Name"
              className="w-full p-2 mb-2 border rounded"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              className="w-full p-2 mb-2 border rounded"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Price"
              className="w-full p-2 mb-2 border rounded"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <input
              type="number"
              placeholder="Stock"
              className="w-full p-2 mb-4 border rounded"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border rounded"
                onClick={() => setOpenAddProduct(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={saveProduct}
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
