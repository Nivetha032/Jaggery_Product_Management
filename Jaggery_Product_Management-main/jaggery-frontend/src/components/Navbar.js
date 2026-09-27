import React, { useEffect, useState } from "react";
import { FaShoppingBasket, FaBars, FaTimes } from "react-icons/fa";
import "./navbar.css";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-inner">
        <a href="/" className="navbar-brand">
          <span className="navbar-brand-mark">RG</span>
          <span className="navbar-brand-text">
            Rila Groups
            <small>Pure &amp; Traditional</small>
          </span>
        </a>

        <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <a href="/cart" className="navbar-cart" aria-label="View cart">
            <FaShoppingBasket size={19} />
          </a>
          <button
            className="navbar-toggle"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
