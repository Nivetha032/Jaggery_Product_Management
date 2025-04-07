import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaShippingFast, FaStar, FaBoxOpen, FaUndo } from "react-icons/fa";
import Navbar from "../components/Navbar";
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
        console.log("API Response:", response.data); // Debugging
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

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!product) return <p className="error-text">No product details available.</p>;

  const handlePackageChange = (size) => {
    setPackageSize(size);
  };

  // Handle Add to Cart - Store in localStorage
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
    <div>
      <Navbar />
      <div className="product-details-container">
        <div className="product-details-container-section product-info-section">
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
              <h1>{product?.name || "N/A"}</h1>
              <p><strong>Category:</strong> {product?.category_id || "N/A"}</p>
              <p><strong>Price:</strong> Rs.{product?.price || "0.00"}</p>
              <p><strong>Stock:</strong> {product?.stock || "Out of Stock"}</p>
              <p><strong>Expiry Date:</strong> {product?.expiry_date || "Not Available"}</p>

              {/* Package Size Section */}
              <div className="product-details-container-section package-size-section">
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
                <p><strong>Total Price: </strong>Rs.{(product?.price * packageSize).toFixed(2)}</p>
              </div>

              <button onClick={handleAddToCart}>Add to Cart</button>
              <button onClick={() => navigate("/cart")}>View Cart</button>
            </div>
          </div>
        </div>

        {/* Why Choose Rila Section */}
        <div className="product-details-container-section">
          <div className="why-choose-rila">
            <h2>Why You Choose Rila</h2>
            <div className="benefits">
              <div className="benefit-card">
                <FaShippingFast size={40} />
                <h4>Delivered on Time</h4>
              </div>
              <div className="benefit-card">
                <FaBoxOpen size={40} />
                <h4>Quality Products</h4>
              </div>
              <div className="benefit-card">
                <FaUndo size={40} />
                <h4>Free Returns</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="product-details-container-section">
          <div className="product-description">
            <h3>Product Description</h3>
            <p>{product?.description || "No description available."}</p>
          </div>
        </div>

        {/* Rating Section */}
        <div className="product-details-container-section rating-section">
          <h3>Rate this Product</h3>
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={30}
              className={star <= rating ? "selected-star" : ""}
              onClick={() => setRating(star)}
            />
          ))}
          <p>Your Rating: {rating} Stars</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-section">
        <div className="newsletter">
          <h3>Subscribe to our Newsletter</h3>
          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Your Email" />
          <button>Subscribe</button>
        </div>
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className="contact-details">
          <h3>Contact Us</h3>
          <p>Email: info@jaggerystore.com</p>
          <p>Phone: +123 456 7890</p>
          <p>Location: 123 Jaggery Street, India</p>
        </div>
        <div className="social-media">
          <h3>Follow Us</h3>
          <a href="#">Facebook</a>
          <a href="#">Instagram</a>
          <a href="#">Twitter</a>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetails;
