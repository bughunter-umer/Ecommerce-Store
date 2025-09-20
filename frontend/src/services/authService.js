import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

const registerUser = async (data) => {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data;
};

export default { loginUser, registerUser };
