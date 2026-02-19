import React from "react";
import API_URL from "../Api";
import {toast} from "react-hot-toast"
import { useNavigate } from "react-router-dom";

export default function Checkout({ totalPrice, mode = "cart", product ,onSuccess}) {
  const token = localStorage.getItem("token");

  const handlePay = async () => {
    try {
      if (!token) {
        useNavigate('/login')
      }

      if (!totalPrice || totalPrice <= 0) {
        alert("Invalid amount");
        return;
      }

      // 1) Create order on backend
      const res = await fetch(`${API_URL}/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: totalPrice,
          mode, // "cart" or "single"
          productId: mode === "single" ? product?._id : null,
          quantity: mode === "single" ? 1 : null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to create order");
        return;
      }

      // 2) Open Razorpay Checkout
      const options = {
        key: "rzp_test_SGoZCTSDU4JyVn",
        amount: data.order.amount,
        currency: "INR",
        name: "EasyBy",
        description: "Order Payment",
        order_id: data.order.id,
        handler: async function (response) {
          // 3) Verify on backend
          const vr = await fetch(`${API_URL}/payment/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...response,
              mode,
              productId: mode === "single" ? product?._id : null,
              quantity: mode === "single" ? 1 : null,
            }),
          });

          const vdata = await vr.json();

          if (vr.ok && vdata.success) {
            toast.success("Payment successful!");
            // TODO: redirect to success / orders page
            if (onSuccess) {
              onSuccess(); // 🔁 This will reload cart state
            }
          } else {
            toast.error(vdata.message || "Payment verification failed");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
      };

      if (!window.Razorpay) {
        toast.error("Razorpay SDK not loaded");
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Something went wrong while starting payment");
    }
  };

  return (
    <button className="buy" onClick={handlePay}>
      Buy ₹{totalPrice}
    </button>
  );
}
