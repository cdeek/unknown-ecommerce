import express from "express";
import { Product, User } from "../models";
import auth from "../middleware/auth";

const router = express.Router();

// Add a product to the wishlist
router.post("/add/:productId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (!user.cart.items.includes(product._id)) {
      user.cart.items.push(product._id);
      await user.save();
    }

    res.json({ message: "Product added to wishlist", cart: user.cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove a product from the wishlist
router.delete("/remove/:productId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart.items = user.cart.items.filter((id) => id.toString() !== req.params.productId);
    await user.save();

    res.json({ message: "Product removed from wishlist", cart: user.cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's wishlist
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist", "name price");
    res.json({ cart: user.cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
