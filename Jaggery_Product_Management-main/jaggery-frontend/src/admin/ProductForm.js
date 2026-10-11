import React, { useEffect, useRef, useState } from "react";
import { FaTimes, FaCloudUploadAlt } from "react-icons/fa";
import { api, errorMessage, imageUrl } from "./api";
import { useToast } from "./Toast";

const MAX_BYTES = 2 * 1024 * 1024;
const empty = { name: "", category_id: "", price: "", stock: "", expiry_date: "", description: "" };

// Add / edit modal. `product` = null for a new product.
const ProductForm = ({ product, categories, onClose, onSaved }) => {
  const notify = useToast();
  const fileInput = useRef(null);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const editing = Boolean(product);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        category_id: product.category_id || "",
        price: product.price ?? "",
        stock: product.stock ?? "",
        expiry_date: product.expiry_date ? String(product.expiry_date).slice(0, 10) : "",
        description: product.description || "",
      });
      setPreview(imageUrl(product.image));
    }
  }, [product]);

  // Free the temporary preview URL when it changes or the modal closes
  useEffect(() => () => { if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview); }, [preview]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const pickFile = (f) => {
    if (!f) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(f.type)) {
      setError("Please choose a JPG, PNG, WEBP or GIF image.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError("Image is too large. Maximum size is 2 MB.");
      return;
    }
    setError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => body.append(k, v));
      if (file) body.append("image", file);

      if (editing) await api.put(`/auth/product/${product.id}`, body);
      else await api.post("/auth/product", body);

      notify(editing ? "Product updated" : "Product added — it's now live on the store");
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal modal-lg" onSubmit={handleSubmit}>
        <div className="modal-head">
          <h3>{editing ? "Edit Product" : "Add New Product"}</h3>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><FaTimes /></button>
        </div>

        <div className="modal-body form-grid">
          <div className="form-col">
            <span className="field-label">Product Image</span>
            <div
              className={`dropzone ${dragging ? "dragging" : ""} ${preview ? "has-image" : ""}`}
              onClick={() => fileInput.current.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); pickFile(e.dataTransfer.files[0]); }}
            >
              {preview ? (
                <>
                  <img src={preview} alt="Preview" />
                  <span className="dropzone-change">Click or drop to change</span>
                </>
              ) : (
                <>
                  <FaCloudUploadAlt size={34} />
                  <p><strong>Click to upload</strong> or drag &amp; drop</p>
                  <small>JPG, PNG, WEBP or GIF — max 2 MB</small>
                </>
              )}
              <input ref={fileInput} type="file" accept="image/*" hidden onChange={(e) => pickFile(e.target.files[0])} />
            </div>
            <small className="muted">The image is stored in the database along with the product.</small>
          </div>

          <div className="form-col">
            <label className="field">
              <span>Product Name *</span>
              <input required value={form.name} onChange={set("name")} placeholder="e.g. Organic Jaggery Powder" />
            </label>

            <label className="field">
              <span>Category</span>
              <select value={form.category_id} onChange={set("category_id")}>
                <option value="">— No category —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>

            <div className="field-row">
              <label className="field">
                <span>Price (Rs.) *</span>
                <input required type="number" min="0" step="0.01" value={form.price} onChange={set("price")} placeholder="0.00" />
              </label>
              <label className="field">
                <span>Stock (kg) *</span>
                <input required type="number" min="0" step="1" value={form.stock} onChange={set("stock")} placeholder="0" />
              </label>
            </div>

            <label className="field">
              <span>Expiry Date</span>
              <input type="date" value={form.expiry_date} onChange={set("expiry_date")} />
            </label>
          </div>

          <label className="field form-wide">
            <span>Description</span>
            <textarea rows="4" value={form.description} onChange={set("description")} placeholder="Describe the product, ingredients, benefits…" />
          </label>
        </div>

        {error && <div className="form-alert modal-alert">{error}</div>}

        <div className="modal-foot">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : editing ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
