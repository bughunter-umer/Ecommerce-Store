import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any auth tokens or user data
    localStorage.removeItem("token"); // example
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo / App Name */}
        <div className="text-2xl font-bold">Ecommerce-Store</div>

        {/* Links */}
        <div className="flex items-center space-x-4">
          <Link
            to="/orders"
            className="hover:bg-indigo-500 px-3 py-2 rounded transition"
          >
            Orders
          </Link>
          <Link
            to="/products"
            className="hover:bg-indigo-500 px-3 py-2 rounded transition"
          >
            Products
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
