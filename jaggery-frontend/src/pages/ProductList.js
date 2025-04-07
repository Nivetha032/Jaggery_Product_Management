import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import Navbar from "../components/Navbar"; // Import the Navbar component

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/product")
      .then((result) => {
        if (result.data.Status) {
          setProducts(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <Navbar />

      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={`http://localhost:3001/images/${product.image}`}
                alt={product.name}
              />
              <h2>{product.name}</h2>
              <p>${product.price}</p>
              <button onClick={() => navigate(`/product/${product.id}`)}>
                View Details
              </button>
            </div>
          ))
        ) : (
          <p className="text-center">Loading products...</p>
        )}
      </div>
       {/* Footer */}
       <footer className="footer-section" id="contact">
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

export default ProductList;
