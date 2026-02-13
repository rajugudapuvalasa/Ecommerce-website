import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* About Section */}
        <div className="footer-section">
          <h3>Shop_Mall</h3>
          <p>
            Your trusted online store for electronics, fashion, and more.
            Quality products at the best prices.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>Home</li>
            <li>Products</li>
            <li>Fashion</li>
            <li>Contact</li>
            <li>Cart</li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="footer-section">
          <h4>Customer Service</h4>
          <ul>
            <li>Help Center</li>
            <li>Returns</li>
            <li>Shipping Info</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: support@shopmall.com</p>
          <p>Phone: +91 22222 43210</p>
          <div className="footer-socials">
            <FaFacebook />
            <FaInstagram />
            <FaTwitter />
            <FaYoutube />
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © 2025 Shop_Mall. All Rights Reserved by Gudapuvalasa Raju.
      </div>
    </footer>
  );
};

export default Footer;
