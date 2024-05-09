import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SupplyList = () => {
    const [supplies, setSupplies] = useState([]);
    const navigate = useNavigate();

    // Fetch supplies on component mount
    useEffect(() => {
        const fetchSupplies = async () => {
            try {
                const response = await axios.get("http://localhost:3000/auth/supply");
                if (response.data.Status) {
                    setSupplies(response.data.Result);
                } else {
                    alert(response.data.Error);
                }
            } catch (error) {
                console.error("Error fetching supplies:", error);
                alert("An error occurred while fetching supplies. Please try again later.");
            }
        };

        fetchSupplies();
    }, []);

    // Handle delete functionality
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3000/auth/delete_supply/${id}`);
            if (response.data.Status) {
                // Remove the deleted supply from the state
                setSupplies((prevSupplies) => prevSupplies.filter((supply) => supply.id !== id));
            } else {
                alert(response.data.Error);
            }
        } catch (error) {
            console.error("Error deleting supply:", error);
            alert("An error occurred while deleting the supply. Please try again later.");
        }
    };

    return (
        <div className="container mt-3">
            <div className="d-flex justify-content-center">
                <h3>Supply List</h3>
            </div>
            <Link to="/dashboard/add_supply" className="btn btn-success">Add Supply</Link>
            <div className="mt-3">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {supplies.map((supply) => (
                            <tr key={supply.id}>
                                <td>{supply.name}</td>
                                <td>{supply.email}</td>
                                <td>{supply.address}</td>
                                <td>{supply.amount}</td>
                                <td>
                                    <Link
                                        to={`/dashboard/edit_supply/${supply.id}`}
                                        className="btn btn-info btn-sm me-2"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        className="btn btn-warning btn-sm"
                                        onClick={() => handleDelete(supply.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SupplyList;
