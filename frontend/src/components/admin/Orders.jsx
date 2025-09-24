import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, saveOrder, deleteOrder } from "../../redux/orderSlice";
import API from "../../api";

export default function Orders() {
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
    quantity: "",
  });

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await API.get("/products");
        setProducts(
          (Array.isArray(prodRes.data) ? prodRes.data : []).map((p) => ({
            ...p,
            price: Number(p.price || 0),
            id: String(p.id),
          }))
        );
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchData();
  }, []);

  const openModal = (order = null) => {
    if (order) {
      setEditing(order);
      setForm({
        name: order.name || "",
        email: order.email || "",
        address: order.address || "",
        productId: order.items?.[0]?.productId || "",
        quantity: order.items?.[0]?.qty?.toString() || "",
      });
    } else {
      setEditing(null);
      setForm({
        name: "",
        email: "",
        address: "",
        productId: "",
        quantity: "",
      });
    }
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email || !form.address || !form.productId || !form.quantity) {
      return alert("Please fill all fields!");
    }

    const product = products.find((p) => p.id === form.productId);
    const total = product ? product.price * Number(form.quantity) : 0;

    const payload = {
      name: form.name,
      email: form.email,
      address: form.address,
      total,
      items: [
        {
          productId: Number(form.productId),
          qty: Number(form.quantity),
        },
      ],
    };

    if (editing?.id) payload.id = editing.id;

    await dispatch(saveOrder(payload));
    setOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await dispatch(deleteOrder(id));
    }
  };

  const getProductName = (id) =>
    products.find((p) => String(p.id) === String(id))?.name || `ID: ${id}`;

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
              Manage customer orders and details
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="mt-3 sm:mt-0 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Order
          </button>
        </div>

        {/* Orders Table (mobile scrollable) */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm sm:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-3 sm:px-6 py-8 sm:py-12 text-center text-sm">
                      Loading orders...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="px-3 sm:px-6 py-8 text-center text-red-500 text-sm">
                      Error loading orders
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-3 sm:px-6 py-8 text-center text-gray-500 text-sm">
                      No orders found. Add one!
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">{o.name}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">{o.email}</td>
                      <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">{o.address}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                        {o.items?.map((item) => (
                          <div key={item.id || item.productId}>
                            {getProductName(item.productId)} <span className="text-gray-400">(x{item.qty})</span>
                          </div>
                        ))}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-sm sm:text-base">${o.total?.toFixed(2)}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 flex space-x-2">
                        <button
                          onClick={() => openModal(o)}
                          className="text-indigo-600 hover:text-indigo-900 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(o.id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm sm:max-w-md">
            <div className="px-4 sm:px-6 py-3 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {editing ? "Edit Order" : "Create Order"}
              </h2>
            </div>

            <div className="px-4 sm:px-6 py-4 space-y-3 sm:space-y-4 text-sm sm:text-base">
              {/* Customer Name */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="john@example.com"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="123 Main St"
                />
              </div>

              {/* Product */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Product</label>
                <select
                  value={form.productId}
                  onChange={(e) => setForm({ ...form, productId: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - ${p.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="1"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="px-4 sm:px-6 py-3 bg-gray-50 flex justify-end space-x-2 sm:space-x-3">
              <button
                onClick={() => setOpen(false)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-xs sm:text-sm"
              >
                {editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
