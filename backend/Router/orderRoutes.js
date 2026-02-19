import express from "express";
import Order from "../models/OrderModel.js";
import {protect, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// ================= USER ROUTES =================

// 1️⃣ Get my orders
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (e) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// 2️⃣ Get single order (my order)
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // make sure user owns this order (or admin)
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    res.json({ success: true, order });
  } catch (e) {
    res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
});

// 3️⃣ Cancel my order (only if not shipped)
router.put("/cancel/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    if (order.status === "Shipped" || order.status === "Delivered") {
      return res.status(400).json({ success: false, message: "Cannot cancel shipped/delivered order" });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ success: true, message: "Order cancelled", order });
  } catch (e) {
    res.status(500).json({ success: false, message: "Cancel failed" });
  }
});


// ================= ADMIN ROUTES =================

// 4️⃣ Get all orders (admin)
router.get("/", protect, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (e) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// 5️⃣ Update order status (admin)
router.put("/status/:id", protect, isAdmin, async (req, res) => {
  try {
    const { status } = req.body; // "Shipped", "Delivered", "Refunded", etc.

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ success: true, message: "Order status updated", order });
  } catch (e) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

export default router;
