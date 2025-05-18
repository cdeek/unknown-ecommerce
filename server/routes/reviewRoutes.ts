import express from "express";
import { Product } from "../models";
import auth from "../middleware/auth";

const router = express.Router();

// Add a Review
router.post("/:productId", auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if user already reviewed
    const existingReview = product.reviews.find((r) => r.user.toString() === userId.toString());
    if (existingReview) return res.status(400).json({ message: "You have already reviewed this product" });

    // Add review
    const review = { user: userId, rating, comment };
    product.reviews.push(review);
    product.reviewCount = product.reviews.length;

    // Calculate new average rating
    product.averageRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviewCount;

    await product.save();
    res.status(201).json({ message: "Review added", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete a Review (Admin Only)
// router.delete("/:productId/:reviewId", auth, async (req, res) => {
//   try {
//     if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
//
//     const product = await Product.findById(req.params.productId);
//     if (!product) return res.status(404).json({ message: "Product not found" });
//
//     product.reviews = product.reviews.filter((r) => r._id.toString() !== req.params.reviewId);
//     product.reviewCount = product.reviews.length;
//
//     // Recalculate average rating
//     product.averageRating = product.reviewCount > 0
//       ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviewCount
//       : 0;
//
//     await product.save();
//     res.json({ message: "Review deleted", product });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
//
export default router;
