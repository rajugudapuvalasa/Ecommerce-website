import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaRegHeart, FaUserCircle } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { FaSun, FaMoon } from "react-icons/fa";
import "./Header.css";
import { useAdmin } from "../../admin/role";
import { toast } from "react-hot-toast";

const Header = () => {
  const navigate = useNavigate();
  const isAdmin = useAdmin();
  
  const [profileOpen, setProfileOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const profileRef = useRef(null);
  const [query, setQuery] = useState("");

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= THEME ================= */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  /* ================= TOKEN SYNC ================= */
  useEffect(() => {
    const updateAuth = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("tokenChanged", updateAuth);
    return () => window.removeEventListener("tokenChanged", updateAuth);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    navigate(`/search?q=${encodeURIComponent(query)}`);

    setQuery("");
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      toast.success("Logout successful");
      window.dispatchEvent(new Event("tokenChanged"));
      navigate("/login");
    }
  };

  return (
    <header className="header">
      {/* LEFT */}
      <div className="header-left">
        <Link to="/" className="main-logo">
          <h1>Shop_Mall</h1>
        </Link>
      </div>

      {/* RIGHT */}
      <div className="header-right">
        {/* SEARCH */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <IoSearchOutline type="submit" className="search-icon" />
        </form>
 
        {!token && (
            <>
            <Link to="/login"><h4>Login</h4> </Link>
            <Link to="/signup"><h4>Signup</h4> </Link>
            </>
        )}

        {/* ICONS */}
        {token && (
          <div className="icons">
            <Link to="/wishlist">
              <FaRegHeart className="icon" />
            </Link>

            <Link to="/cart">
              <FaShoppingCart className="icon" />
            </Link>

            {/* PROFILE */}
            <div className="profile-container" ref={profileRef}>
              <FaUserCircle
                className="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileOpen((prev) => !prev);
                }}
              />

              {profileOpen && (
                <div className="profile-dropdown">
                  <p>👤 My Profile</p>

                  {/* SECURE ADMIN CHECK */}
                  {isAdmin && (
                    <Link to="/dashboard" onClick={() => setProfileOpen(false)}>
                      📊 Dashboard
                    </Link>
                  )}

                  <p onClick={toggleTheme} style={{ cursor: "pointer" }}>
                    {theme === "light" ? <FaMoon /> : <FaSun />} Change Theme
                  </p>

                  <p className="logout" onClick={logout}>
                    🚪 Logout
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
