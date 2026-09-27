import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer-section" id="contact">
      <div className="footer-inner container">
        <div className="footer-col footer-brand">
          <h3>Rila Groups</h3>
          <p>
            Premium, chemical-free jaggery and coconut products, made the
            traditional way for a healthier every day.
          </p>
          <div className="footer-social">
            <a href="#top" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#top" aria-label="Instagram"><FaInstagram /></a>
            <a href="#top" aria-label="Twitter"><FaTwitter /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/#about">About</a></li>
            <li><a href="/#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact Us</h4>
          <ul className="footer-contact">
            <li><FaEnvelope /> info@jaggerystore.com</li>
            <li><FaPhoneAlt /> +123 456 7890</li>
            <li><FaMapMarkerAlt /> 123 Jaggery Street, India</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Newsletter</h4>
          <p className="footer-newsletter-copy">Get updates on new products and offers.</p>
          <form className="footer-newsletter" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <button type="submit" className="btn btn-primary btn-block">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Rila Groups. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
