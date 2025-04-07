import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./Cart.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateQuantity = (productId, amount, stock) => {
    const updatedCart = cart.map((item) => {
      if (item.id === productId) {
        const newQuantity = item.quantity + amount;

        if (newQuantity > stock) {
          return { ...item, outOfStock: true };
        }

        return newQuantity > 0 ? { ...item, quantity: newQuantity, outOfStock: false } : null;
      }
      return item;
    }).filter(item => item !== null);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const navigate = useNavigate();

const handleCheckout = () => {
  navigate("/checkout", { state: { cart, total: calculateTotal() } });
};

  return (
    <div>
      <Navbar />
      <div className="cart-container">
        <h2>Your Shopping Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img
                  src={item.image ? `http://localhost:3001/images/${item.image}` : "https://via.placeholder.com/100"}
                  alt={item.name}
                  width="80"
                  height="80"
                />
                <div className="cart-details">
                  <h3>{item.name}</h3>
                  <p>Price: Rs.{item.price}</p>
                  <p><strong>Total:</strong> Rs.{(item.price * item.quantity).toFixed(2)}</p>
                 
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
                {item.outOfStock && <p className="out-of-stock-msg">Out of Stock</p>}
              </div>
            ))}

            {/* Grand Total & Checkout Container */}
            <div className="cart-summary">
              <h3 className="cart-total">Grand Total: Rs.{calculateTotal().toFixed(2)}</h3>
              <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
            </div>

          </div>
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

export default Cart;
