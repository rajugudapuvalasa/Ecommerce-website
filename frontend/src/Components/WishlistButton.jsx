import React from 'react'
import {toast} from 'react-hot-toast';
import API_URL from '../Api';
import { FaRegHeart } from 'react-icons/fa';

const WishlistButton = ({productId}) => {
    const token = localStorage.getItem("token");

    const addToWishlist = async () => {
      await fetch(`${API_URL}/wishlist/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });
      toast.success("Added item to wishlist")
    };
  return (
    <div className="wishlist-button">
        <span className="wishlist-btn" onClick={() => addToWishlist()}><FaRegHeart /></span>
    </div>
  )
}

export default WishlistButton