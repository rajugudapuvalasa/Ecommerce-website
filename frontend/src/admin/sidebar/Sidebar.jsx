import React from 'react'
import { FaBox, FaUsers, FaShoppingBag, FaImages } from "react-icons/fa";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { NavLink } from 'react-router-dom'
import "./sidebar.css"
const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <nav className="sidebar-nav">
        <NavLink to="orders" className="nav-link">
          <FaShoppingBag /> Orders
        </NavLink>
        <NavLink to="users" className="nav-link">
          <FaUsers /> Users
        </NavLink>
        <NavLink to="products/all" className="nav-link">
          <FaBox /> Products
        </NavLink>
        <NavLink to="banners/all" className="nav-link">
          <FaImages />Banners
        </NavLink>
        <NavLink to="categories/all" className="nav-link">
          <BiSolidCategoryAlt />Categories
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar