import React from "react";
import { Navigate } from "react-router-dom";

// This checks if the user is admin
export default function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user")); // or from Redux

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" />; // redirect non-admins to login
  }

  return children;
}
