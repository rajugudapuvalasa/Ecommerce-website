import express from "express";
import Product from "./Router/productRoutes.js";
import User from "./Router/userRoutes.js";
import Cart from "./Router/cartRoutes.js";
import Banner from "./Router/bannerRoutes.js"
import Wishlist from "./Router/wishlistRoutes.js"
import Category from "./Router/categoryRoutes.js"
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use('/api/products',Product);
app.use('/api/users',User);
app.use('/api/cart',Cart);
app.use('/api/banners',Banner);
app.use('/api/wishlist',Wishlist);
app.use('/api/categories',Category);

export default app;