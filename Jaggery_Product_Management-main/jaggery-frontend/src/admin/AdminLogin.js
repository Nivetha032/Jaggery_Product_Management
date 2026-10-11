import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FaLock, FaEnvelope, FaLeaf } from "react-icons/fa";
import { api, errorMessage } from "./api";
import "./admin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (localStorage.getItem("adminToken")) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/adminlogin", form);
      localStorage.setItem("adminToken", data.Result.token);
      localStorage.setItem("adminEmail", data.Result.email);
      navigate("/admin");
    } catch (err) {
      setError(errorMessage(err, "Login failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-brand">
        <div className="login-brand-inner">
          <span className="login-logo"><FaLeaf /></span>
          <h1>Rila Groups</h1>
          <p>Manage your products, stock and orders from one place. Anything you publish here appears on the storefront instantly.</p>
          <ul>
            <li>Upload products with images</li>
            <li>Track stock &amp; expiry dates</li>
            <li>Process customer orders</li>
          </ul>
        </div>
      </div>

      <div className="login-form-side">
        <form className="login-card" onSubmit={handleSubmit}>
          <h2>Admin Sign In</h2>
          <p className="login-sub">Enter your credentials to access the dashboard.</p>

          {error && <div className="form-alert">{error}</div>}

          <label className="field">
            <span>Email</span>
            <div className="input-icon">
              <FaEnvelope />
              <input
                type="email"
                required
                autoFocus
                placeholder="admin@rila.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </label>

          <label className="field">
            <span>Password</span>
            <div className="input-icon">
              <FaLock />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </label>

          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
          <a href="/" className="login-back">← Back to store</a>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
