import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL: `${API_URL}/admin` });

// Attach the admin token to every request
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("adminToken");
  if (token) {
    config.headers["x-admin-token"] = token;
  }
  return config;
});

// If any request returns 401, force re-login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      sessionStorage.removeItem("adminAuth");
      sessionStorage.removeItem("adminToken");
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

export default api;
