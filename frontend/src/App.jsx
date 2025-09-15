import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Login from "./pages/Login";

// ProtectedRoute component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

// Navbar component
function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: "fas fa-chart-pie" },
    { to: "/products", label: "Products", icon: "fas fa-box" },
    { to: "/customers", label: "Customers", icon: "fas fa-users" },
    { to: "/orders", label: "Orders", icon: "fas fa-shopping-cart" },
    { to: "/reports", label: "Reports", icon: "fas fa-chart-bar" },
    { to: "/users", label: "Users", icon: "fas fa-user" },
  ];

  return (
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center">
          <h1 className="font-bold text-xl">Ecommerce Dashboard</h1>
        </div>
        <button
          className="md:hidden px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500"
          onClick={() => setOpen(!open)}
        >
          {open ? "X" : "☰"}
        </button>
        <div className="hidden md:flex gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg ${
                location.pathname === link.to ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-indigo-800 px-4 py-3 space-y-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-4 py-2 rounded-lg ${
                location.pathname === link.to ? "bg-white/10" : "hover:bg-white/5"
              }`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

// Layout for protected pages
function ProtectedLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4">{children}</div>
    </>
  );
}

// Main App
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default root */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Products />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Orders />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Customers />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Users />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Reports />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<p className="text-center mt-10">404 Page Not Found</p>} />
      </Routes>
    </BrowserRouter>
  );
}
