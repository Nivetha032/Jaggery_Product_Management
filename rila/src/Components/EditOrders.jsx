import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditOrders = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Initialize the order state
    const [order, setOrder] = useState({
        order_id: "",
        customer_name: "",
        product_name: "",
        price: "",
        quantity: "",
        address: "",
    });

    // Fetch the order details on component mount
    useEffect(() => {
        axios.get(`http://localhost:3000/auth/orders/${id}`)
            .then(result => {
                if (result.data.Status) {
                    // Populate the order state with the fetched data
                    setOrder({
                        order_id: result.data.Result[0].order_id,
                        customer_name: result.data.Result[0].customer_name,
                        product_name: result.data.Result[0].product_name,
                        price: result.data.Result[0].price,
                        quantity: result.data.Result[0].quantity,
                        address: result.data.Result[0].address,
                    });
                } else {
                    console.error('Error fetching order:', result.data.Error);
                }
            })
            .catch(err => console.error('Error fetching order:', err));
    }, [id]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Send update request
        axios.put(`http://localhost:3000/edit_orders/${id}`, order)
            .then(result => {
                if (result.data.Status) {
                    console.log('Order updated successfully');
                    // Navigate back to the orders list or wherever you want
                    navigate('/dashboard/orders');
                } else {
                    console.error('Error updating order:', result.data.Error);
                }
            })
            .catch(err => console.error('Error updating order:', err));
    };

    // Handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrder({
            ...order,
            [name]: value,
        });
    };

    return (
        <div className="d-flex justify-content-center align-items-center mt-3">
            <div className="p-3 rounded w-50 border">
                <h3 className="text-center">Edit Order</h3>
                <form className="row g-1" onSubmit={handleSubmit}>
                    {/* Order ID */}
                    <div className="col-12">
                        <label htmlFor="order_id" className="form-label">Order ID</label>
                        <input
                            type="text"
                            className="form-control"
                            id="order_id"
                            name="order_id"
                            value={order.order_id}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Customer Name */}
                    <div className="col-12">
                        <label htmlFor="customer_name" className="form-label">Customer Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="customer_name"
                            name="customer_name"
                            value={order.customer_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Product Name */}
                    <div className="col-12">
                        <label htmlFor="product_name" className="form-label">Product Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="product_name"
                            name="product_name"
                            value={order.product_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Price */}
                    <div className="col-12">
                        <label htmlFor="price" className="form-label">Price</label>
                        <input
                            type="number"
                            className="form-control"
                            id="price"
                            name="price"
                            value={order.price}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Quantity */}
                    <div className="col-12">
                        <label htmlFor="quantity" className="form-label">Quantity</label>
                        <input
                            type="number"
                            className="form-control"
                            id="quantity"
                            name="quantity"
                            value={order.quantity}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Address */}
                    <div className="col-12">
                        <label htmlFor="address" className="form-label">Address</label>
                        <input
                            type="text"
                            className="form-control"
                            id="address"
                            name="address"
                            value={order.address}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="col-12 mt-2">
                        <button type="submit" className="btn btn-primary w-100">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditOrders;
