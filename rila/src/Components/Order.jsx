import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [orderCountTotal, setOrderCountTotal] = useState(0);

  const navigate = useNavigate();
  const BASE_URL = 'http://localhost:3000';
  
  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/orders`);
      if (response.data && response.data.Status) {
        setOrders(response.data.Result);
      } else {
        console.error('Error fetching orders:', response.data.Error);
        alert(response.data.Error);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      alert('An error occurred while fetching orders. Please try again later.');
    }
  }, [BASE_URL]);
  const fetchOrderCount = () => {
    axios.get('http://localhost:3000/auth/order_count')
        .then(result => {
            if (result.data.Status) {
                // Assuming the API response contains the total number of orders in `result.data.Result[0].total_order_count`
                setOrderCountTotal(result.data.Result[0].total_order_count);
            } else {
                alert(result.data.Error);
            }
        })
        .catch(error => {
            console.error('Error fetching order count:', error);
            alert('Error fetching order count');
        });
};


  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/auth/delete_orders/${id}`);
      if (response.data && response.data.Status) {
        setOrders((prevOrders) => prevOrders.filter((order) => order.order_id !== id));
      } else {
        alert(response.data.Error);
      }
    } catch (error) {
      console.error('Failed to delete order:', error);
      alert('An error occurred while deleting the order. Please try again later.');
    }
  };



  useEffect(() => {
    fetchOrders();
    fetchOrderCount();
  }, [fetchOrders]);

  return (
    <div className="container mt-3">
      <h3 className="text-center">Order List</h3>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Product Details</th>
            <th>Total Price</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id}>
              <td>{order.name}</td>
              <td>{order.product_details}<br></br></td>
              <td>Rs.{order.total_price}</td>
              <td>{`${order.flat},${order.street},${order.city}, ${order.state},${order.pin_code}`}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(order.order_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Order;
