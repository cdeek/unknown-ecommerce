import express from "express";
import jwt from "jsonwebtoken";
import upload from "../middleware/upload";
import auth from "../middleware/auth";
import { Product, Category } from "../models";

const router = express.Router();

router.post('/', auth, upload.fields([
    { name: "images", maxCount: 4 },
    { name: "video", maxCount: 1 },
  ]), async (req, res) => {

  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
  const { title, description, price, category, keywords, stocks, customization } = req.body;

  try {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) return res.status(400).json({ message: "Invalid category" });

    const images = (req.files?.images || []).map(file => file.path);
    const video = req.files?.video?.[0]?.path || null;

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      keywords,
      images,
      video,
      stocks,
      customization
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All Products
router.get("/", async (req, res) => {
  try {
    let { page, limit, search, category, minPrice, maxPrice, sort } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) filter.category = category;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const sortOptions: any = {};
    if (sort) {
      const [field, order] = sort.split("_");
      sortOptions[field] = order === "desc" ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }

    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate("category");

    const total = await Product.countDocuments(filter);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      products,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Product
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  const product = await Product.findOne({ slug });
  if (!product) return res.status(404).json({ message: "Product not found" });

  res.json(product);
});

// Update Product (Admin Only)
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedProduct);
});

// Update product stock
router.put("/:id/stock", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
  const { stock } = req.query;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.stocks = stock;
    await product.save();
    res.json({ message: "Stock updated successfully", product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Product (Admin Only)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

export default router;
