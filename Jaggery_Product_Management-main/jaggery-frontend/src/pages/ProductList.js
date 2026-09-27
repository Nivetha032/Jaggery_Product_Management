import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen } from "react-icons/fa";
import "./styles.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/product")
      .then((result) => {
        if (result.data.Status) {
          setProducts(result.data.Result);
        } else {
          setError(result.data.Error || "Unable to load products.");
        }
      })
      .catch((err) => {
        console.log(err);
        setError("Unable to reach the server. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-shell">
      <Navbar />

      <section className="products-hero">
        <div className="container">
          <span className="eyebrow">Shop</span>
          <h1>Our Full Range</h1>
          <p>Naturally made jaggery and coconut products, sourced with care.</p>
        </div>
      </section>

      <section className="section product-list-section">
        <div className="container">
          {loading && (
            <div className="state-message">
              <div className="spinner" />
              Loading products…
            </div>
          )}

          {!loading && error && <div className="state-message">{error}</div>}

          {!loading && !error && products.length === 0 && (
            <div className="state-message">
              <FaBoxOpen size={36} style={{ marginBottom: 12, color: "var(--gold-500)" }} />
              <p>No products are available right now. Please check back soon.</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="product-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-card-image">
                    <img
                      src={`http://localhost:3001/images/${product.image}`}
                      alt={product.name}
                    />
                  </div>
                  <div className="product-card-body">
                    <h2>{product.name}</h2>
                    <p className="product-card-price">Rs.{product.price}</p>
                    <button
                      className="btn btn-primary btn-block"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductList;
