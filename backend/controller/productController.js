import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      category,
      subCategory,
      price,
      stock,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Images required" });
    }

    const images = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    const product = await Product.create({
      name,
      description,
      brand,
      category,
      subCategory,
      price,
      stock,
      images, // ✅ saved to DB
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Create product failed",
      error: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching products", error: err.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category, subcategory } = req.params;

    const filter = {
      category: new mongoose.Types.ObjectId(category),
    };

    if (subcategory) {
      filter.subCategory = subcategory;
    }

    const products = await Product.find(filter)
      .populate("category", "category")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });

  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    let newImages = [];

    // If new images uploaded
    if (req.files && req.files.length > 0) {

      // Delete old images from Cloudinary
      for (let img of product.images) {
        const publicId = img.url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy("Shopmall/product_images/" + publicId);
      }

      // Upload new images
      for (let file of req.files) {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          folder: "Shopmall/product_images",
        });

        newImages.push({ url: uploaded.secure_url });
      }

      req.body.images = newImages;
    }

    // Update product fields
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });

  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // Delete product images from Cloudinary
    for (let img of product.images) {
      const publicId = img.url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy("Shopmall/product_images/" + publicId);
    }

    await product.deleteOne();

    res.status(200).json({ message: "Product deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
};
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json({ products: [] });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { subCategory: { $regex: q, $options: "i" } }
      ]
    }).limit(50);

    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};