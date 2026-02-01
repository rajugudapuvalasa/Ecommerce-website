import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String, // only for normal signup
    googleId: String,
    provider: { type: String,default: "manual" },
    avatar: String,
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
