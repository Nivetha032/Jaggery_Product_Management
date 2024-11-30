import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    quantity: "",
    stock:"",
    category_id: "",
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories
    axios.get('http://localhost:3001/auth/category')
      .then(result => {
        if (result.data.Status) {
          setCategories(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      }).catch(err => console.log(err));

    // Fetch product details
    axios.get(`http://localhost:3001/auth/product/${id}`)
      .then(result => {
        const productData = result.data.Result[0];
        setProduct({
          name: productData.name,
          price: productData.price,
          description: productData.description,
          quantity: productData.quantity,
          stock: productData.stock,
          category_id: productData.category_id,
        });
      }).catch(err => console.log(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send the updated product data to the server
    axios.put(`http://localhost:3001/auth/edit_product/${id}`, product)
      .then(result => {
        if (result.data.Status) {
          navigate('/dashboard/product');
        } else {
          alert(result.data.Error);
        }
      }).catch(err => {
        console.log(err);
        alert('An error occurred while updating the product.');
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Product</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Enter Name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              required
            />
          </div>

          {/* Price Input */}
          <div className="col-12">
            <label htmlFor="inputPrice" className="form-label">
              Price
            </label>
            <input
              type="number"
              className="form-control rounded-0"
              id="inputPrice"
              placeholder="Enter Price"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              required
            />
          </div>

          {/* Description Input */}
          <div className="col-12">
            <label htmlFor="inputDescription" className="form-label">
              Description
            </label>
            <textarea
              className="form-control rounded-0"
              id="inputDescription"
              placeholder="Enter Description"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              required
            />
          </div>

          {/* Quantity Input */}
          <div className="col-12">
            <label htmlFor="inputQuantity" className="form-label">
              Quantity
            </label>
            <input
              type="number"
              className="form-control rounded-0"
              id="inputQuantity"
              placeholder="Enter Quantity"
              value={product.quantity}
              onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
              required
            />
          </div>
             {/* Stock Input */}
             <div className="col-12">
            <label htmlFor="inputStock" className="form-label">
              Stock
            </label>
            <input
              type="number"
              className="form-control rounded-0"
              id="inputStock"
              placeholder="Enter Stock"
              value={product.stock}
              onChange={(e) => setProduct({ ...product, stock: e.target.value })}
              required
            />
          </div>

          {/* Category Dropdown */}
          <div className="col-12">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              className="form-select"
              id="category"
              value={product.category_id}
              onChange={(e) => setProduct({ ...product, category_id: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Edit Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
