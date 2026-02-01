import React from "react";
import { Outlet } from "react-router-dom";
import "./dashboard.css";
import Sidebar from "../sidebar/Sidebar";
import Header from "../../Components/header/Header";
import Footer from "../../Components/footer/Footer";

const AdminDashboard = () => {
  return (
    <>
    <div className="admin-dashboard">
      <Header />
      <Sidebar />
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
    <Footer />
    </>
  );
};

export default AdminDashboard;
