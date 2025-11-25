import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaBox, FaUsers, FaShoppingBag } from "react-icons/fa";
import "./dashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <nav className="sidebar-nav">
          <NavLink to="orders" className="nav-link">
            <FaShoppingBag /> Orders
          </NavLink>
          <NavLink to="users" className="nav-link">
            <FaUsers /> Users
          </NavLink>
          <NavLink to="products" className="nav-link">
            <FaBox /> Products
          </NavLink>
          <NavLink to="banners" className="nav-link">
            Banners
          </NavLink>
        </nav>
      </aside>

      <main className="dashboard-content">
        {/* Renders the nested route component */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
