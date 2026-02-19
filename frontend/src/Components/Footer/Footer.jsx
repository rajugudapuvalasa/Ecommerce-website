import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import "./Footer.css";
import {Link} from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* About Section */}
        <div className="footer-section">
          <h3>EasyBy</h3>
          <p>
            Your trusted online store for electronics, fashion, and more.
            Quality products at the best prices.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="/cart">Cart</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: support@EasyBy.com</p>
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
        © 2025 EasyBy. All Rights Reserved by Gudapuvalasa Raju.
      </div>
    </footer>
  );
};

export default Footer;
