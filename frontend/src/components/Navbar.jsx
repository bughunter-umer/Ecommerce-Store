import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/products", label: "Products" },
    { to: "/customers", label: "Customers" },
    { to: "/orders", label: "Orders" },
    { to: "/reports", label: "Reports" },
    { to: "/users", label: "Users" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    navigate("/login", { replace: true }); // Redirect to login
  };

  return (
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-xl">Ecommerce Dashboard</h1>

          {/* Desktop links */}
          <div className="hidden md:flex gap-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg ${
                  location.pathname === link.to ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
           
            <button
              onClick={handleLogout}

              className="px-3 py-2 rounded-lg hover:bg-white/5"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500"
          onClick={() => setOpen(!open)}
        >
          {open ? "X" : "☰"}
        </button>
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
          <button
            onClick={() => {
              handleLogout();
              setOpen(false);
            }}
            className="block w-full px-4 py-2 rounded-lg hover:bg-white/5"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
