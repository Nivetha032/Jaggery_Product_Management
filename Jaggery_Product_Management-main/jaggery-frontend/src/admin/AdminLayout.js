import React, { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaThLarge, FaBoxOpen, FaTags, FaClipboardList, FaSignOutAlt,
  FaBars, FaTimes, FaExternalLinkAlt, FaLeaf,
} from "react-icons/fa";
import "./admin.css";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: <FaThLarge />, end: true },
  { to: "/admin/products", label: "Products", icon: <FaBoxOpen /> },
  { to: "/admin/categories", label: "Categories", icon: <FaTags /> },
  { to: "/admin/orders", label: "Orders", icon: <FaClipboardList /> },
];

const TITLES = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/categories": "Categories",
  "/admin/orders": "Orders",
};

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const email = localStorage.getItem("adminEmail") || "admin";

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    navigate("/admin/login");
  };

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-brand">
          <span className="sidebar-logo"><FaLeaf /></span>
          <div>
            <strong>Rila Groups</strong>
            <small>Admin Panel</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a href="/" target="_blank" rel="noreferrer" className="sidebar-link">
            <FaExternalLinkAlt /> <span>View Store</span>
          </a>
          <button className="sidebar-link" onClick={logout}>
            <FaSignOutAlt /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="topbar-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <FaTimes /> : <FaBars />}
          </button>
          <h1>{TITLES[pathname] || "Admin"}</h1>
          <div className="topbar-user">
            <span className="avatar">{email.charAt(0).toUpperCase()}</span>
            <div className="topbar-user-text">
              <strong>Administrator</strong>
              <small>{email}</small>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
