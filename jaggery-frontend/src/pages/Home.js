import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Import the CSS file
import Navbar from "../components/Navbar"; // Import the Navbar component
import videoFile from "../assets/videos/section1.mp4";
import aboutImage from "../assets/images/about.png"; // Adjust the path

// Import product images
import jaggeryBlockImage from "../assets/images/coconut.jpg";
import jaggeryPowderImage from "../assets/images/jaggery_powder.jpg";
import organicJaggeryImage from "../assets/images/sweets.webp";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* First Section - Video */}
      <section className="video-section">
        <video autoPlay loop muted className="background-video">
          <source src={videoFile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay">
          Organic Jaggery Products with No Preservatives
        </div>
      </section>

      {/* Second Section - Products */}
      <section className="products-section">
        <h2>Our Products</h2>
        <div className="products-container">
          <div className="product-card">
            <img src={jaggeryBlockImage} alt="Jaggery Block" className="product-image"/>
            <h3>Coconut products</h3>
            <button onClick={() => navigate("/products")}>View</button>
          </div>
          <div className="product-card">
            <img src={jaggeryPowderImage} alt="Jaggery Powder" className="product-image"/>
            <h3>Jaggery Powder</h3>
            <button onClick={() => navigate("/products")}>View</button>
          </div>
          <div className="product-card">
            <img src={organicJaggeryImage} alt="Organic Jaggery" className="product-image"/>
            <h3>Sweets</h3>
            <button onClick={() => navigate("/products")}>View</button>
          </div>
        </div>
      </section>

      {/* Third Section - About */}
      <section className="about-section" id="about">
        <div className="about-content">
          <h2>About Us</h2>
          <p>Welcome to Rila Groups, a trusted name in the manufacturing of premium-quality jaggery and coconut-based products. Rooted in tradition and driven by innovation, we are committed to delivering pure, organic, and chemical-free products that bring authentic flavors and health benefits to our customers.
    <br/>  ✅ 100% Natural & Organic – No chemicals, no preservatives, just pure goodness.
    <br/>✅ Sourced Directly from Farmers – We work closely with local farmers to ensure fresh and high-quality raw materials.
    <br/>✅ Traditional Manufacturing Process – We follow time-honored techniques to retain the natural nutrients and taste.
    <br/>✅ Eco-Friendly & Sustainable – Our products support sustainable farming and eco-friendly packaging solutions.</p>
  </div>
        <div className="about-image">
          <img src={aboutImage} alt="About Us" />
        </div>
      </section>

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

export default Home;
