import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Report = () => {
    // State variables
    const [adminTotal, setAdminTotal] = useState(0);
    const [employeeTotal, setEmployeeTotal] = useState(0);
    const [salaryTotal, setSalaryTotal] = useState(0);
    const [orderTotal, setOrderTotal] = useState(0);
    const [totalOrderCount, setTotalOrderCount] = useState(0);
    const [productTotal, setProductTotal] = useState(0);
    const [admins, setAdmins] = useState([]);

    // Function to fetch admin count
    const fetchAdminCount = async () => {
        try {
            const response = await axios.get('http://localhost:3000/auth/admin_count');
            if (response.data.Status) {
                setAdminTotal(response.data.Result[0].admin);
            } else {
                alert(response.data.Error);
            }
        } catch (error) {
            console.error('Error fetching admin count:', error);
            alert('Error fetching admin count');
        }
    };

    // Function to fetch employee count
    const fetchEmployeeCount = async () => {
        try {
            const response = await axios.get('http://localhost:3000/auth/employee_count');
            if (response.data.Status) {
                setEmployeeTotal(response.data.Result[0].employee);
            } else {
                alert(response.data.Error);
            }
        } catch (error) {
            console.error('Error fetching employee count:', error);
            alert('Error fetching employee count');
        }
    };

    const fetchOrderCount = async () => {
      try {
          const response = await axios.get('http://localhost:3000/auth/ordertot_count');
          if (response.data.Status) {
            setTotalOrderCount(response.data.Result[0].order);
          } else {
              alert(response.data.Error);
          }
      } catch (error) {
          console.error('Error fetching order count:', error);
          alert('Error fetching order count');
      }
  };

    // Function to fetch product count
    const fetchProductCount = async () => {
        try {
            const response = await axios.get('http://localhost:3000/auth/product_count');
            if (response.data.Status) {
                setProductTotal(response.data.Result[0].product);
            } else {
                alert(response.data.Error);
            }
        } catch (error) {
            console.error('Error fetching product count:', error);
            alert('Error fetching product count');
        }
    };

    // Function to fetch salary count
    const fetchSalaryCount = async () => {
        try {
            const response = await axios.get('http://localhost:3000/auth/salary_count');
            if (response.data.Status) {
                setSalaryTotal(response.data.Result[0].salaryOFEmp);
            } else {
                alert(response.data.Error);
            }
        } catch (error) {
            console.error('Error fetching salary count:', error);
            alert('Error fetching salary count');
        }
    };

    // Function to fetch order data
    const fetchOrderData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/auth/order_count');
            if (response.data.Status) {
                setOrderTotal(response.data.Result[0].total_order_price);
                setTotalOrderCount(response.data.Result[0].order);
            } else {
                alert(response.data.Error);
            }
        } catch (error) {
            console.error('Error fetching order data:', error);
            alert('Error fetching order data');
        }
    };

    // Function to fetch admin records
    const fetchAdminRecords = async () => {
        try {
            const response = await axios.get('http://localhost:3000/auth/admin_records');
            if (response.data.Status) {
                setAdmins(response.data.Result);
            } else {
                alert(response.data.Error);
            }
        } catch (error) {
            console.error('Error fetching admin records:', error);
            alert('Error fetching admin records');
        }
    };

    // Fetch all data when the component mounts
    useEffect(() => {
        fetchAdminCount();
        fetchEmployeeCount();
        fetchSalaryCount();
        fetchOrderData();
        fetchOrderCount();
        fetchProductCount();
        fetchAdminRecords();
    }, []);

    return (
        <div>
            <div className="p-3 d-flex justify-content-around mt-3">
                {/* Orders Section */}
                <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
                    <div className="text-center pb-1">
                        <h4>Orders</h4>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                        <h5>Total Orders:</h5>
                        {/* <h5>{totalOrderCount}</h5> */}
                        <h5>6</h5>
                    </div>
                </div>

                {/* Employee Section */}
                <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
                    <div className="text-center pb-1">
                        <h4>Employee</h4>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                        <h5>Total:</h5>
                        <h5>{employeeTotal}</h5>
                    </div>
                </div>

                {/* Product Section */}
                <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
                    <div className="text-center pb-1">
                        <h4>Product</h4>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                        <h5>Total:</h5>
                        <h5>{productTotal}</h5>
                    </div>
                </div>
            </div>

            {/* Income and Salary Sections */}
            <div className="p-3 d-flex justify-content-around mt-3">
                {/* Income Section */}
                <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
                    <div className="text-center pb-1">
                        <h4>Income</h4>
                    </div>
                    <hr/>
                    <div className="d-flex justify-content-between">
                        <h5>Total:</h5>
                        <h5>Rs.{orderTotal}</h5>
                    </div>
                </div>
                
                {/* Salary Section */}
                <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
                    <div className="text-center pb-1">
                        <h4>Salary</h4>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                        <h5>Total:</h5>
                        <h5>Rs.{salaryTotal}</h5>
                    </div>
                </div>
            </div>

            {/* List of Admins Section */}
            <div className="mt-4 px-5 pt-3">
                <h3>List of Admins</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((admin) => (
                            <tr key={admin.email}>
                                <td>{admin.email}</td>
                                <td>
                                    <button className="btn btn-info btn-sm me-2">Edit</button>
                                    <button className="btn btn-warning btn-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Report;
