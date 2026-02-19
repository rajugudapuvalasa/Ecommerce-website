import React, { useEffect, useState } from "react";
import "./Order.css";
import API_URL from "../../Api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  if (loading) {
    return <div className="orders-loading">Loading your orders...</div>;
  }

  if (!orders || orders.length === 0) {
    return <div className="orders-empty">You have no orders yet 😔</div>;
  }

  return (
    <div className="orders-container">
      <h2>My Orders</h2>

      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <div className="order-header">
            <span><b>Order ID:</b> {order._id}</span>
            <span className={`order-status ${order.status.toLowerCase()}`}>
              {order.status}
            </span>
          </div>

          <div className="order-items">
            {order.items.map((item, index) => (
              <div className="order-item" key={index}>
                <img src={item.image} alt={item.name} />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>Price: ₹{item.price}</p>
                  <p>Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="order-footer">
            <span><b>Total:</b> ₹{order.totalAmount}</span>
            <span><b>Date:</b> {new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
