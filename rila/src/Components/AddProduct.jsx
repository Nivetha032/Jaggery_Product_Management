import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    quantity: "",
    stock: "",
    expiry_date: "",
    image: null, // Set initial image as null since we expect a file object
    category_id: "",
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories from the server
    axios
      .get("http://localhost:3001/auth/category")
      .then((response) => {
        if (response.data.Status) {
          setCategories(response.data.Result);
        } else {
          alert(response.data.Error);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (
      !product.name ||
      !product.price ||
      !product.description ||
      !product.quantity ||
      !product.image ||
      !product.category_id ||
      !product.stock ||
      !product.expiry_date
    ) {
      alert("All fields, including the image, must be filled out.");
      return;
    }

    // Validate image file type and size
    const validFileTypes = ["image/jpeg", "image/png"];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

    if (!validFileTypes.includes(product.image.type)) {
      alert("Invalid image file type. Please upload a JPEG or PNG image.");
      return;
    }

    if (product.image.size > maxSizeInBytes) {
      alert("Image size exceeds the 5 MB limit. Please upload a smaller image.");
      return;
    }

    // Create a FormData object and append product data
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("quantity", product.quantity);
    formData.append("stock", product.stock);
    formData.append("expiry_date", product.expiry_date);
    formData.append("image", product.image); // Make sure the image is a file
    formData.append("category_id", product.category_id);

    try {
      const response = await axios.post("http://localhost:3001/auth/add_product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.Status) {
        // Redirect to product list after successful submission
        navigate("/dashboard/product");
        // Optionally reset form data after successful submission
        setProduct({
          name: "",
          price: "",
          description: "",
          quantity: "",
          stock: "",
          expiry_date: "",
          image: null,
          category_id: "",
        });
      } else {
        alert(response.data.Error);
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      alert("An error occurred while submitting the product. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Product</h3>
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">Product Name</label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Enter Product Name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              required
            />
          </div>
          {/* Price */}
          <div className="col-12">
            <label htmlFor="inputPrice" className="form-label">Price</label>
            <input
              type="number"
              className="form-control rounded-0"
              id="inputPrice"
              placeholder="Enter Price"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              required
            />
          </div>
          {/* Description */}
          <div className="col-12">
            <label htmlFor="inputDescription" className="form-label">Description</label>
            <textarea
              className="form-control rounded-0"
              id="inputDescription"
              placeholder="Enter Product Description"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              required
            />
          </div>
          {/* Quantity */}
          <div className="col-12">
            <label htmlFor="inputQuantity" className="form-label">Quantity</label>
            <input
              type="number"
              className="form-control rounded-0"
              id="inputQuantity"
              placeholder="Enter Quantity"
              value={product.quantity}
              onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
              required
            />
          </div>
          {/* Stock */}
          <div className="col-12">
            <label htmlFor="inputStock" className="form-label">Stock</label>
            <input
              type="number"
              className="form-control rounded-0"
              id="inputStock"
              placeholder="Enter Stock"
              value={product.stock}
              onChange={(e) => setProduct({ ...product, stock: e.target.value })}
              required
            />
          </div>
          {/* Expiry Date */}
          <div className="col-12">
            <label htmlFor="inputExpiryDate" className="form-label">Expiry Date</label>
            <input
              type="date"
              className="form-control rounded-0"
              id="inputExpiryDate"
              value={product.expiry_date}
              onChange={(e) => setProduct({ ...product, expiry_date: e.target.value })}
              required
            />
          </div>
          {/* Category */}
          <div className="col-12">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              className="form-select"
              id="category"
              value={product.category_id}
              onChange={(e) => setProduct({ ...product, category_id: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          {/* Image Upload */}
          <div className="col-12">
            <label htmlFor="inputGroupFile01" className="form-label">Select Image</label>
            <input
              type="file"
              className="form-control rounded-0"
              id="inputGroupFile01"
              onChange={(e) => setProduct({ ...product, image: e.target.files[0] })}
              required
            />
          </div>
          {/* Submit Button */}
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
