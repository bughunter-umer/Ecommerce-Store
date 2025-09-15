import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    // Optional: remove user info from Redux if stored
    // dispatch(logoutUser());
    
    // Redirect to login page
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div className="text-center mt-20">
      <p className="text-lg">Logging out...</p>
    </div>
  );
}
