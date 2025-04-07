import React from "react";
import "./navbar.css"; // Ensure this CSS file exists

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Rila Groups</h1>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
