import React, { useCallback, useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaTags } from "react-icons/fa";
import { api, errorMessage } from "./api";
import { useToast } from "./Toast";

const Categories = () => {
  const notify = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/category");
      setCategories(data.Result);
    } catch (err) {
      notify(errorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => { load(); }, [load]);

  const add = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await api.post("/auth/category", { name: newName });
      setNewName("");
      notify("Category added");
      load();
    } catch (err) { notify(errorMessage(err), "error"); }
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) return;
    try {
      await api.put(`/auth/category/${id}`, { name: editName });
      setEditingId(null);
      notify("Category renamed");
      load();
    } catch (err) { notify(errorMessage(err), "error"); }
  };

  const remove = async () => {
    try {
      await api.delete(`/auth/category/${toDelete.id}`);
      notify(`"${toDelete.name}" deleted`);
      setToDelete(null);
      load();
    } catch (err) { notify(errorMessage(err), "error"); }
  };

  return (
    <>
      <form className="panel inline-form" onSubmit={add}>
        <input placeholder="New category name…" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <button className="btn btn-primary" type="submit"><FaPlus /> Add Category</button>
      </form>

      <section className="panel table-panel">
        {loading ? (
          <div className="empty-state"><div className="spinner" />Loading…</div>
        ) : categories.length === 0 ? (
          <div className="empty-state"><FaTags size={34} /><p>No categories yet. Add one above.</p></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Products</th><th className="right">Actions</th></tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>
                    {editingId === c.id ? (
                      <input
                        className="inline-input"
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit(c.id)}
                      />
                    ) : <strong>{c.name}</strong>}
                  </td>
                  <td><span className="pill pill-green">{c.product_count} product{c.product_count === 1 ? "" : "s"}</span></td>
                  <td className="right">
                    {editingId === c.id ? (
                      <>
                        <button className="icon-btn" title="Save" onClick={() => saveEdit(c.id)}><FaCheck /></button>
                        <button className="icon-btn" title="Cancel" onClick={() => setEditingId(null)}><FaTimes /></button>
                      </>
                    ) : (
                      <>
                        <button className="icon-btn" title="Rename" onClick={() => { setEditingId(c.id); setEditName(c.name); }}><FaEdit /></button>
                        <button className="icon-btn danger" title="Delete" onClick={() => setToDelete(c)}><FaTrash /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {toDelete && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setToDelete(null)}>
          <div className="modal modal-sm">
            <div className="modal-head"><h3>Delete category?</h3></div>
            <div className="modal-body">
              <p>
                <strong>{toDelete.name}</strong> will be removed.
                {toDelete.product_count > 0 && ` Its ${toDelete.product_count} product(s) will stay in the store but become uncategorised.`}
              </p>
            </div>
            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={() => setToDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={remove}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Categories;
