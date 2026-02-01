import React from "react";
import "./App.css";
import { BrowserRouter , Route, Routes } from "react-router-dom"
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import Cart from "./pages/CartPage/Cart";
import SingleProduct from "./pages/SinglePage/SingleProduct";
import Orders from "./admin/Orders/Orders";
import Products from "./admin/Products/Products";
import CreateProduct from "./admin/Products/CreateProduct";
import Allproducts from "./admin/Products/Allproducts";
import Users from "./admin/Users/Users";
import Banners from "./admin/Banners/Banners";
import Wishlist from "./pages/wishlist/Wishlist";
import PrivateRoute from "./PrivateRoute";
import Allcategories from "./admin/category/Allcategories";
import CreateCategory from "./admin/category/CreateCategory";
import Layout from "./pages/Layout";
import Home from "./pages/homepage/Home";
import Dashboard from "./admin/Dashboard/Dashboard";
import Category from "./admin/category/Category";
import AllBanners from "./admin/Banners/AllBanners";
import CreateBanner from "./admin/Banners/CreateBanner";
import CategoryProducts from "./Components/categories/CategoryProducts"

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          
          {/* CATEGORY */}
          <Route path="/products/category/:categoryId" element={<CategoryProducts />} />

          {/* SUBCATEGORY */}
          <Route
            path="/products/category/:categoryId/:subcategory"
            element={<CategoryProducts />}
          />

          {/* SINGLE PRODUCT */}
          <Route path="/product/:id" element={ <SingleProduct />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
              <Route path="orders" element={<Orders />} />

              <Route path="products" element={<Products />}>
                <Route path="all" element={<Allproducts />} />
                <Route path="create" element={<CreateProduct />} />                
              </Route>

              <Route path="users" element={<Users />} />

              <Route path="banners" element={<Banners />}>
                <Route path="all" element={<AllBanners />} />
                <Route path="create" element={<CreateBanner />} />
              </Route>

              <Route path="categories" element={<Category />} >
                <Route path="all" element={<Allcategories />} />
                <Route path="create" element={<CreateCategory />} />
              </Route>
          </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
