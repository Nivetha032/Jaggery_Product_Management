import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Payment from "./pages/Payment";
import Cart from "./pages/cart";
import Checkout from "./pages/Checkout";

import { ToastProvider } from "./admin/Toast";
import ProtectedRoute from "./admin/ProtectedRoute";
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import Products from "./admin/Products";
import Categories from "./admin/Categories";
import Orders from "./admin/Orders";

function App() {
  return (
    <Router>
      <Routes>
        {/* Storefront */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Admin panel */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ToastProvider>
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            </ToastProvider>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
