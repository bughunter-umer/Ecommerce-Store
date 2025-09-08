import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector(s => s.auth.user);

  return (
    <header className="flex items-center justify-between bg-white shadow p-4">
      <div className="text-lg font-semibold">Welcome, {user?.name || "User"}</div>
      <div>
        <button
          onClick={() => dispatch(logout())}
          className="px-3 py-1 rounded border hover:bg-slate-50"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
