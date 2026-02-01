import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },

      variantId: {
        type: mongoose.Schema.Types.ObjectId
      },

      quantity: Number,
      price: Number,

      selectedAttributes: {
        color: String,
        size: String,
        storage: String,
        weight: String
      }
    }
  ],

  shippingAddress: {
    name: String,
    phone: String,
    address: String,
    city: String,
    pincode: String
  },

  paymentMethod: String,
  paymentStatus: {
    type: String,
    default: "pending"
  },

  orderStatus: {
    type: String,
    default: "processing"
  },

  totalAmount: Number
},{ timestamps:true });

export default mongoose.model("Order", orderSchema);
