import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaShippingFast, FaStar, FaBoxOpen, FaUndo, FaShoppingCart } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [packageSize, setPackageSize] = useState(1);
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError("Invalid Product ID");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:3001/auth/product/${id}`)
      .then((response) => {
        if (response.data.Status && typeof response.data.Result === "object") {
          setProduct(response.data.Result);
        } else {
          setError("Product not found");
        }
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setError("Failed to fetch product details");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="state-message">
          <div className="spinner" />
          Loading product…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell">
        <Navbar />
        <p className="state-message">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-shell">
        <Navbar />
        <p className="state-message">No product details available.</p>
      </div>
    );
  }

  const handlePackageChange = (size) => {
    setPackageSize(size);
  };

  const handleAddToCart = () => {
    if (!product) {
      alert("Product details are not available.");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += packageSize;
    } else {
      cart.push({
        id: product.id,
        name: product.name || "Unknown Product",
        price: product.price || 0,
        quantity: packageSize,
        image: product.image || "https://via.placeholder.com/150",
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart!");
  };

  return (
    <div className="page-shell">
      <Navbar />
      <div className="product-details-container">
        <div className="product-main">
          <div className="product-image">
            <img
              src={
                product?.image
                  ? `http://localhost:3001/images/${product.image}`
                  : "https://via.placeholder.com/300"
              }
              alt={product?.name || "Product Image"}
            />
          </div>

          <div className="product-info">
            <div>
              <span className="badge">{product?.stock > 0 ? "In Stock" : "Out of Stock"}</span>
              <h1>{product?.name || "N/A"}</h1>
              <div className="product-meta">
                <span><strong>Category:</strong> {product?.category_id || "N/A"}</span>
                <span><strong>Expiry:</strong> {product?.expiry_date || "Not Available"}</span>
              </div>
              <p className="product-price">Rs.{product?.price || "0.00"}</p>
            </div>

            <div className="package-size-section">
              <h3>Select Package Size</h3>
              <div className="package-options">
                {[1, 2, 3, 4].map((size) => (
                  <button
                    key={size}
                    className={packageSize === size ? "selected" : ""}
                    onClick={() => handlePackageChange(size)}
                    disabled={!product?.stock || size > product?.stock}
                  >
                    {size} kg
                  </button>
                ))}
              </div>
              <p className="package-total">
                Total Price: <strong>Rs.{(product?.price * packageSize).toFixed(2)}</strong>
              </p>
            </div>

            <div className="product-cta">
              <button className="btn btn-primary" onClick={handleAddToCart}>
                <FaShoppingCart /> Add to Cart
              </button>
              <button className="btn btn-secondary" onClick={() => navigate("/cart")}>
                View Cart
              </button>
            </div>
          </div>
        </div>

        {/* Why Choose Rila */}
        <div className="why-choose-rila">
          <h2>Why You Choose Rila</h2>
          <div className="benefits">
            <div className="benefit-card">
              <FaShippingFast size={30} />
              <h4>Delivered on Time</h4>
            </div>
            <div className="benefit-card">
              <FaBoxOpen size={30} />
              <h4>Quality Products</h4>
            </div>
            <div className="benefit-card">
              <FaUndo size={30} />
              <h4>Free Returns</h4>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="product-description">
          <h3>Product Description</h3>
          <p>{product?.description || "No description available."}</p>
        </div>

        {/* Rating */}
        <div className="rating-section">
          <h3>Rate this Product</h3>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={26}
                className={star <= rating ? "selected-star" : ""}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <p>Your Rating: {rating} Stars</p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;
