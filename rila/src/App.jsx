// App.js
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Employee from './Components/Employee';
import Category from './Components/Category';
import AddCategory from './Components/AddCategory';
import AddEmployee from './Components/AddEmployee';
import EditEmployee from './Components/EditEmployee';
import Product from './Components/Product';
import Order from './Components/Order';
import AddProduct from './Components/AddProduct';
import AddOrder from './Components/AddOrder';
import Report from './Components/Report';
import AddSupplier from './Components/AddSupplier';
import EditProduct from './Components/EditProduct';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/dashboard' element={<Dashboard />}>
          <Route path=''element={<Home />}></Route>
          <Route path='/dashboard/employee'element={<Employee />}></Route>
          <Route path='/dashboard/product'element={<Product />}></Route>
          <Route path='/dashboard/orders'element={<Order />}></Route>
          <Route path='/dashboard/category'element={<Category />}></Route>
          <Route path='/dashboard/report'element={<Report />}></Route>
          <Route path='/dashboard/add_category'element={<AddCategory />}></Route>
          <Route path='/dashboard/add_employee'element={<AddEmployee />}></Route>
          <Route path='/dashboard/add_product'element={<AddProduct />}></Route>
          <Route path='/dashboard/add_orders'element={<AddOrder />}></Route>
          <Route path='/dashboard/add_supplier'element={<AddSupplier />}></Route>
          <Route path='/dashboard/edit_employee/:id'element={<EditEmployee />}></Route>
          <Route path='/dashboard/edit_product/:id'element={<EditProduct />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
