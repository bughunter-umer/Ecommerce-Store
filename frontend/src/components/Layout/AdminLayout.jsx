import React from "react";
import Sidebar from "./admin/Sidebar";
import Footer from "./Footer";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar: full height fixed */}
      <Sidebar />

      {/* Main Content: flex-1 and scrollable */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
