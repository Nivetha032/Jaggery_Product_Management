import React from "react";
import { useNavigate } from "react-router-dom";
import { FaLeaf, FaTruck, FaSeedling, FaRecycle, FaArrowRight } from "react-icons/fa";
import "./Home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import videoFile from "../assets/videos/section1.mp4";
import aboutImage from "../assets/images/about.png";

import jaggeryBlockImage from "../assets/images/coconut.jpg";
import jaggeryPowderImage from "../assets/images/jaggery_powder.jpg";
import organicJaggeryImage from "../assets/images/sweets.webp";

const FEATURED_PRODUCTS = [
  { name: "Coconut Products", tag: "Cold-pressed", image: jaggeryBlockImage },
  { name: "Jaggery Powder", tag: "Bestseller", image: jaggeryPowderImage },
  { name: "Sweets", tag: "Handmade", image: organicJaggeryImage },
];

const WHY_US = [
  { icon: <FaLeaf />, title: "100% Natural", copy: "No chemicals, no preservatives — just pure goodness." },
  { icon: <FaSeedling />, title: "Farm Sourced", copy: "Raw materials bought directly from local farmers." },
  { icon: <FaTruck />, title: "Traditional Process", copy: "Time-honoured techniques that retain natural nutrients." },
  { icon: <FaRecycle />, title: "Eco-Friendly", copy: "Sustainable farming and biodegradable packaging." },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="hero-section">
        <video autoPlay loop muted playsInline className="hero-video">
          <source src={videoFile} type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <div className="hero-content container">
          <span className="eyebrow hero-eyebrow">Rila Groups</span>
          <h1>Organic Jaggery Products with No Preservatives</h1>
          <p>
            Straight from the farm to your kitchen — pure, traditional and
            crafted with care.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => navigate("/products")}>
              Shop Products <FaArrowRight size={13} />
            </button>
            <a href="#about" className="btn btn-outline-light">Our Story</a>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="section products-section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Handpicked For You</span>
            <h2>Our Products</h2>
            <p>Explore our range of naturally made jaggery and coconut goods.</p>
          </div>
          <div className="products-grid">
            {FEATURED_PRODUCTS.map((product) => (
              <div className="feature-card" key={product.name}>
                <div className="feature-card-image">
                  <img src={product.image} alt={product.name} />
                  <span className="badge feature-card-badge">{product.tag}</span>
                </div>
                <div className="feature-card-body">
                  <h3>{product.name}</h3>
                  <button className="btn btn-secondary" onClick={() => navigate("/products")}>
                    View Products
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section about-section" id="about">
        <div className="container about-grid">
          <div className="about-image">
            <img src={aboutImage} alt="Rila Groups team at work" />
          </div>
          <div className="about-content">
            <span className="eyebrow">About Us</span>
            <h2>Trusted, Traditional &amp; Truly Organic</h2>
            <p>
              Welcome to Rila Groups, a trusted name in the manufacturing of
              premium-quality jaggery and coconut-based products. Rooted in
              tradition and driven by innovation, we deliver pure,
              organic and chemical-free products that bring authentic flavors
              and health benefits to our customers.
            </p>
            <ul className="about-list">
              {WHY_US.map((item) => (
                <li key={item.title}>
                  <span className="about-list-icon">{item.icon}</span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.copy}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
