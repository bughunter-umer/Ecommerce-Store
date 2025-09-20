import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  saveProduct,
  deleteProduct,
} from "../../redux/productSlice";

export default function Products() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.products);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  // load products on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // open modal for add / edit
  const openModal = (product = null) => {
    if (product) {
      setEditing(product);
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
      });
    } else {
      setEditing(null);
      setForm({ name: "", description: "", price: "", stock: "" });
    }
    setOpen(true);
  };

  // save product (calls Redux thunk)
  const handleSave = async () => {
    if (!form.name || !form.description || !form.price || !form.stock) {
      return alert("Please fill all fields!");
    }

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    await dispatch(saveProduct({ product: payload, editingId: editing?.id }));
    dispatch(fetchProducts()); // refresh list
    setOpen(false);
  };

  // delete product (calls Redux thunk)
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await dispatch(deleteProduct(id));
      dispatch(fetchProducts());
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Product Catalog
            </h2>
            <p className="text-gray-600 mt-1">
              Manage your product inventory
            </p>
          </div>
          <button
            className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg flex items-center"
            onClick={() => openModal()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Product
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-sm text-red-700">
              {error.error || "An error occurred while loading products"}
            </p>
          </div>
        )}

        {/* Empty */}
        {items.length === 0 && !loading && !error && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16m5 4h6v-4h-6v4z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No products yet
            </h3>
            <p className="mt-1 text-gray-500">
              Get started by adding your first product.
            </p>
            <div className="mt-6">
              <button
                onClick={() => openModal()}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Product
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-xl text-gray-800">
                  {p.name}
                </h3>
                <div className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                  ID: {p.id}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {p.description || "No description provided"}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-xs text-blue-600 font-medium mb-1">
                    Price
                  </div>
                  <div className="text-lg font-bold text-blue-800">
                    ${Number(p.price).toFixed(2)}
                  </div>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    p.stock > 10
                      ? "bg-green-50"
                      : p.stock > 0
                      ? "bg-amber-50"
                      : "bg-red-50"
                  }`}
                >
                  <div
                    className={`text-xs font-medium mb-1 ${
                      p.stock > 10
                        ? "text-green-600"
                        : p.stock > 0
                        ? "text-amber-600"
                        : "text-red-600"
                    }`}
                  >
                    Stock
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      p.stock > 10
                        ? "text-green-800"
                        : p.stock > 0
                        ? "text-amber-800"
                        : "text-red-800"
                    }`}
                  >
                    {p.stock}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  className="flex-1 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                  onClick={() => openModal(p)}
                >
                  Edit
                </button>
                <button
                  className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-800">
                  {editing ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  className="w-full p-3 border rounded-lg"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Description"
                  className="w-full p-3 border rounded-lg"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Price"
                    className="w-full p-3 border rounded-lg"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    className="w-full p-3 border rounded-lg"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-5 py-2 border rounded-lg"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg"
                  onClick={handleSave}
                >
                  {editing ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
