import React, { useEffect, useState } from "react";
import API from "../../api"; // axios instance (must attach JWT in api.js)

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ✅ Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");
      setUsers(res.data);
      setError(null);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError(err.response?.status === 401 ? "Unauthorized – please login again." : "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Create user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return alert("All fields are required!");
    try {
      setCreating(true);
      await API.post("/users", form);
      setForm({ name: "", email: "", password: "" });
      fetchUsers();
    } catch (err) {
      console.error("Create user error:", err);
      alert(err.response?.status === 401 ? "Unauthorized – please login again." : err.response?.data?.msg || "Error creating user");
    } finally {
      setCreating(false);
    }
  };

  // ✅ Update user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editForm.name || !editForm.email) return alert("Name and email are required!");
    try {
      setUpdating(true);
      await API.put(`/users/${editingUser.id}`, editForm);
      setEditingUser(null);
      setEditForm({ name: "", email: "" });
      fetchUsers();
    } catch (err) {
      console.error("Update user error:", err);
      alert(err.response?.status === 401 ? "Unauthorized – please login again." : err.response?.data?.msg || "Error updating user");
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      setDeletingId(id);
      await API.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Delete user error:", err);
      alert(err.response?.status === 401 ? "Unauthorized – please login again." : err.response?.data?.msg || "Error deleting user");
    } finally {
      setDeletingId(null);
    }
  };

  const startEditing = (user) => {
    setEditingUser(user);
    setEditForm({ name: user.name, email: user.email });
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setEditForm({ name: "", email: "" });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 border-b pb-2">
        User Management
      </h2>

      {/* Create User Form */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-8 border border-gray-100">
        <h3 className="font-semibold text-lg sm:text-xl mb-4 text-gray-700 flex items-center">
          ➕ Add New User
        </h3>
        <form
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          onSubmit={handleCreateUser}
        >
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-gray-300 p-3 rounded-md w-full"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border border-gray-300 p-3 rounded-md w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border border-gray-300 p-3 rounded-md w-full"
          />
          <button
            type="submit"
            disabled={creating}
            className="bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50 flex justify-center"
          >
            {creating ? "Creating..." : "Add User"}
          </button>
        </form>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="font-semibold text-lg sm:text-xl mb-4 text-gray-700">✏️ Edit User</h3>
            <form onSubmit={handleUpdateUser}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="border border-gray-300 p-3 rounded-md w-full"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="border border-gray-300 p-3 rounded-md w-full"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Update User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-100">
        <h3 className="font-semibold text-lg sm:text-xl mb-4 text-gray-700">📋 User Directory</h3>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <p className="text-red-600 font-medium">{error}</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-3">{user.id}</td>
                    <td className="px-4 sm:px-6 py-3">{user.name}</td>
                    <td className="px-4 sm:px-6 py-3">{user.email}</td>
                    <td className="px-4 sm:px-6 py-3 flex space-x-2">
                      <button onClick={() => startEditing(user)} className="text-blue-600 hover:text-blue-800">✏️</button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={deletingId === user.id}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        {deletingId === user.id ? "..." : "🗑️"}
                      </button>
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
