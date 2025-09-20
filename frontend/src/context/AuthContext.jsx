import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie"; // npm install js-cookie
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user/token from cookie on mount
  useEffect(() => {
    const token = Cookies.get("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login handler
 // Login handler
const login = async ({ email, password }) => {
  try {
    const data = await authService.loginUser({ email, password });

    // Save token in cookies
    Cookies.set("token", data.token, { expires: 7, secure: true, sameSite: "strict" });

    // Save user in localStorage
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);
    return { success: true, user: data.user }; // ✅ return user
  } catch (err) {
    return { success: false, error: err.response?.data?.error || err.message };
  }
};


  // Logout handler
  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Get token (from cookie)
  const getToken = () => Cookies.get("token");

  return (
    <AuthContext.Provider value={{ user, login, logout, getToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
