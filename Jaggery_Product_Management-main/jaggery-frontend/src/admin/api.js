import axios from "axios";

export const API_URL = "http://localhost:3001";
export const imageUrl = (name) => (name ? `${API_URL}/images/${name}` : null);

export const api = axios.create({ baseURL: API_URL });

// Attach the admin's JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token expires or is rejected, send the admin back to the login page
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    if ((status === 401 || status === 403) && !window.location.pathname.includes("/admin/login")) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminEmail");
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

// Pulls a readable message out of any failed request
export const errorMessage = (err, fallback = "Something went wrong. Please try again.") =>
  err?.response?.data?.Error || (err?.code === "ERR_NETWORK" ? "Cannot reach the server. Is the backend running?" : fallback);

export const formatMoney = (n) =>
  "Rs." + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(String(value).replace(" ", "T"));
  return isNaN(d) ? value : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};
