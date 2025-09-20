import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Read user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = (user.role || "").toLowerCase(); // get role from user object

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
    localStorage.removeItem("user"); // remove user object
    navigate("/login", { replace: true });
  };

  // Filter links safely
  const filteredLinks = links.filter(
    (link) => link.roles && link.roles.includes(role)
  );

  return (
    <div className="flex">
      <aside
        className={`${
          open ? "w-64" : "w-16"
        } bg-indigo-700 text-white flex flex-col p-4 transition-all duration-300 fixed h-screen`}
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

        {/* Links: scrollable if too long */}
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

        {/* Logout button fixed at bottom */}
        <div className="mt-auto pt-4 border-t border-indigo-600">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 flex items-center justify-center transition-colors duration-200"
          >
            {open ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Logout
              </>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </aside>

      {/* Spacer for main content */}
      <div className={`${open ? "w-64" : "w-16"} transition-all duration-300`}></div>
    </div>
  );
}

export default Sidebar;