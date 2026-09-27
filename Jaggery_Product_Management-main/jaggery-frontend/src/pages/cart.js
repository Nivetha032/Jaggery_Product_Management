import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { FaMinus, FaPlus, FaTrash, FaShoppingBag } from "react-icons/fa";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateQuantity = (productId, amount, stock) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === productId) {
          const newQuantity = item.quantity + amount;

          if (stock && newQuantity > stock) {
            return { ...item, outOfStock: true };
          }

          return newQuantity > 0
            ? { ...item, quantity: newQuantity, outOfStock: false }
            : null;
        }
        return item;
      })
      .filter((item) => item !== null);

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

  const handleCheckout = () => {
    navigate("/checkout", { state: { cart, total: calculateTotal() } });
  };

  return (
    <div className="page-shell">
      <Navbar />
      <div className="cart-container">
        <h2>Your Shopping Cart</h2>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <FaShoppingBag size={38} />
            <p>Your cart is empty.</p>
            <button className="btn btn-primary" onClick={() => navigate("/products")}>
              Browse Products
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img
                    src={
                      item.image
                        ? `http://localhost:3001/images/${item.image}`
                        : "https://via.placeholder.com/100"
                    }
                    alt={item.name}
                  />

                  <div className="cart-details">
                    <h3>{item.name}</h3>
                    <p className="cart-item-price">Rs.{item.price} / kg</p>

                    <div className="quantity-control">
                      <button
                        onClick={() => updateQuantity(item.id, -1, item.stock)}
                        aria-label="Decrease quantity"
                      >
                        <FaMinus size={11} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1, item.stock)}
                        aria-label="Increase quantity"
                      >
                        <FaPlus size={11} />
                      </button>
                    </div>

                    {item.outOfStock && (
                      <p className="out-of-stock-msg">Requested quantity exceeds available stock</p>
                    )}
                  </div>

                  <div className="cart-item-right">
                    <p className="cart-item-total">Rs.{(item.price * item.quantity).toFixed(2)}</p>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      <FaTrash size={13} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="cart-summary-row">
                <span>Items</span>
                <span>{cart.reduce((n, i) => n + i.quantity, 0)}</span>
              </div>
              <div className="cart-summary-row cart-summary-total">
                <span>Grand Total</span>
                <span>Rs.{calculateTotal().toFixed(2)}</span>
              </div>
              <button className="btn btn-primary btn-block checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
