import express from "express";
import {protect} from "../middleware/auth.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist
} from "../controller/wishlistController.js";

const router = express.Router();

router.post("/add", protect, addToWishlist);
router.get("/", protect, getWishlist);
router.delete("/remove/:productId", protect, removeFromWishlist);

export default router;
