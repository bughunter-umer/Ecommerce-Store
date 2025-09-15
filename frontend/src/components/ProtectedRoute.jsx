import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem("token"); // or your auth logic

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // redirect if not logged in
  }

  return children; // render children (Dashboard) if authenticated
}
