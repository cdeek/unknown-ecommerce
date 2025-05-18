import express from "express";
import { Order, User, Product } from "../models";
import auth from "../middleware/auth"
const router = express.Router();

router.use(auth);

// Get Sales Report (Revenue, Orders, Best Sellers)
router.get("/", async (req, res) => {
  if (req.user.role !== "admin") return;
  try {
  const currentYear = new Date().getFullYear();
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  // Sales per day (Last 30 Days) - Only delivered orders
  const salesPerDay = await Order.aggregate([
    {
      $match: { createdAt: { $gte: last30Days }, orderStatus: "delivered" },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalRevenue: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } }, // Sort by date
  ]);

  // Sales per month (Current Year) - Only delivered orders
  const salesPerMonth = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${currentYear}-01-01`),
          $lt: new Date(`${currentYear + 1}-01-01`),
        },
        orderStatus: "delivered",
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%B", date: "$createdAt" } }, // Month name
        totalRevenue: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 },
      },
    },
    {
      $addFields: {
        sortOrder: {
          $switch: {
            branches: [
              { case: { $eq: ["$_id", "January"] }, then: 1 },
              { case: { $eq: ["$_id", "February"] }, then: 2 },
              { case: { $eq: ["$_id", "March"] }, then: 3 },
              { case: { $eq: ["$_id", "April"] }, then: 4 },
              { case: { $eq: ["$_id", "May"] }, then: 5 },
              { case: { $eq: ["$_id", "June"] }, then: 6 },
              { case: { $eq: ["$_id", "July"] }, then: 7 },
              { case: { $eq: ["$_id", "August"] }, then: 8 },
              { case: { $eq: ["$_id", "September"] }, then: 9 },
              { case: { $eq: ["$_id", "October"] }, then: 10 },
              { case: { $eq: ["$_id", "November"] }, then: 11 },
              { case: { $eq: ["$_id", "December"] }, then: 12 },
            ],
            default: 13,
          },
        },
      },
    },
    { $sort: { sortOrder: 1 } }, // Sort by chronological order
    { $project: { sortOrder: 0 } }, // Remove the sorting field from the output
  ]);

  // Sales per year - Only delivered orders
  const salesPerYear = await Order.aggregate([
    {
      $match: { orderStatus: "delivered" },
    },
    {
      $group: {
        _id: { $year: "$createdAt" },
        totalRevenue: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } }, // Sort by year
  ]);

  // All-time sales - Only delivered orders
  const allTimeSales = await Order.aggregate([
    {
      $match: { orderStatus: "delivered" },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  const bestSellers = await Order.aggregate([
    { $unwind: "$products" },
    { $group: { _id: "$products._id", sold: { $sum: "$products.quantity" } } },
    { $sort: { sold: -1 } },
    { $limit: 5 },
  ]);

  const totalCustomers = await User.countDocuments();
  const returningCustomers = await User.countDocuments({ isReturningCustomer: true });

  const lowStockProducts = await Product.find({ stocks: { $lt: 10 } }).select("title stocks _id");

  // Recent Sales - Only delivered orders, sorted by most recent (Top 10)
  const recentSales = await Order.find({ orderStatus: "delivered" })
    .sort({ createdAt: -1 }) // Sort by newest first
    .limit(20)
    .select("totalAmount email createdAt"); // Select only relevant fields

    res.json({
    bestSellers,
    salesPerDay,
    salesPerMonth,
    salesPerYear,
    allTimeSales,
    totalCustomers,
    returningCustomers,
    retentionRate: (returningCustomers / totalCustomers) * 100,
    lowStock: lowStockProducts,
    recentSales,
  });
} catch (error) {
  res.status(500).json({ error: "Server Error" });
}

});

export default router;
