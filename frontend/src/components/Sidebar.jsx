import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass = ({ isActive }) => isActive ? "block py-2 px-4 rounded bg-slate-200 font-semibold" : "block py-2 px-4 rounded hover:bg-slate-100";

  return (
    <aside className="w-64 bg-white shadow p-4 min-h-screen">
      <div className="text-xl font-bold mb-6">Admin Dashboard</div>
      <nav className="space-y-1">
        <NavLink to="/" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/products" className={linkClass}>Products</NavLink>
        <NavLink to="/orders" className={linkClass}>Orders</NavLink>
        <NavLink to="/customers" className={linkClass}>Customers</NavLink>
        <NavLink to="/reports" className={linkClass}>Reports</NavLink>
      </nav>
    </aside>
  );
}
