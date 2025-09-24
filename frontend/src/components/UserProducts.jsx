// src/pages/UserProducts.jsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import API from "../api"; // Axios instance
import { saveOrder, fetchOrders } from "../redux/orderSlice";

export default function UserProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    quantity: 1,
  });

  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const openModal = (product) => {
    setSelectedProduct(product);
    setForm({
      name: user.name || "",
      email: user.email || "",
      address: "",
      quantity: 1,
    });
    setOpen(true);
  };

  const handleBuy = async () => {
    if (!form.name || !form.email || !form.address || !form.quantity) {
      return alert("Please fill all fields!");
    }

    const total = selectedProduct.price * Number(form.quantity);

    const payload = {
      customer_id: userId,
      name: form.name,
      email: form.email,
      address: form.address,
      total,
      items: [
        {
          productId: selectedProduct.id,
          qty: Number(form.quantity),
        },
      ],
      status: "Pending",
    };

    try {
      await dispatch(saveOrder(payload));
      dispatch(fetchOrders());
      setOpen(false);
      alert(`Order for ${selectedProduct.name} placed successfully!`);
    } catch (err) {
      console.error(err);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center sm:text-left">
        Products
      </h1>

      {loading ? (
        <div className="text-center py-6">Loading...</div>
      ) : error ? (
        <div className="text-center py-6 text-red-500">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-6">No products found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold mb-2">{p.name}</h2>
                <p className="text-gray-700 mb-2">Price: ${p.price}</p>
                {p.description && (
                  <p className="text-gray-500 text-sm">{p.description}</p>
                )}
              </div>
              <button
                onClick={() => openModal(p)}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 w-full sm:w-auto"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Buy Now Modal */}
      {open && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              Buy {selectedProduct.name}
            </h2>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Name:</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Email:</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">
                  Address:
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">
                  Quantity:
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-200 w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleBuy}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 w-full sm:w-auto"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
