import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js"
/* ================= ADD TO CART ================= */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("hii")
    const { productId, quantity, price } = req.body;
    console.log(productId);
    console.log(quantity);
    console.log(price);
    if (!productId || !price)
      return res.status(400).json({ message: "Missing data" });

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
        totalAmount: 0,
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({
        productId,
        quantity: quantity || 1,
        price,
      });
    }

    // 🔄 recalc total
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json({ message: "Added to cart", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET CART ================= */
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.productId", "images name price");

    if (!cart) return res.json({ items: [], totalAmount: 0 });

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE QUANTITY ================= */
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;

    cart.totalAmount = cart.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    await cart.save();
    res.json({ message: "Cart updated", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= REMOVE ITEM ================= */
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    res.json({ message: "Item removed", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= CLEAR CART ================= */
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
