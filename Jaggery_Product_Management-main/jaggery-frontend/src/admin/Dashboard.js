import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaTags, FaClipboardList, FaRupeeSign, FaExclamationTriangle, FaWarehouse } from "react-icons/fa";
import { api, errorMessage, formatDate, formatMoney, imageUrl } from "./api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/auth/stats")
      .then((res) => setStats(res.data.Result))
      .catch((err) => setError(errorMessage(err)));
  }, []);

  if (error) return <div className="panel empty-state">{error}</div>;
  if (!stats) return <div className="panel empty-state"><div className="spinner" />Loading dashboard…</div>;

  const { totals, byCategory, byStatus, recentOrders, lowStockItems, lowStockThreshold } = stats;
  const maxCat = Math.max(1, ...byCategory.map((c) => c.count));
  const totalOrders = byStatus.reduce((n, s) => n + s.count, 0);

  const cards = [
    { label: "Total Products", value: totals.products, icon: <FaBoxOpen />, tone: "gold", note: `${totals.categories} categories` },
    { label: "Total Revenue", value: formatMoney(totals.revenue), icon: <FaRupeeSign />, tone: "green", note: `${totals.orders} order${totals.orders === 1 ? "" : "s"}` },
    { label: "Pending Orders", value: totals.pending_orders, icon: <FaClipboardList />, tone: "blue", note: "Awaiting processing" },
    { label: "Low / Out of Stock", value: `${totals.low_stock} / ${totals.out_of_stock}`, icon: <FaExclamationTriangle />, tone: "red", note: `Low = ${lowStockThreshold} or fewer` },
    { label: "Inventory Value", value: formatMoney(totals.inventory_value), icon: <FaWarehouse />, tone: "brown", note: "Price × stock" },
    { label: "Categories", value: totals.categories, icon: <FaTags />, tone: "purple", note: "Product groups" },
  ];

  return (
    <>
      <div className="stat-grid">
        {cards.map((c) => (
          <div className="stat-card" key={c.label}>
            <span className={`stat-icon tone-${c.tone}`}>{c.icon}</span>
            <div>
              <p className="stat-label">{c.label}</p>
              <h3 className="stat-value">{c.value}</h3>
              <small className="stat-note">{c.note}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <section className="panel">
          <div className="panel-head"><h3>Products by Category</h3></div>
          {byCategory.length === 0 ? (
            <p className="muted">No products yet.</p>
          ) : (
            <div className="bar-list">
              {byCategory.map((c) => (
                <div className="bar-row" key={c.name}>
                  <span className="bar-label">{c.name}</span>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${(c.count / maxCat) * 100}%` }} /></div>
                  <span className="bar-count">{c.count}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-head"><h3>Orders by Status</h3></div>
          {totalOrders === 0 ? (
            <p className="muted">No orders yet.</p>
          ) : (
            <div className="bar-list">
              {byStatus.map((s) => (
                <div className="bar-row" key={s.status}>
                  <span className="bar-label cap">{s.status}</span>
                  <div className="bar-track"><div className={`bar-fill status-${s.status}`} style={{ width: `${(s.count / totalOrders) * 100}%` }} /></div>
                  <span className="bar-count">{s.count}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <h3>Recent Orders</h3>
            <Link to="/admin/orders">View all</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="muted">Orders placed on the store will show up here.</p>
          ) : (
            <table className="mini-table">
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td><strong>#{o.id}</strong><br /><small>{o.name}</small></td>
                    <td>{formatDate(o.created_at)}</td>
                    <td className="right">{formatMoney(o.total_price)}</td>
                    <td className="right"><span className={`pill status-${o.status}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <h3>Needs Restocking</h3>
            <Link to="/admin/products">Manage</Link>
          </div>
          {lowStockItems.length === 0 ? (
            <p className="muted">All products are well stocked. 🎉</p>
          ) : (
            <ul className="stock-list">
              {lowStockItems.map((p) => (
                <li key={p.id}>
                  {p.image ? <img src={imageUrl(p.image)} alt="" /> : <span className="thumb-empty" />}
                  <span className="stock-name">{p.name}</span>
                  <span className={`pill ${p.stock === 0 ? "pill-red" : "pill-amber"}`}>
                    {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
};

export default Dashboard;
