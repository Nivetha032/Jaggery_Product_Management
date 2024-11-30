import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Product = () => {
  const [product, setProduct] = useState([]);
  const [categories, setCategories] = useState([]); // To store categories for filtering
  const [selectedCategory, setSelectedCategory] = useState(''); // Selected category filter
  const [showInStock, setShowInStock] = useState(false); // Filter for in-stock products
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [showImageModal, setShowImageModal] = useState(false); // Modal state
  const [selectedImage, setSelectedImage] = useState(""); // State for selected image URL
  const navigate = useNavigate();

  useEffect(() => {
    // Fetching product list and categories
    axios
      .get("http://localhost:3001/auth/product")
      .then((result) => {
        if (result.data.Status) {
          setProduct(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    // Fetch categories for the filter
    axios
      .get("http://localhost:3001/auth/categories")
      .then((result) => {
        if (result.data.Status) {
          setCategories(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3001/auth/delete_product/" + id)
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
        } else {
          alert(result.data.Error);
        }
      });
  };

  const exportToCSV = () => {
    const csvRows = [];
    const headers = ["Name", "Image", "Price", "Quantity", "Stock", "Expiry Date"];
    csvRows.push(headers.join(","));

    product.forEach((p) => {
      const row = [
        p.name,
        `http://localhost:3001/Images/${p.image}`, // Include image URL
        p.price,
        p.quantity,
        p.stock,
        p.expiry_date
      ];
      csvRows.push(row.join(","));
    });

    const csvData = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const csvURL = window.URL.createObjectURL(csvData);

    const tempLink = document.createElement("a");
    tempLink.href = csvURL;
    tempLink.download = "products.csv";
    tempLink.click();
  };

  // Filtered and sorted products based on category, stock, and search query
  const filteredProducts = product.filter((p) => {
    const matchesCategory = selectedCategory ? p.category_id === selectedCategory : true;
    const matchesStock = showInStock ? p.stock > 0 : true;
    const matchesSearchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                               (p.category && p.category.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesStock && matchesSearchQuery;
  });

  // Sorting products by category
  const sortedProducts = filteredProducts.sort((a, b) => {
    if (a.category > b.category) return 1;
    if (a.category < b.category) return -1;
    return 0;
  });

  // Function to handle image hover
  const handleImageHover = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleCloseModal = () => {
    setShowImageModal(false);
  };

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Product List</h3>
      </div>
      <div className="d-flex justify-content-between">
        <Link to="/dashboard/add_product" className="btn btn-success">
          Add Product
        </Link>
        <button className="btn btn-primary" onClick={exportToCSV}>
          Export
        </button>
      </div>

      {/* Sorting and Filtering Options */}
      <div className="d-flex justify-content-between mt-3">
        <label className="form-check-label">
          <input
            type="checkbox"
            className="form-check-input"
            checked={showInStock}
            onChange={() => setShowInStock(!showInStock)}
          />
          Show In-Stock Only
        </label>

        {/* Search Input with Search Icon */}
        <div className="position-relative">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <i className="fas fa-search position-absolute" style={{ right: '15px', top: '20px', color: '#aaa' }}></i>
        </div>
      </div>

      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Stock</th>
              <th>Expiry Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>
                  <img
                    src={`http://localhost:3001/Images/${p.image}`}
                    alt={p.name}
                    className="employee_image"
                    style={{ cursor: 'pointer' }}
                    onMouseOver={() => handleImageHover(`http://localhost:3001/Images/${p.image}`)}
                  />
                </td>
                <td>Rs.{p.price}</td>
                <td>{p.quantity}/pack</td>
                <td>{p.stock || 'N/A'}</td>
                <td>{p.expiry_date ? new Date(p.expiry_date).toLocaleDateString() : 'No expiry date'}</td>
                <td>
                  <Link
                    to={`/dashboard/edit_product/${p.id}`}
                    className="btn btn-info btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Image */}
      {showImageModal && (
        <div
          className="modal"
          style={{
            display: 'block',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center', // Flexbox to center content
          }}
        >
          <div
            className="modal-content"
            style={{
              background: '#fff',
              padding: '20px',
              maxWidth: '500px',
              textAlign: 'center', // Center the image and text
            }}
          >
            <span
              className="close"
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                fontSize: '30px',
                cursor: 'pointer',
                color: '#333',
              }}
            >
              &times;
            </span>
            <img
              src={selectedImage}
              alt="Full Size"
              style={{
                width: '100%',
                height: 'auto',
                maxWidth: '400px', // Adjust max-width for a smaller image
                margin: '0 auto', // Center the image within the modal
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
