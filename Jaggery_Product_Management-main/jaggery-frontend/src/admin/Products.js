import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaBoxOpen } from "react-icons/fa";
import { api, errorMessage, formatDate, formatMoney, imageUrl } from "./api";
import { useToast } from "./Toast";
import ProductForm from "./ProductForm";

const PAGE_SIZE = 8;

const expiryInfo = (date) => {
  if (!date) return null;
  const days = Math.ceil((new Date(date) - new Date()) / 86400000);
  if (days < 0) return { text: "Expired", cls: "pill-red" };
  if (days <= 30) return { text: `${days}d left`, cls: "pill-amber" };
  return null;
};

const Products = () => {
  const notify = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // null | { product: obj|null }
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const [p, c] = await Promise.all([api.get("/auth/product"), api.get("/auth/category")]);
      setProducts(p.data.Result);
      setCategories(c.data.Result);
      setError("");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter(
      (p) =>
        (!q || p.name.toLowerCase().includes(q)) &&
        (!categoryFilter || String(p.category_id) === categoryFilter)
    );
  }, [products, search, categoryFilter]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/auth/product/${toDelete.id}`);
      notify(`"${toDelete.name}" deleted`);
      setToDelete(null);
      load();
    } catch (err) {
      notify(errorMessage(err), "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="toolbar">
        <div className="search-box">
          <FaSearch />
          <input
            placeholder="Search products…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="select"
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
        >
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="btn btn-primary toolbar-add" onClick={() => setModal({ product: null })}>
          <FaPlus /> Add Product
        </button>
      </div>

      <section className="panel table-panel">
        {loading ? (
          <div className="empty-state"><div className="spinner" />Loading products…</div>
        ) : error ? (
          <div className="empty-state">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <FaBoxOpen size={34} />
            <p>{products.length === 0 ? "No products yet. Add your first product to get started." : "No products match your search."}</p>
            {products.length === 0 && (
              <button className="btn btn-primary" onClick={() => setModal({ product: null })}><FaPlus /> Add Product</button>
            )}
          </div>
        ) : (
          <>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th className="right">Price</th>
                    <th>Stock</th>
                    <th>Expiry</th>
                    <th className="right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((p) => {
                    const exp = expiryInfo(p.expiry_date);
                    return (
                      <tr key={p.id}>
                        <td>
                          <div className="cell-product">
                            {p.image ? <img src={imageUrl(p.image)} alt="" /> : <span className="thumb-empty" />}
                            <div>
                              <strong>{p.name}</strong>
                              <small>ID #{p.id}</small>
                            </div>
                          </div>
                        </td>
                        <td>{p.category_name || <span className="muted">—</span>}</td>
                        <td className="right"><strong>{formatMoney(p.price)}</strong></td>
                        <td>
                          <span className={`pill ${p.stock === 0 ? "pill-red" : p.stock <= 10 ? "pill-amber" : "pill-green"}`}>
                            {p.stock === 0 ? "Out of stock" : `${p.stock} kg`}
                          </span>
                        </td>
                        <td>
                          {formatDate(p.expiry_date)}
                          {exp && <span className={`pill ${exp.cls} pill-inline`}>{exp.text}</span>}
                        </td>
                        <td className="right">
                          <button className="icon-btn" title="Edit" onClick={() => setModal({ product: p })}><FaEdit /></button>
                          <button className="icon-btn danger" title="Delete" onClick={() => setToDelete(p)}><FaTrash /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="table-foot">
              <span>Showing {(current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
              <div className="pager">
                <button disabled={current === 1} onClick={() => setPage(current - 1)}>Previous</button>
                <span>Page {current} / {pages}</span>
                <button disabled={current === pages} onClick={() => setPage(current + 1)}>Next</button>
              </div>
            </div>
          </>
        )}
      </section>

      {modal && (
        <ProductForm
          product={modal.product}
          categories={categories}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(); }}
        />
      )}

      {toDelete && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setToDelete(null)}>
          <div className="modal modal-sm">
            <div className="modal-head"><h3>Delete product?</h3></div>
            <div className="modal-body">
              <p>
                <strong>{toDelete.name}</strong> will be permanently removed from the database and the store.
                This can't be undone.
              </p>
            </div>
            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={() => setToDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete} disabled={deleting}>
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Products;
