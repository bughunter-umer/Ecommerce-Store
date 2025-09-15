import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // make sure this matches backend
});

export default API;
