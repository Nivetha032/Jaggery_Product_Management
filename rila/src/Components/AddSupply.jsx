import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddSupply = () => {
    const [supply, setSupply] = useState({
        name: "",
        email: "",
        amount: "",
        phone: "",
        address: "",
    });
    const [category, setCategory] = useState([]);
    const navigate = useNavigate();

    // useEffect(() => {
    //     axios
    //         .get("http://localhost:3000/auth/category")
    //         .then((result) => {
    //             if (result.data.Status) {
    //                 setCategory(result.data.Result);
    //             } else {
    //                 alert(result.data.Error);
    //             }
    //         })
    //         .catch((err) => console.error(err));
    // }, []); // Added dependency array

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', supply.name);
        formData.append('email', supply.email);
        formData.append('amount', supply.amount);
        formData.append('address', supply.address);
        formData.append('phone', supply.phone);

        axios
            .post("http://localhost:3001/auth/add_supply", formData)
            .then((result) => {
                if (result.data.Status) {
                    navigate("/dashboard/supply");
                } else {
                    alert(result.data.Error);
                }
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className="d-flex justify-content-center align-items-center mt-3">
            <div className="p-3 rounded w-50 border">
                <h3 className="text-center">Add Supplier</h3>
                <form className="row g-1" onSubmit={handleSubmit}>
                    <div className="col-12">
                        <label htmlFor="inputName" className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control rounded-0"
                            id="inputName"
                            placeholder="Enter Name"
                            required
                            onChange={(e) => setSupply({ ...supply, name: e.target.value })}
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputEmail" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control rounded-0"
                            id="inputEmail"
                            placeholder="Enter Email"
                            required
                            onChange={(e) => setSupply({ ...supply, email: e.target.value })}
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputAmount" className="form-label">Amount</label>
                        <input
                            type="text"
                            className="form-control rounded-0"
                            id="inputAmount"
                            placeholder="Enter Amount"
                            required
                            onChange={(e) => setSupply({ ...supply, amount: e.target.value })}
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputPhone" className="form-label">Phone</label>
                        <input
                            type="tel"
                            className="form-control rounded-0"
                            id="inputPhone"
                            placeholder="Enter Phone"
                            required
                            onChange={(e) => setSupply({ ...supply, phone: e.target.value })}
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputAddress" className="form-label">Address</label>
                        <input
                            type="text"
                            className="form-control rounded-0"
                            id="inputAddress"
                            placeholder="1234 Main St"
                            required
                            onChange={(e) => setSupply({ ...supply, address: e.target.value })}
                        />
                    </div>
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary w-100">Add Supplier</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSupply;
