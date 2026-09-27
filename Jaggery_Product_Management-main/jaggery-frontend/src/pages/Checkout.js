import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Checkout.css";

const FIELDS = [
  { name: "name", label: "Full Name", type: "text" },
  { name: "number", label: "Phone Number", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "flat", label: "Flat / House No.", type: "text" },
  { name: "street", label: "Street", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "state", label: "State", type: "text" },
  { name: "country", label: "Country", type: "text" },
  { name: "pin_code", label: "Pin Code", type: "text" },
];

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, total } = location.state || { cart: [], total: 0 };

  const productNames = cart.map((item) => item.name).join(", ");

  const [formData, setFormData] = useState({
    product_name: productNames,
    name: "",
    number: "",
    flat: "",
    street: "",
    city: "",
    email: "",
    state: "",
    country: "",
    pin_code: "",
    total_price: total,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      product_name: cart.map((item) => item.name).join(", "),
      total_price: total,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, total]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    const orderData = { ...formData, products: cart };

    try {
      const response = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      await response.json();
      alert("Order placed successfully!");
      navigate("/");
    } catch (error) {
      console.error("Order failed:", error.message);
      alert("Failed to place order. Check console for details.");
    }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <div className="checkout-container">
        <h1>Checkout</h1>

        <div className="checkout-layout">
          <div className="checkout-form-card">
            <h3>Shipping Details</h3>
            <div className="checkout-form">
              {FIELDS.map((field) => (
                <div className="form-field" key={field.name}>
                  <label>{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="checkout-summary-card">
            <h3>Order Summary</h3>
            <div className="checkout-items">
              {cart.map((item) => (
                <div className="checkout-item" key={item.id}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>Rs.{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="checkout-total">
              <span>Total</span>
              <span>Rs.{formData.total_price.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary btn-block place-order-btn" onClick={handleOrder}>
              Place Order
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
