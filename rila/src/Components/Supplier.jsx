import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Supplier = () => {
    const [supplier, setSupplier] = useState([]);
    const navigate = useNavigate()
  
    useEffect(() => {
      axios
        .get("http://localhost:3000/auth/supplier")
        .then((result) => {
          if (result.data.Status) {
            setSupplier(result.data.Result);
          } else {
            alert(result.data.Error);
          }
        })
        .catch((err) => console.log(err));
    }, []);
    const handleDelete = (id) => {
      axios.delete('http://localhost:3000/auth/delete_supplier/'+id)
      .then(result => {
          if(result.data.Status) {
              window.location.reload()
          } else {
              alert(result.data.Error)
          }
      })
    } 
    return (
      <div className="px-5 mt-3">
        <div className="d-flex justify-content-center">
          <h3>Supplier List</h3>
        </div>
        <Link to="/dashboard/add_supplier" className="btn btn-success">
          Add Supplier
        </Link>
        <div className="mt-3">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                {/* <th>Image</th> */}
                <th>Email</th>
                <th>Address</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {supplier.map((e) => (
                <tr>
                  <td>{e.name}</td>
                  {/* <td>
                    <img
                      src={`http://localhost:3000/Images/` + e.image}
                      className="product_image"
                    />
                  </td> */}
                  <td>{e.email}</td>
                  <td>{e.address}</td>
                  <td>{e.amount}</td>
                  <td>
                    <Link
                      to={`/dashboard/edit_supplier/` + e.id}
                      className="btn btn-info btn-sm me-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleDelete(e.id)}
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
}

export default Supplier
