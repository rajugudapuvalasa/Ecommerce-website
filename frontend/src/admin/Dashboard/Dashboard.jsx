import React from "react";
import { Outlet } from "react-router-dom";
import "./dashboard.css";
import Header from "../../Components/Header/Header";
import Sidebar from "../sidebar/Sidebar";
import Footer from "../../Components/Footer/Footer";

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
