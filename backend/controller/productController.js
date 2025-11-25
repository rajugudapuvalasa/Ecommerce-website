import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";

// ------------------------------------------------------
// CREATE PRODUCT
// ------------------------------------------------------
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, brand, stock } = req.body;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    // Upload images to Cloudinary
    let images = [];

    for (let file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "Shopmall/product_images",
      });

      images.push({ url: result.secure_url });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      brand,
      stock,
      images,
    });

    const savedProduct = await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error creating product",
      error: err.message,
    });
  }
};

// ------------------------------------------------------
// GET ALL PRODUCTS
// ------------------------------------------------------
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });

  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
};

// ------------------------------------------------------
// GET SINGLE PRODUCT
// ------------------------------------------------------
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

// ------------------------------------------------------
// UPDATE PRODUCT
// ------------------------------------------------------
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

// ------------------------------------------------------
// DELETE PRODUCT
// ------------------------------------------------------
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
