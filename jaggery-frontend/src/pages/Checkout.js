import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";


const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, total } = location.state || { cart: [], total: 0 };

  // Extracting product names from the cart
  const productNames = cart.map((item) => item.name).join(", ");

  // State for form data
  const [formData, setFormData] = useState({
    product_name: productNames,
    name:"",
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

  // Update product_name and total_price when cart changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      product_name: cart.map((item) => item.name).join(", "),
      total_price: total,
    }));
  }, [cart, total]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Order Submission
  const handleOrder = async () => {
    const orderData = { ...formData, products: cart };
    console.log("Sending Order Data:", orderData); // Debugging

    try {
      const response = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Handle non-JSON errors
        throw new Error(errorText);
      }

      const data = await response.json();
      alert("Order placed successfully!");
      navigate("/");
    } catch (error) {
      console.error("Order failed:", error.message);
      alert("Failed to place order. Check console for details.");
    }
  };

  return (
    <div className="checkout-container">
    <h2>Checkout</h2>
  
    <div className="cart-summary">
      {cart.map((item) => (
        <p key={item.id}>
          {item.name} - Rs.{item.price} x {item.quantity}
        </p>
      ))}
    </div>
  
    <div className="checkout-form">
      <input type="text" name="product_name" value={formData.product_name} readOnly />
      <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
      <input type="text" name="number" placeholder="Number" onChange={handleChange} required />
      <input type="text" name="flat" placeholder="Flat No" onChange={handleChange} required />
      <input type="text" name="street" placeholder="Street" onChange={handleChange} required />
      <input type="text" name="city" placeholder="City" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="text" name="state" placeholder="State" onChange={handleChange} required />
      <input type="text" name="country" placeholder="Country" onChange={handleChange} required />
      <input type="text" name="pin_code" placeholder="Pin Code" onChange={handleChange} required />
    </div>
  
    <div className="total-price">Total Price: Rs.{formData.total_price.toFixed(2)}</div>
    <button className="place-order-btn" onClick={handleOrder}>Place Order</button>
  </div>
  
  );
};

export default Checkout;
