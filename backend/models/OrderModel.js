import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    shippingAddress: {
      address: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentInfo: {
      method: { type: String, default: "Razorpay" },
      razorpay_order_id: String,
      razorpay_payment_id: String,
      razorpay_signature: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Shipped", "Delivered", "Cancelled", "Refunded"],
      default: "Paid",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
