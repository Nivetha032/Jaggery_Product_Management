import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Product = () => {
  const [product, setProduct] = useState([]);
  const navigate = useNavigate()


  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/product")
      .then((result) => {
        if (result.data.Status) {
          setProduct(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);
  const handleDelete = (id) => {
    axios.delete('http://localhost:3000/auth/delete_product/'+id)
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
        <h3>Product List</h3>
      </div>
      <Link to="/dashboard/add_product" className="btn btn-success">
        Add Product
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Price</th>
              <th>quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {product.map((p) => (
              <tr>
                <td>{p.name}</td>
                <td>
                  <img
                    src={`http://localhost:3000/Images/` + p.image}
                    className="employee_image"
                  />
                </td>
                <td>Rs.{p.price}</td>
                <td>{p.quantity}/pack</td>
                
                <td>
                  <Link
                    to={`/dashboard/edit_product/` + p.id}
                    className="btn btn-info btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(p.id)}
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

export default Product;
