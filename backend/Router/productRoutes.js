import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProductsByCategory, getSingleProduct, searchProducts, updateProduct } from "../controller/productController.js";
import upload from "../middleware/multer.js";
import { protect,isAdmin } from "../middleware/auth.js";
const router = express.Router();


router.get("/category/:category", getProductsByCategory);
router.get("/category/:category/:subcategory", getProductsByCategory);
router.get("/search",searchProducts);
router.route('/').get(getAllProducts).post(protect,isAdmin,upload.array("images", 10),createProduct)

router.route('/:id').get(getSingleProduct).put(protect,isAdmin,upload.array("images", 10),updateProduct).delete(protect,isAdmin,deleteProduct)
export default router;