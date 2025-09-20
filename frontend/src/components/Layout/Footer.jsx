import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        
        {/* Left side: copyright */}
        <div className="text-sm">
          &copy; {new Date().getFullYear()} MyEcommerce. All rights reserved.
        </div>

        {/* Right side: links (optional) */}
        <div className="flex space-x-4 mt-2 md:mt-0 text-sm">
          <a href="/terms" className="hover:underline">Terms</a>
          <a href="/privacy" className="hover:underline">Privacy</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </div>

      </div>
    </footer>
  );
}
