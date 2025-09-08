// frontend/src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json'
  },
});

export default API;
