import React, { useEffect, useState } from "react";
import "./Wishlist.css";
import { useNavigate } from "react-router-dom";
import API_URL from "../../Api";
import { toast } from "react-hot-toast";
import Loader from "../../Components/Loader/Loader";
import Empty from "../../Components/Loader/Empty";
import { FaHeart } from "react-icons/fa";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // If unauthorized, force logout
      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await res.json();
      setWishlist(Array.isArray(data.products) ? data.products : []);
    } catch (e) {
      console.error("Wishlist error:", e);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWishlist();
    }
  }, [token]);

  const removeItem = async (productId) => {
    try {
      const res = await fetch(`${API_URL}/wishlist/remove/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        toast.error("Failed to remove item");
        return;
      }

      toast.success("Removed wishlist item");
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (e) {
      console.error("Remove wishlist item error:", e);
      toast.error("Something went wrong");
    }
  };

  if (loading) return <Loader />;
  if (!wishlist || wishlist.length === 0) return <Empty />;

  return (
      <div className="wishlist-container">
        {wishlist.map((item) => (
          <div key={item._id} className="product">
            <img
              src={item.images?.[0]?.url || "/no-image.png"}
              alt={item.name}
              onClick={() => navigate(`/product/${item._id}`)}
            />
            <span className="wishlist-btn" onClick={() => removeItem(item._id)} style={{ cursor: "pointer", color: "orange" }}><FaHeart /></span>
            
            <div className="content">
              <h3 className="product-name">{item.name}</h3>
              <p className="product-price">₹{item.price}</p>
              <p className="product-rating">⭐ {item.ratings}</p>
            </div>
          </div>
        ))}
      </div>
  );
};

export default Wishlist;
