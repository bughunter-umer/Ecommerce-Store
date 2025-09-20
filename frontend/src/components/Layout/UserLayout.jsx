import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function UserLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      
      {/* Header / Navbar */}
    <Navbar/>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-8">
        {children}
      </main>

      {/* Footer */}
    <Footer/>
    </div>
  );
}
