import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  images: { type: [String], required: true }, // multiple image URLs
  isActive: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Banner", bannerSchema);
