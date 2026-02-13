import React, { useEffect, useState } from "react";
import "./Wishlist.css";
import { useNavigate } from "react-router-dom";
import API_URL from "../../Api"
import {toast} from "react-hot-toast"
import Loader from '../../Components/Loader/Loader';
import Empty from '../../Components/Loader/Empty';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading,setloading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try{
    const res = await fetch(`${API_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setWishlist(data.products || []);
    }catch(e)
    {
      console.log("wishlist err :",e);
    }
    finally{
      setloading(false)
    }
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

  if (loading) return <Loader />
  if (wishlist.length === 0) return <Empty />;

  return (
    <div className="wishlist-container">
      {wishlist.map((item) => (
        <div key={item._id} className="wishlist-card">
          <img src={item.images[0].url} alt={item.name} onClick={() => navigate(`/product/${item._id}`)}/>
          <h4>{item.name}</h4>
          <p>₹{item.price}</p>
          <span onClick={() => removeItem(item._id)}> ✕</span>
        </div>
      ))}
    </div>
  );
};

export default Wishlist;
