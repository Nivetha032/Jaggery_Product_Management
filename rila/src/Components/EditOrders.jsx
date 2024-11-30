import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditOrders = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Initialize state for the order's status
    const [order, setOrder] = useState({
        status: "",
    });

    // Fetch the order details on component mount
    useEffect(() => {
        axios.get(`http://localhost:3001/auth/orders/${id}`)
            .then(result => {
                if (result.data.Status) {
                    // Populate the order state with the fetched data
                    setOrder({
                        status: result.data.Result[0].status,
                    });
                } else {
                    console.error('Error fetching order:', result.data.Error);
                    alert('Failed to fetch order');
                }
            })
            .catch(err => {
                console.error('Error fetching order:', err);
                alert('An error occurred while fetching the order');
            });
    }, [id]);

    // Handle form submission for status update
    const handleSubmit = (e) => {
        e.preventDefault();

        // Send update request to the 'orders' table
        axios.put(`http://localhost:3001/auth/edit_order_status/${id}`, order)
            .then(result => {
                if (result.data.Status) {
                    console.log('Order status updated successfully');
                    // Navigate back to the orders list
                    navigate('/dashboard/orders');
                } else {
                    console.error('Error updating order status:', result.data.Error);
                    alert('Failed to update order status');
                }
            })
            .catch(err => {
                console.error('Error updating order status:', err);
                alert('An error occurred while updating the order status');
            });
    };

    // Handle input change for the status field
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
                <h3 className="text-center">Edit Order Status</h3>
                <form className="row g-1" onSubmit={handleSubmit}>
                    {/* Status Field */}
                    <div className="col-12">
                        <label htmlFor="status" className="form-label">Status</label>
                        <input
                            type="text"
                            className="form-control"
                            id="status"
                            name="status"
                            value={order.status}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="col-12 mt-2">
                        <button type="submit" className="btn btn-primary w-100">Save Status</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditOrders;
