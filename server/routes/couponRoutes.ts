import express from "express";
import { Coupon } from "../models";
import auth from "../middleware/auth";

const router = express.Router();

// Admin - Create a new coupon
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const { code, discountType, discountValue, minPurchase, maxDiscount, expiresAt } = req.body;

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) return res.status(400).json({ message: "Coupon already exists" });

    const coupon = new Coupon({ code, discountType, discountValue, minPurchase, maxDiscount, expiresAt });
    await coupon.save();

    res.status(201).json({ message: "Coupon created", coupon });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Apply a coupon at checkout
router.post("/apply", auth, async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    const coupon = await Coupon.findOne({ code, isActive: true });

    if (!coupon) return res.status(404).json({ message: "Invalid or expired coupon" });
    if (new Date() > coupon.expiresAt) return res.status(400).json({ message: "Coupon expired" });
    if (cartTotal < coupon.minPurchase) return res.status(400).json({ message: `Minimum purchase required: $${coupon.minPurchase}` });

    let discount = coupon.discountType === "fixed" ? coupon.discountValue : (coupon.discountValue / 100) * cartTotal;
    if (coupon.maxDiscount && coupon.discountType === "percentage") {
      discount = Math.min(discount, coupon.maxDiscount);
    }

    res.json({ message: "Coupon applied", discount, finalTotal: cartTotal - discount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin - Get all coupons
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin - Delete a coupon
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Coupon deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
