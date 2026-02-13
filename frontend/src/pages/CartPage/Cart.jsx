import React, { useEffect, useState } from "react";
import "./Cart.css";
import {toast} from "react-hot-toast"
import API_URL from "../../Api";
import Empty from "../../Components/Loader/Empty";
import Loader from '../../Components/Loader/Loader'

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading,setLoading] = useState(true);
  const token = localStorage.getItem("token");

  /* ================= FETCH CART ================= */
  const fetchCart = async () => {
  try {
      setLoading(true);
      const res = await fetch(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Error fetching cart", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCart();
  }, []);

  /* ================= UPDATE QUANTITY ================= */
  const updateQty = async (productId, qty) => {
    if (qty < 1) return;

    await fetch(`${API_URL}/cart/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity: qty }),
    });
    toast.success("Quantity updated")
    fetchCart();
  };

  /* ================= REMOVE ITEM ================= */
  const removeItem = async (productId) => {
    await fetch(`${API_URL}/cart/remove/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.error("Remove Cart Item")
    fetchCart();
  };

  if(loading) return <Loader />;

  if (!cart || cart.items?.length === 0)
    return <Empty />;

  return (
    <div className="cart-container">
      {/* LEFT */}
      <div className="cart-left">
        {cart.items.map((item) => (
          <div className="cart-item" key={item._id}>
            <img src={item.productId.images?.[0]?.url} alt={item.productId.name} />

            <div className="cart-details">
              <h3>{item.productId.name}</h3>
              <p>₹{item.price}</p>

              <div className="qty-controls">
                <h5>quantity : </h5>
                <button onClick={() => updateQty(item.productId._id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQty(item.productId._id, item.quantity + 1)}>+</button>
              </div>

              <button
                className="cart-remove-btn"
                onClick={() => removeItem(item.productId._id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div className="cart-right">
        <h3>Price Details</h3>
        
        <div className="price-row">
          <span>Total Items</span>
          <span>{cart.items.length}</span>
        </div>

        <div className="price-row">
          <span>Total Price</span>
          <span>₹{cart.totalAmount}</span>
        </div>

        <button className="place-order">Place Order</button>
      </div>
    </div>
  );
};

export default Cart;
