import express from "express";
import { Category } from "../models";
import auth from "../middleware/auth";

const router = express.Router();

// Create a Category (Admin Only)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  try {
    const { name, slug, subcategories } = req.body;
    const category = new Category({ name, slug, subcategories });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Category (Admin Only)
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedCategory);
});

// Delete Category (Admin Only)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
});

export default router;
