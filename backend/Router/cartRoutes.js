// routes/cartRoutes.js
import express from "express";
import {protect} from "../middleware/auth.js";
import {addToCart,getCart,removeFromCart,clearCart,updateCartItem} from "../controller/cartController.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.put("/update", protect, updateCartItem);
router.delete("/remove/:productId", protect, removeFromCart);
router.delete("/clear", protect, clearCart);

export default router;
