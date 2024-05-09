import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddOrder = () => {
  const [order, setOrder] = useState({
    name: "",
    number: "",
    email: "",
    method: "",
    flat: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pin_code: "",
    total_products: "",
    total_price: "",
    image: null
  });

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object with the order data
    const formData = new FormData();
    formData.append("name", order.name);
    formData.append("number", order.number);
    formData.append("email", order.email);
    formData.append("method", order.method);
    formData.append("flat", order.flat);
    formData.append("street", order.street);
    formData.append("city", order.city);
    formData.append("state", order.state);
    formData.append("country", order.country);
    formData.append("pin_code", order.pin_code);
    formData.append("total_products", order.total_products);
    formData.append("total_price", order.total_price);
    formData.append("image", order.image);

    try {
      // Send a POST request to add the order
      const response = await axios.post('http://localhost:3000/auth/add_orders', formData);

      // Check response status and data
      if (response.data && response.data.Status) {
        // Redirect to the order list page if the request was successful
        navigate('/dashboard/orders');
      } else {
        // Check if the response contains an error message
        const errorMessage = response.data.Error || "An unknown error occurred.";
        console.error("Error adding order:", errorMessage);
        alert(errorMessage);
      }
    } catch (error) {
      // Log the error for debugging purposes
      console.error("Failed to add order:", error);
      alert("An error occurred while adding the order. Please try again later.");
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setOrder({ ...order, image: file });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Order</h3>
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="name" className="form-label">Customer Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={order.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="number" className="form-label">Customer Phone Number</label>
            <input
              type="text"
              className="form-control"
              id="number"
              name="number"
              placeholder="Enter your phone number"
              value={order.number}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="email" className="form-label">Customer Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={order.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="method" className="form-label">Payment Method</label>
            <select
              name="method"
              id="method"
              className="form-select"
              value={order.method}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select payment method</option>
              <option value="cash on delivery">Cash on Delivery</option>
              <option value="credit card">Credit Card</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="flat" className="form-label">Flat</label>
            <input
              type="text"
              className="form-control"
              id="flat"
              name="flat"
              placeholder="Enter your flat number"
              value={order.flat}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="street" className="form-label">Street</label>
            <input
              type="text"
              className="form-control"
              id="street"
              name="street"
              placeholder="Enter your street name"
              value={order.street}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="city" className="form-label">City</label>
            <input
              type="text"
              className="form-control"
              id="city"
              name="city"
              placeholder="Enter your city"
              value={order.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="state" className="form-label">State</label>
            <input
              type="text"
              className="form-control"
              id="state"
              name="state"
              placeholder="Enter your state"
              value={order.state}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="country" className="form-label">Country</label>
            <input
              type="text"
              className="form-control"
              id="country"
              name="country"
              placeholder="Enter your country"
              value={order.country}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="pin_code" className="form-label">PIN Code</label>
            <input
              type="text"
              className="form-control"
              id="pin_code"
              name="pin_code"
              placeholder="Enter your PIN code"
              value={order.pin_code}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="total_products" className="form-label">Total Products</label>
            <textarea
              className="form-control"
              id="total_products"
              name="total_products"
              placeholder="Enter product details"
              value={order.total_products}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="total_price" className="form-label">Total Price</label>
            <input
              type="number"
              className="form-control"
              id="total_price"
              name="total_price"
              placeholder="Enter total price"
              value={order.total_price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-12 mb-3">
            <label htmlFor="image" className="form-label">Product Image</label>
            <input
              type="file"
              className="form-control"
              id="image"
              name="image"
              onChange={handleFileChange}
              required
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">Add Order</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrder;
