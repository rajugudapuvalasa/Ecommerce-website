import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MenuBar.css";
import API_URL from "../../Api";

const MegaMenu = () => {
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  /* ================= CLOSE ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActive(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= NAVIGATION ================= */
  const goToCategory = (cat) => {
    navigate(`/products/category/${cat._id}`);
    setActive(null);
  };

  const goToSubCategory = (cat, sub) => {
    navigate(
      `/products/category/${cat._id}/${sub}`
    );
    setActive(null);
  };

  return (
    <nav className="menu-bar" ref={menuRef}>
      <div className="menu-scroll">
        {categories.map((cat, index) => (
          <div
            key={cat._id}
            className="menu-item"
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(null)}
          >
            {/* CATEGORY CLICK */}
            <span
              className="menu-title"
              onClick={() => goToCategory(cat)}
            >
              {cat.category}
            </span>

            {/* SUBCATEGORIES */}
            {active === index && (
              <div className="menu-dropdown">
                {cat.subcategories.map((sub, i) => (
                  <span
                    key={i}
                    className="sub-item"
                    onClick={() => goToSubCategory(cat, sub)}
                  >
                    {sub}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default MegaMenu;
