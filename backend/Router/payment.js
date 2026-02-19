import express from "express";
import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Order from "../models/OrderModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// 1) Create Razorpay order
router.post("/create-order", protect, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    return res.json({ success: true, order });
  } catch (err) {
    console.error("Create order error:", err);
    return res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

// 2) Verify payment + create Order in DB
router.post("/verify", protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      mode,        // "cart" or "single"
      productId,   // only for single
      quantity,    // only for single
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    // 🔐 Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    let orderItems = [];
    let totalAmount = 0;

    // ===============================
    // 🛒 CART CHECKOUT
    // ===============================
    if (mode === "cart") {
      const cart = await Cart.findOne({ user: req.user.id }).populate("items.productId");

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: "Cart is empty" });
      }

      orderItems = cart.items.map((i) => ({
        product: i.productId._id,
        name: i.productId.name,
        price: i.price,
        quantity: i.quantity,
        image: i.productId.images?.[0]?.url,
      }));

      totalAmount = cart.totalAmount;

      // Clear cart
      cart.items = [];
      cart.totalAmount = 0;
      await cart.save();
    }

    // ===============================
    // ⚡ SINGLE PRODUCT BUY NOW
    // ===============================
    else if (mode === "single") {
      if (!productId || !quantity) {
        return res.status(400).json({ success: false, message: "Missing product details" });
      }

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      orderItems = [
        {
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.images?.[0]?.url,
        },
      ];

      totalAmount = product.price * quantity;
    }

    else {
      return res.status(400).json({ success: false, message: "Invalid checkout mode" });
    }

    // ===============================
    // 📦 Create Order in DB
    // ===============================
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      paymentInfo: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
      status: "Paid",
    });

    return res.json({
      success: true,
      message: "Payment verified & order placed",
      order,
    });

  } catch (e) {
    console.error("Verify error:", e);
    return res.status(500).json({ success: false, message: "Verification error" });
  }
});

export default router;
