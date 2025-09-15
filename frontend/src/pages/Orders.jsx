import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/orderSlice";
import API from "../api";

export default function Orders() {
  const dispatch = useDispatch();
  const { items: orders, loading, error } = useSelector((s) => s.orders);

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    customerId: "",
    productId: "",
    quantity: "",
    status: "",
  });

  const statuses = ["Pending", "Processing", "Completed", "Cancelled"];

  // Fetch orders
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Fetch customers and products
  useEffect(() => {
  const fetchData = async () => {
    try {
      const custRes = await API.get("/customers");
      const prodRes = await API.get("/products");

      const custData = Array.isArray(custRes.data) 
        ? custRes.data 
        : custRes.data?.data || [];
      const prodData = Array.isArray(prodRes.data)
        ? prodRes.data
        : prodRes.data?.data || [];

      setCustomers(custData);
      setProducts(prodData.map((p) => ({
        ...p,
        price: Number(p.price || 0),
        id: String(p.id),
      })));
    } catch (err) {
      console.error("Error fetching customers/products:", err);
    }
  };
  fetchData();
}, []);


  // Open modal
  const openModal = (order = null) => {
    if (order) {
      setEditing(order);
      setForm({
        customerId: String(order.customer_id || ""),
        productId: String(order.product_id || ""),
        quantity: String(order.quantity || ""),
        status: order.status || "",
      });
    } else {
      setEditing(null);
      setForm({ customerId: "", productId: "", quantity: "", status: "" });
    }
    setOpen(true);
  };

  // Save order
  const saveOrder = async () => {
    if (!form.customerId || !form.productId || !form.quantity || !form.status) {
      return alert("Please fill all fields!");
    }

    try {
      const product = products.find((p) => p.id === form.productId);
      const total = product ? product.price * Number(form.quantity) : 0;

      const payload = {
        customer_id: Number(form.customerId),
        product_id: Number(form.productId),
        quantity: Number(form.quantity),
        total,
        status: form.status,
      };

      if (editing) {
        await API.put(`/orders/${editing.id}`, payload);
      } else {
        await API.post("/orders", payload);
      }

      setOpen(false);
      dispatch(fetchOrders());
    } catch (err) {
      console.error("Error saving order:", err.response?.data || err.message);
      alert("Error saving order");
    }
  };

  // Delete order
  const deleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await API.delete(`/orders/${id}`);
        dispatch(fetchOrders());
      } catch (err) {
        console.error("Error deleting order:", err.response?.data || err.message);
        alert("Error deleting order");
      }
    }
  };

  // Helpers
  const getCustomerName = (id) => {
    const c = customers.find((c) => String(c.id) === String(id));
    return c ? c.name : `ID: ${id}`;
  };
  const getProductName = (id) => {
    const p = products.find((p) => p.id === String(id));
    return p ? p.name : `ID: ${id}`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
  <div className="max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Order Management</h2>
        <p className="text-gray-600 mt-1">Track and manage all orders</p>
      </div>
      <button
        onClick={() => openModal()}
        className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={customers.length === 0 || products.length === 0}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add Order
      </button>
    </div>

    {loading && (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )}
    
    {error && (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error.error || "An error occurred while loading orders"}</p>
          </div>
        </div>
      </div>
    )}

    {!loading && orders.length === 0 && !error && (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
        <p className="mt-1 text-gray-500">Get started by creating your first order.</p>
        <div className="mt-6">
          <button
            onClick={() => openModal()}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={customers.length === 0 || products.length === 0}
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Order
          </button>
        </div>
        {(customers.length === 0 || products.length === 0) && (
          <p className="mt-3 text-sm text-amber-600">
            {customers.length === 0 && products.length === 0 
              ? "You need to add customers and products first" 
              : customers.length === 0 
                ? "You need to add customers first" 
                : "You need to add products first"}
          </p>
        )}
      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.length > 0 && orders.map((o) => (
        <div
          key={o.id}
          className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-xl text-gray-800">Order #{o.id}</h3>
              <div className="flex items-center mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  o.status === 'completed' ? 'bg-green-100 text-green-800' :
                  o.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  o.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {o.status}
                </span>
              </div>
            </div>
            <div className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
              ${o.total != null ? Number(o.total).toFixed(2) : "0.00"}
            </div>
          </div>
          
          <div className="mt-4 space-y-3">
            <div className="flex items-center text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>{o.customer_name || getCustomerName(o.customer_id)}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
              <span>{o.product_name || getProductName(o.product_id)}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <span>Quantity: {o.quantity}</span>
            </div>
          </div>
          
          <div className="flex gap-2 mt-5 pt-4 border-t border-gray-100">
            <button
              className="flex-1 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium flex items-center justify-center"
              onClick={() => openModal(o)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </button>
            <button
              className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium flex items-center justify-center"
              onClick={() => deleteOrder(o.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Modal */}
  {open && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-transform duration-300 scale-100 opacity-100">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800">
            {editing ? "Edit Order" : "Add New Order"}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={form.customerId}
              onChange={(e) =>
                setForm({ ...form, customerId: e.target.value })
              }
            >
              <option value="">Select Customer</option>
              {customers.length > 0 ? (
                customers.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))
              ) : (
                <option disabled>No customers available</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={form.productId}
              onChange={(e) =>
                setForm({ ...form, productId: e.target.value })
              }
            >
              <option value="">Select Product</option>
              {products.length > 0 ? (
                products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - ${p.price.toFixed(2)}
                  </option>
                ))
              ) : (
                <option disabled>No products available</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Quantity"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="">Select Status</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-7">
          <button
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            onClick={saveOrder}
          >
            {editing ? "Update Order" : "Add Order"}
          </button>
        </div>
      </div>
    </div>
  )}
</div>
  );
}
