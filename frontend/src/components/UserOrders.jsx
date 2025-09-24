import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/orderSlice";
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

  // Open modal
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

  // Save order
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
      items: [{ productId: Number(productId), qty: Number(quantity) }],
    };

    try {
      if (editing) {
        await API.put(`/orders/${editing.id}`, payload);
      } else {
        await API.post("/orders", payload);
      }
      dispatch(fetchOrders());
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

  const userOrders = orders.filter(
    (o) => o.email.toLowerCase() === (user.email || "").toLowerCase()
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl md:text-2xl font-bold mb-4 text-center md:text-left">
        My Orders
      </h1>

      <div className="flex justify-center md:justify-start mb-4">
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 w-full md:w-auto"
        >
          Add Order
        </button>
      </div>

      {/* Responsive table wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] table-auto border-collapse border border-gray-300 text-sm md:text-base">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="border px-3 md:px-4 py-2">Product</th>
              <th className="border px-3 md:px-4 py-2">Quantity</th>
              <th className="border px-3 md:px-4 py-2">Total</th>
              <th className="border px-3 md:px-4 py-2">Actions</th>
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
                  <tr key={o.id} className="text-center">
                    <td className="border px-3 md:px-4 py-2">{item.title}</td>
                    <td className="border px-3 md:px-4 py-2">{item.qty}</td>
                    <td className="border px-3 md:px-4 py-2">
                      ${o.total.toFixed(2)}
                    </td>
                    <td className="border px-3 md:px-4 py-2 flex flex-col md:flex-row justify-center gap-2">
                      <button
                        onClick={() => openModal(o)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(o.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500"
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

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded w-full max-w-md shadow-lg">
            <h2 className="text-lg md:text-xl font-bold mb-4 text-center">
              {editing ? "Edit Order" : "Add Order"}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block mb-1 text-sm">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full p-2 border rounded text-sm"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full p-2 border rounded text-sm"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  className="w-full p-2 border rounded text-sm"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Product</label>
                <select
                  value={form.productId}
                  onChange={(e) =>
                    setForm({ ...form, productId: e.target.value })
                  }
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - ${p.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: e.target.value })
                  }
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-end gap-2 mt-4">
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
