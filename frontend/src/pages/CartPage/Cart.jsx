import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import { toast } from "react-hot-toast";
import API_URL from "../../Api";
import Empty from "../../Components/Loader/Empty";
import Loader from "../../Components/Loader/Loader";
import Checkout from "../../Components/Checkout";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  /* ================= FETCH CART ================= */
  const fetchCart = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // If unauthorized, force logout
      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Error fetching cart", err);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  /* ================= UPDATE QUANTITY ================= */
  const updateQty = async (productId, qty) => {
    if (qty < 1) return;

    try {
      const res = await fetch(`${API_URL}/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: qty }),
      });

      if (!res.ok) {
        toast.error("Failed to update quantity");
        return;
      }

      toast.success("Quantity updated");
      fetchCart();
    } catch (err) {
      console.error("Update qty error", err);
      toast.error("Something went wrong");
    }
  };

  /* ================= REMOVE ITEM ================= */
  const removeItem = async (productId) => {
    try {
      const res = await fetch(`${API_URL}/cart/remove/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        toast.error("Failed to remove item");
        return;
      }

      toast.success("Removed from cart");
      fetchCart();
    } catch (err) {
      console.error("Remove item error", err);
      toast.error("Something went wrong");
    }
  };

  if (loading) return <Loader />;

  // Safe empty check
  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    return <Empty />;
  }

  return (
    <div className="cart-container">
      {/* LEFT */}
      <div className="cart-left">
        {cart.items.map((item) => (
          <div className="cart-item" key={item._id}>
            <img
              src={item.productId.images?.[0]?.url}
              alt={item.productId.name}
            />

            <div className="cart-details">
              <h3>{item.productId.name}</h3>
              <p>₹{item.price}</p>

              <div className="qty-controls">
                <h5>Quantity:</h5>
                <button
                  onClick={() =>
                    updateQty(item.productId._id, item.quantity - 1)
                  }
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQty(item.productId._id, item.quantity + 1)
                  }
                >
                  +
                </button>
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
        <Checkout totalPrice={cart.totalAmount} mode="cart" onSuccess={fetchCart}/>
      </div>
    </div>
  );
};

export default Cart;
