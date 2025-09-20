// frontend/src/api.js
import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://e-commerce-backend-production-cb1a.up.railway.app/api",
  withCredentials: true, // adjust to your backend
});

// ✅ Automatically add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default API;
