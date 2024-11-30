import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, ResponsiveContainer as PieResponsiveContainer } from 'recharts';
import { BarChart, Bar } from 'recharts'; // Import BarChart and Bar

const Report = () => {
    // State variables to hold the counts and data for the new chart
    const [productCount, setProductCount] = useState(0);
    const [employeeTotal, setEmployeeTotal] = useState(0);
    const [orderTotal, setOrderTotal] = useState(0);
    const [salaryTotal, setSalaryTotal] = useState(0);
    const [adminCount, setAdminCount] = useState(0);
    const [orderStatusData, setOrderStatusData] = useState([]);

    // Fetch data functions
    const fetchProductStock = async () => {
        try {
            const response = await axios.get('http://localhost:3001/auth/product_count');
            if (response.data.Status) {
                setProductCount(response.data.Result[0].product); // Adjust the API response based on your data
            } else {
                alert(response.data.Error);
            }
        } catch (error) {
            console.error('Error fetching product stock:', error);
            alert('Error fetching product stock');
        }
    };

    const fetchEmployeeCount = async () => {
        try {
            const response = await axios.get('http://localhost:3001/auth/employee_count');
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

    const fetchOrderData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/auth/order_count');
            if (response.data.Status) {
                setOrderTotal(response.data.Result[0].total_order_price);
            } else {
                alert(response.data.Error);
            }
        } catch (error) {
            console.error('Error fetching order data:', error);
            alert('Error fetching order data');
        }
    };

    const fetchSalaryCount = async () => {
        try {
            const response = await axios.get('http://localhost:3001/auth/salary_count');
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

    const fetchAdminCount = async () => {
        try {
            const response = await axios.get('http://localhost:3001/auth/admin_count');
            if (response.data.Status) {
                setAdminCount(response.data.Result[0].admin);
            } else {
                alert(response.data.Error);
            }
        } catch (error) {
            console.error('Error fetching admin count:', error);
            alert('Error fetching admin count');
        }
    };
    const fetchOrderStatusData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/auth/order_status_count');
            if (response.data.Status) {
                setOrderStatusData(response.data.Result); // Populate the state with the fetched data
            } else {
                alert(response.data.Error);
            }
        } catch (error) {
            console.error('Error fetching order status data:', error);
            alert('Error fetching order status data');
        }
    };

    // Fetch all data when the component mounts
    useEffect(() => {
        fetchProductStock();
        fetchEmployeeCount();
        fetchOrderData();
        fetchSalaryCount();
        fetchAdminCount();
        fetchOrderStatusData();
    }, []);

    // Data for Income vs Salary chart
    const incomeVsSalaryData = [
        { name: 'January', income: orderTotal, salary: salaryTotal },
    ];

    // Employee and Product data for Pie charts
    const EmployeeData = [
        { name: 'Employees', value: employeeTotal, fill: '#4b8b3b' },
    ];

    const ProductData = [
        { name: 'Products', value: productCount, fill: '#cc4e00' },
    ];

    const AdminData = [
        { name: 'Admins', value: adminCount, fill: '#8b0000' },
    ];

    // Order data for BarChart
    const orderData = [
        { name: 'Orders', value: orderTotal, fill: '#1e90ff' },
    ];

    const barChartData = orderStatusData.map((item) => ({
        name: item.order_status,
        count: item.order_count
    }));

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '2rem' }}>
            {/* Income vs Salary (Top Left) */}
            <div style={{ width: '45%', height: 300 }}>
                <h4>Income vs Salary</h4>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={incomeVsSalaryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {/* Line for Income */}
                        <Line type="monotone" dataKey="income" stroke="#4b8b3b" activeDot={{ r: 8 }} />
                        {/* Line for Salary */}
                        <Line type="monotone" dataKey="salary" stroke="#cc4e00" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Employee Count (Top Right) */}
            <div style={{ width: '45%', height: 250 }}>
                <h4>Employee Count</h4>
                <PieResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={EmployeeData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            innerRadius={60} // Doughnut effect
                            fill="#4b8b3b"
                            label
                        />
                    </PieChart>
                </PieResponsiveContainer>
            </div>

            {/* Admin Count (Bottom Left) */}
            <div style={{ width: '45%', height: 250 }}>
                <h4>Admin Count</h4>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={AdminData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#8b0000" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Product Count (Bottom Right) */}
            <div style={{ width: '45%', height: 250 }}>
                <h4>Product Count</h4>
                <PieResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={ProductData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            innerRadius={60} // Doughnut effect
                            fill="#cc4e00"
                            label
                        />
                    </PieChart>
                </PieResponsiveContainer>
            </div>

            {/* Order Count (Bottom Right) */}
             <div style={{ width: '45%', height: 300 }}>
            <h4>Order Status (Delivered vs Pending)</h4>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#4b8b3b" barSize={50}/>
                </BarChart>
            </ResponsiveContainer>
        </div>
        </div>
    );
};

export default Report;
