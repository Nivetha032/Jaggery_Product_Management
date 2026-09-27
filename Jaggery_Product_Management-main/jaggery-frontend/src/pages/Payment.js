import React, { useState } from "react";
import { FaLock, FaCcVisa, FaCcMastercard } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Payment.css";

const Payment = () => {
  const [form, setForm] = useState({ cardNumber: "", expiry: "", cvv: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Payment submitted!");
  };

  return (
    <div className="page-shell">
      <Navbar />
      <div className="payment-container">
        <div className="payment-card">
          <div className="payment-card-header">
            <h1>Payment Details</h1>
            <span className="badge"><FaLock size={11} /> Secure</span>
          </div>
          <p className="payment-subtitle">Enter your card information to complete the purchase.</p>

          <form className="payment-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9101 1121"
                value={form.cardNumber}
                onChange={handleChange}
              />
            </div>

            <div className="payment-form-row">
              <div className="form-field">
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  value={form.expiry}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  placeholder="123"
                  value={form.cvv}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Pay Now
            </button>

            <div className="payment-icons">
              <FaCcVisa size={30} />
              <FaCcMastercard size={30} />
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payment;
