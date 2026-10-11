import React, { useCallback, useEffect, useState } from "react";
import { FaClipboardList, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { api, errorMessage, formatDate, formatMoney } from "./api";
import { useToast } from "./Toast";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

const Orders = () => {
  const notify = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [openId, setOpenId] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get("/api/orders");
      setOrders(data.Result);
    } catch (err) {
      notify(errorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => { load(); }, [load]);

  const changeStatus = async (id, status) => {
    try {
      await api.put(`/api/orders/${id}/status`, { status });
      setOrders((list) => list.map((o) => (o.id === id ? { ...o, status } : o)));
      notify(`Order #${id} marked as ${status}`);
    } catch (err) { notify(errorMessage(err), "error"); }
  };

  const shown = filter ? orders.filter((o) => o.status === filter) : orders;

  return (
    <>
      <div className="toolbar">
        <div className="chip-row">
          {["", ...STATUSES].map((s) => (
            <button key={s || "all"} className={`chip ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>
              {s ? s : "all"}
              <span>{s ? orders.filter((o) => o.status === s).length : orders.length}</span>
            </button>
          ))}
        </div>
      </div>

      <section className="panel table-panel">
        {loading ? (
          <div className="empty-state"><div className="spinner" />Loading orders…</div>
        ) : shown.length === 0 ? (
          <div className="empty-state">
            <FaClipboardList size={34} />
            <p>{orders.length === 0 ? "No orders yet. They'll appear here when customers check out." : "No orders with this status."}</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr><th></th><th>Order</th><th>Customer</th><th>Date</th><th className="right">Total</th><th>Status</th></tr>
              </thead>
              <tbody>
                {shown.map((o) => (
                  <React.Fragment key={o.id}>
                    <tr className="clickable" onClick={() => setOpenId(openId === o.id ? null : o.id)}>
                      <td className="expand-cell">{openId === o.id ? <FaChevronUp /> : <FaChevronDown />}</td>
                      <td><strong>#{o.id}</strong></td>
                      <td>{o.name}<br /><small>{o.email}</small></td>
                      <td>{formatDate(o.created_at)}</td>
                      <td className="right"><strong>{formatMoney(o.total_price)}</strong></td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <select
                          className={`status-select status-${o.status}`}
                          value={o.status}
                          onChange={(e) => changeStatus(o.id, e.target.value)}
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                    {openId === o.id && (
                      <tr className="detail-row">
                        <td colSpan="6">
                          <div className="order-detail">
                            <div>
                              <h4>Items</h4>
                              <ul>
                                {o.items.map((i) => (
                                  <li key={i.id}>
                                    <span>{i.product_name} × {i.quantity}</span>
                                    <strong>{formatMoney(i.price * i.quantity)}</strong>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4>Shipping to</h4>
                              <p>
                                {o.name}<br />
                                {[o.flat, o.street].filter(Boolean).join(", ")}<br />
                                {[o.city, o.state, o.pin_code].filter(Boolean).join(", ")}<br />
                                {o.country}<br />
                                Phone: {o.number}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
};

export default Orders;
