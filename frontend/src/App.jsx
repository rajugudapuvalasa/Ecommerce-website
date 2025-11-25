import React from "react";
import "./App.css";
import { BrowserRouter , Route, Routes } from "react-router-dom"
import Header from "./Components/Header/Header";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Home from "./pages/homepage/Home";
import Product from "./pages/homepage/Product";
import Contact from "./pages/homepage/Contact";
import Fashion from "./pages/homepage/Fashion";
import { IoBagHandleSharp } from "react-icons/io5";
import Footer from "./Components/Footer/Footer";
import Blogs from "./pages/Blogs";
import Dashboard from "./admin/Dashboard";
import Orders from "./admin/Orders";
import Products from "./admin/Products";
import Users from "./admin/Users";
import Banners from "./admin/Banners";
import PrivateRoute from "./PrivateRoute";
import SingleProduct from "./Components/SingleProduct";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/product" element={<PrivateRoute><Product /></PrivateRoute>} />
        <Route path="/contact" element={<PrivateRoute><Contact /></PrivateRoute>} />
        <Route path="/fashion" element={<PrivateRoute><Fashion /></PrivateRoute>} />
        <Route path="/blogs" element={<PrivateRoute><Blogs /></PrivateRoute>} />
        <Route path="/product/:id" element={<PrivateRoute><SingleProduct /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} >
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="users" element={<Users />} />
          <Route path="banners" element={<Banners />} />

        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
