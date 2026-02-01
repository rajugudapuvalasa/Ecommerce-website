import React, { useEffect, useState } from "react";
import "./Wishlist.css";
import { useNavigate } from "react-router-dom";
import API_URL from "../../Api"
import {toast} from "react-hot-toast"

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    const res = await fetch(`${API_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setWishlist(data.products || []);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeItem = async (productId) => {
    await fetch(`${API_URL}/wishlist/remove/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success("Removed item from wishlist")
    fetchWishlist();
  };

  if (wishlist.length === 0) return <h2>Wishlist is empty</h2>;

  return (
    <div className="wishlist-container">
      {wishlist.map((item) => (
        <div key={item._id} className="wishlist-card">
          <img src={item.images[0].url} alt={item.name} onClick={() => navigate(`/product/${item._id}`)}/>
          <h4>{item.name}</h4>
          <p>₹{item.price}</p>
          <button onClick={() => removeItem(item._id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default Wishlist;
