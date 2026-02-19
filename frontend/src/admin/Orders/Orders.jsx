import React, { useEffect, useState } from "react";
import "./Orders.css";
import API_URL from "../../Api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        alert("Failed to load orders");
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      alert("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);

      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Status updated");
        fetchOrders();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error("Update status error:", err);
      alert("Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`${API_URL}/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        alert("Order deleted");
        fetchOrders();
      } else {
        alert("Failed to delete order");
      }
    } catch (err) {
      console.error("Delete order error:", err);
      alert("Error deleting order");
    }
  };

  if (loading) {
    return <div className="admin-orders-loading">Loading orders...</div>;
  }

  return (
    <div className="admin-orders-container">
      <h2>Admin - Manage Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div className="admin-order-card" key={order._id}>
            <div className="admin-order-header">
              <div>
                <b>Order ID:</b> {order._id}
              </div>
              <div>
                <b>User:</b> {order.user?.email || order.user?._id}
              </div>
            </div>

            <div className="admin-order-items">
              {order.items.map((item, idx) => (
                <div className="admin-order-item" key={idx}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <div><b>{item.name}</b></div>
                    <div>₹{item.price} × {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-order-footer">
              <div>
                <b>Total:</b> ₹{order.totalAmount}
              </div>

              <div>
                <b>Status:</b>{" "}
                <select
                  value={order.status}
                  disabled={updatingId === order._id}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button
                className="admin-delete-btn"
                onClick={() => deleteOrder(order._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
