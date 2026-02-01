import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  description: String,
  brand: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  subCategory: {
    type: String,
  },

  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  images: [{
    url: String,
    public_id: String
  }],
  ratings: {
    type: Number,
    default: 0
  }
},{ timestamps:true });

export default mongoose.model("Product", productSchema);
