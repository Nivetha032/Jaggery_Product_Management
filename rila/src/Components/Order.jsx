import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx'; // Import the xlsx library

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [orderCountTotal, setOrderCountTotal] = useState(0);
  const [editingOrder, setEditingOrder] = useState(null);
  const [updatedOrder, setUpdatedOrder] = useState({
    order_id: '',
    order_status: '', // Only update the status field
  });

  const [searchProduct, setSearchProduct] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

  const navigate = useNavigate();
  const BASE_URL = 'http://localhost:3001';

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
    axios.get(`${BASE_URL}/auth/order_count`)
      .then(result => {
        if (result.data.Status) {
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
    if (window.confirm('Are you sure you want to delete this order?')) {
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
    }
  };

  const handleUpdate = async () => {
    if (!updatedOrder.order_status.trim()) {
      alert('Order status cannot be empty');
      return;
    }

    try {
      const response = await axios.put(`${BASE_URL}/auth/update_order/${updatedOrder.order_id}`, updatedOrder);
      if (response.data && response.data.Status) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === updatedOrder.order_id ? { ...order, order_status: updatedOrder.order_status } : order
          )
        );
        alert('Order status updated successfully!');
        setEditingOrder(null); // Close the edit form after successful update
      } else {
        alert(response.data.Error);
      }
    } catch (error) {
      console.error('Failed to update order:', error);
      alert('An error occurred while updating the order. Please try again later.');
    }
  };

  const filteredOrders = orders.filter((order) => {
    const productMatch = order.product_name.toLowerCase().includes(searchProduct.toLowerCase());
    const statusMatch = order.order_status.toLowerCase().includes(searchStatus.toLowerCase());
    return productMatch && statusMatch;
  });

  // Function to export data as Excel file
  const exportToExcel = () => {
    // Create a worksheet from the filtered orders data
    const ws = XLSX.utils.json_to_sheet(filteredOrders, {
      header: ['order_id', 'product_name', 'name', 'number', 'email', 'flat', 'street', 'city', 'state', 'country', 'pin_code', 'total_price', 'order_status', 'created_at', 'updated_at'],
    });

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');

    // Save the file with a specified name
    XLSX.writeFile(wb, 'orders.xlsx');
  };

  useEffect(() => {
    fetchOrders();
    fetchOrderCount();
  }, [fetchOrders]);

  return (
    
    <div className="container mt-3">
      <h3 className="text-center">Order List</h3>
 {/* Export Button */}
 <div className="d-flex justify-content-end mb-3">
  <button className="btn btn-primary" onClick={exportToExcel}>
    Export
  </button>
</div>

      {/* Search Filters */}
      <div className="row mb-3">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Product"
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
          />
        </div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Status"
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
          />
        </div>
      </div>

     

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Product Details</th>
            <th>Total Price</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.order_id}>
              <td>{order.name}</td>
              <td>{order.product_name}</td>
              <td>Rs.{order.total_price}</td>
              <td>{`${order.flat}, ${order.street}, ${order.city}, ${order.state}, ${order.pin_code}`}</td>
              <td>{order.order_status}</td>
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

      {/* Edit Form */}
      {editingOrder && (
        <div className="mt-4">
          <h4>Edit Order Status</h4>
          <form>
            <div className="form-group">
              <label>Status</label>
              <input
                type="text"
                className="form-control"
                value={updatedOrder.order_status}
                onChange={(e) => setUpdatedOrder({ ...updatedOrder, order_status: e.target.value })}
              />
            </div>
            <button type="button" className="btn btn-success mt-3" onClick={handleUpdate}>
              Update Status
            </button>
            <button type="button" className="btn btn-secondary mt-3 ml-2" onClick={() => setEditingOrder(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Order;
