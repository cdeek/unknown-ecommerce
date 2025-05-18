import express from "express";
import { Product, Order } from "../models";
import auth from "../middleware/auth";

const router = express.Router();

// Create an Order (Checkout)
router.post("/", auth, async (req, res) => {
  try {
    const { products, shippingAddress, user, name, email, phone } = req.body;

    if (!products || products.length === 0) return res.status(400).json({ message: "No products in the order" });

    let totalAmount: number = 0;

    // Check product availability and calculate total price
    for (let item of products) {
      const product: any = await Product.findById(item.product);
      if (!product || product.stocks < item.quantity) {
        return res.status(400).json({ message: `Product ${product?.name || "not found"} is out of stock` });
      }
      totalAmount += (product.price * item.quantity);
      product.stocks -= item.quantity;
      await product.save();
    }

    // Create order
    const order = new Order({
      user,
      email, 
      name, 
      phone,
      products,
      totalAmount,
      shippingAddress,
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Orders (Admin Only)
router.get("/", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  const orders = await Order.find().populate("user products.product");
  res.json(orders);
});

// Get User's Orders
router.get("/my-orders", auth, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate("products.product");
  res.json(orders);
});

// Update Order Status (Admin Only)
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  const { orderStatus } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.orderStatus = orderStatus;
  await order.save();
  res.json(order);
});

// Delete Order (Admin Only)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: "Order deleted" });
});

export default router;
