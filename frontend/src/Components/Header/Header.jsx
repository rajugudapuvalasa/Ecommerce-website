import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FaShoppingCart, FaRegHeart, FaUserCircle } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { FaSun, FaMoon } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const profileRef = useRef(null);
  const navRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }

      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Initialize theme on mount
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Update token on custom event
  useEffect(() => {
    const updateToken = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("tokenChanged", updateToken);
    return () => window.removeEventListener("tokenChanged", updateToken);
  }, []);

  return (
    <header className="header" ref={navRef} >
      {/* Logo */}
      <div className="logo">
        <h2>
          Shop<span>_Mall</span>
        </h2>
      </div>

      {/* Search Bar */}
      <div className="search">
        <div className="search-bar">
          <input type="text" placeholder="Search ...." />
        </div>
        <IoSearchOutline className="search-icon" />
      </div>

      {/* Navigation Links */}
      <nav
        className={`nav-links ${menuOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
        >
        <NavLink to="/" className="nav-link">Home</NavLink>
        <NavLink to="/product" className="nav-link">Products</NavLink>
        <NavLink to="/fashion" className="nav-link">Fashion</NavLink>
        <NavLink to="/contact" className="nav-link">Contact</NavLink>

        {!token && (
          <>
            <NavLink to="/login" className="nav-link">Login</NavLink>
            <NavLink to="/signup" className="nav-link">Signup</NavLink>
          </>
        )}

        <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
      </nav>


      {/* Icons Section */}
      {token && (
        <div className="icons">
          <FaShoppingCart className="icon" title="Cart" />

          {/* Profile Dropdown */}
          <div className="profile-container" ref={profileRef}>
            <FaUserCircle
              className="icon"
              title="Profile"
              onClick={(e) => {
                e.stopPropagation();
                setProfileOpen(!profileOpen);
              }}
            />

            {profileOpen && (
              <div className="profile-dropdown">
                <p>👤 My Profile</p>
                <p>⚙️ Settings</p>

                <p onClick={toggleTheme} style={{ cursor: "pointer" }}>
                  {theme === "light" ? <FaMoon /> : <FaSun />} Change Theme
                </p>

                <p
                  onClick={() => {
                    const confirmLogout = window.confirm(
                      "Are you sure you want to logout?"
                    );
                    if (confirmLogout) {
                      localStorage.removeItem("token");
                      window.dispatchEvent(new Event("tokenChanged"));
                    }
                  }}
                >
                  🚪 Logout
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hamburger for mobile */}
      <div
        className="hamburger"
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen(!menuOpen);
        }}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
  );
};

export default Header;
