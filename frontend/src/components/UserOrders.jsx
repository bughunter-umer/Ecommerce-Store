import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, saveOrder, deleteOrder } from "../redux/orderSlice";
import API from "../api";

export default function UserOrders() {
  const dispatch = useDispatch();
  const { items: orders, loading, error } = useSelector((s) => s.orders);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    productId: "",
    quantity: 1,
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch orders on load
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Fetch products on load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(
          Array.isArray(res.data)
            ? res.data.map((p) => ({ ...p, price: Number(p.price || 0) }))
            : []
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  // Open modal for edit or add
  const openModal = (order = null) => {
    if (order) {
      setEditing(order);
      const item = order.items?.[0] || {};
      setForm({
        name: order.name || "",
        email: order.email || "",
        address: order.address || "",
        productId: item.productId || "",
        quantity: item.qty || 1,
      });
    } else {
      setEditing(null);
      setForm({
        name: user.name || "",
        email: user.email || "",
        address: "",
        productId: "",
        quantity: 1,
      });
    }
    setOpen(true);
  };

  // Save order (Add / Edit)
  const handleSave = async () => {
    const { name, email, address, productId, quantity } = form;
    if (!name || !email || !address || !productId || !quantity)
      return alert("Please fill all fields");

    const product = products.find((p) => p.id === Number(productId));
    if (!product) return alert("Invalid product selected");

    const payload = {
      id: editing?.id || undefined,
      name,
      email,
      address,
      total: product.price * Number(quantity),
      items: [
        {
          productId: Number(productId),
          qty: Number(quantity),
        },
      ],
    };

    try {
      if (editing) {
        await API.put(`/orders/${editing.id}`, payload);
      } else {
        await API.post("/orders", payload);
      }
      dispatch(fetchOrders()); // refresh orders
      setOpen(false);
      alert("Order saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save order");
    }
  };

  // Delete order
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await API.delete(`/orders/${id}`);
        dispatch(fetchOrders());
      } catch (err) {
        console.error(err);
        alert("Failed to delete order");
      }
    }
  };

  // Show only current user's orders by matching email
  const userOrders = orders.filter(
    (o) => o.email.toLowerCase() === (user.email || "").toLowerCase()
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      <button
        onClick={() => openModal()}
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
      >
        Add Order
      </button>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">Product</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Total</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-red-500">
                  {typeof error === "string"
                    ? error
                    : error?.error || "Something went wrong"}
                </td>
              </tr>
            ) : userOrders.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No orders found
                </td>
              </tr>
            ) : (
              userOrders.map((o) => {
                const item = o.items[0] || {};
                return (
                  <tr key={o.id}>
                    <td className="border px-4 py-2">{item.title}</td>
                    <td className="border px-4 py-2">{item.qty}</td>
                    <td className="border px-4 py-2">${o.total.toFixed(2)}</td>
                    <td className="border px-4 py-2 flex gap-2">
                      <button
                        onClick={() => openModal(o)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(o.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">
              {editing ? "Edit Order" : "Add Order"}
            </h2>

            <label className="block mb-2">Name:</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
            />

            <label className="block mb-2">Email:</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
            />

            <label className="block mb-2">Address:</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
            />

            <label className="block mb-2">Product:</label>
            <select
              value={form.productId}
              onChange={(e) => setForm({ ...form, productId: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - ${p.price}
                </option>
              ))}
            </select>

            <label className="block mb-2">Quantity:</label>
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
              >
                {editing ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
