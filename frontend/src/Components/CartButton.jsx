import React from "react";
import { toast } from "react-hot-toast";
import API_URL from "../Api";

const CartButton = ({ product }) => {
  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const res = await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
          price: product.price,
        }),
      });

      const data = await res.json();
      toast.success("added cart Item");
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  return (
    <div className="cart-button">
      <button className="add-to-cart" onClick={addToCart}>
        Add to Cart
      </button>
    </div>
  );
};

export default CartButton;
