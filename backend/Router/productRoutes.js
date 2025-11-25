import express from "express";
import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from "../controller/productController.js";
import upload from "../middleware/multer.js";


const router = express.Router();

router.route('/products').get(getAllProducts).post(upload.array("images", 10),createProduct)

router.route('/product/:id').get(getSingleProduct).put(upload.array("images", 10),updateProduct).delete(deleteProduct)

export default router;