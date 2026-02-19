import Wishlist from "../models/wishlistModel.js";

/* ================= ADD TO WISHLIST ================= */
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    if (wishlist.products.includes(productId)) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    wishlist.products.push(productId);
    await wishlist.save();

    res.json({ message: "Added to wishlist", wishlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET WISHLIST ================= */
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate("products", "name price images");

    res.json(wishlist || { products: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= REMOVE FROM WISHLIST ================= */
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.json({ products: [] });
    }

    await Wishlist.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { products: productId } },
      { new: true }
    );

    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

