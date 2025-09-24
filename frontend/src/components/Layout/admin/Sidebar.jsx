import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const [open, setOpen] = useState(true); // for desktop collapse/expand
  const [mobileOpen, setMobileOpen] = useState(false); // for mobile menu
  const location = useLocation();
  const navigate = useNavigate();

  // Read user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = (user.role || "").toLowerCase();

  const links = [
    { to: "/admin/dashboard", label: "Dashboard", roles: ["admin"] },
    { to: "/admin/orders", label: "Orders", roles: ["admin"] },
    { to: "/admin/products", label: "Products", roles: ["admin"] },
    { to: "/admin/customers", label: "Customers", roles: ["admin"] },
    { to: "/admin/reports", label: "Reports", roles: ["admin"] },
    { to: "/admin/users", label: "Users", roles: ["admin"] },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const filteredLinks = links.filter(
    (link) => link.roles && link.roles.includes(role)
  );

  return (
    <div className="flex">
      {/* Mobile Hamburger Button */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
        onClick={() => setMobileOpen(true)}
      >
        {/* Hamburger Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar for Desktop */}
      <aside
        className={`hidden sm:flex flex-col bg-indigo-700 text-white p-4 transition-all duration-300 fixed h-screen ${
          open ? "w-64" : "w-16"
        }`}
      >
        {/* Brand / Toggle */}
        <div className="flex justify-between items-center mb-6">
          {open && <h1 className="font-bold text-lg">Ecommerce</h1>}
          <button
            onClick={() => setOpen(!open)}
            className="p-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {open ? "←" : "→"}
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto">
          {filteredLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-lg flex items-center ${
                location.pathname === link.to
                  ? "bg-white/10 font-medium"
                  : "hover:bg-white/5"
              } transition-colors duration-200`}
            >
              {open ? link.label : link.label[0]}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-auto pt-4 border-t border-indigo-600">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 flex items-center justify-center"
          >
            {open ? "Logout" : "⎋"}
          </button>
        </div>
      </aside>

      {/* Sidebar for Mobile */}
      {mobileOpen && (
        <div className="sm:hidden fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileOpen(false)}
          ></div>

          {/* Sidebar panel */}
          <aside className="relative w-64 bg-indigo-700 text-white p-4 flex flex-col h-full z-50">
            <div className="flex justify-between items-center mb-6">
              <h1 className="font-bold text-lg">Ecommerce</h1>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                ✕
              </button>
            </div>

            <nav className="flex-1 flex flex-col gap-2 overflow-y-auto">
              {filteredLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded-lg ${
                    location.pathname === link.to
                      ? "bg-white/10 font-medium"
                      : "hover:bg-white/5"
                  } transition-colors duration-200`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-4 border-t border-indigo-600">
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 flex items-center justify-center"
              >
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Spacer for desktop content */}
      <div className={`${open ? "w-64" : "w-16"} hidden sm:block transition-all duration-300`}></div>
    </div>
  );
}

export default Sidebar;
