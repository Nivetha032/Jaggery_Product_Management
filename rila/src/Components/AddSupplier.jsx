import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddSupplier = () => {
    const [supplier, setSupplier] = useState({
        name: "",
        email: "",
        amount: "",
        address: "",
        phone: "",
        image: "",
      });
      const [category, setCategory] = useState([]);
      const navigate = useNavigate()
    
      useEffect(() => {
        axios
          .get("http://localhost:3001/auth/category")
          .then((result) => {
            if (result.data.Status) {
              setCategory(result.data.Result);
            } else {
              alert(result.data.Error);
            }
          })
          .catch((err) => console.log(err));
      }, []);
    
      const handleSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('name', supplier.name);
        formData.append('email', supplier.email);
        formData.append('amount', supplier.amount);
        formData.append('address', supplier.address);
        formData.append('phone', supplier.phone);
    
        axios.post('http://localhost:3001/auth/add_supplier', formData)
        .then(result => {
            if(result.data.Status) {
                navigate('/dashboard/supplier')
            } else {
                alert(result.data.Error)
            }
        })
        .catch(err => console.log(err))
      }
    
      return (
        <div className="d-flex justify-content-center align-items-center mt-3">
          <div className="p-3 rounded w-50 border">
            <h3 className="text-center">Add Supplier</h3>
            <form className="row g-1" onSubmit={handleSubmit}>
              <div className="col-12">
                <label for="inputName" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  id="inputName"
                  placeholder="Enter Name"
                  onChange={(e) =>
                    setSupplier({ ...supplier, name: e.target.value })
                  }
                />
              </div>
              <div className="col-12">
                <label for="inputEmail4" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control rounded-0"
                  id="inputEmail4"
                  placeholder="Enter Email"
                  autoComplete="off"
                  onChange={(e) =>
                    setSupplier({ ...supplier, email: e.target.value })
                  }
                />
              </div>
              <div className="col-12">
                <label for="inputamount" className="form-label">
                  Amount
                </label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  id="inputAmount"
                  placeholder="Enter Amount"
                  autoComplete="off"
                  onChange={(e) =>
                    setSupplier({ ...supplier, amount: e.target.value })
                  }
                />
              </div>
              <div className="col-12">
                <label for="inputAddress" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  id="inputAddress"
                  placeholder="1234 Main St"
                  autoComplete="off"
                  onChange={(e) =>
                    setSupplier({ ...supplier, address: e.target.value })
                  }
                />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100">
                  Add Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }
export default AddSupplier
