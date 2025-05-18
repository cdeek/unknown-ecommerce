import express from "express";
// import { paypal } from "../config/payment";
import { Order } from "../models";
import auth from "../middleware/auth";

const router = express.Router();

// PayPal Payment Route
router.post("/paypal", auth, async (req, res) => {
  // const { orderId } = req.body;
  // try {
  //   const order = await Order.findById(orderId);
  //   if (!order) return res.status(404).json({ message: "Order not found" });
  //
  //   const paymentJson = {
  //     intent: "sale",
  //     payer: { payment_method: "paypal" },
  //     transactions: [{ amount: { total: order.totalAmount, currency: "USD" }, description: `Order #${order._id}` }],
  //     redirect_urls: {
  //       return_url: `${process.env.CLIENT_URL}/payment-success`,
  //       cancel_url: `${process.env.CLIENT_URL}/payment-failed`,
  //     },
  //   };
  //
  //   paypal.payment.create(paymentJson, (error, payment) => {
  //     if (error) return res.status(500).json({ error: error.response }); 
  //     order.orderStatus = payment.status;
  //     order.save();
  //     res.json({ approvalUrl: payment.links.find(link => link.rel === "approval_url").href });
  //   });
  // } catch (err) {
  //   res.status(500).json({ error: err.message });
  // }
});

// Crypto Payment Route (Simple Hash Verification)
router.post("/crypto", auth, async (req, res) => {
  // const { orderId, transactionId } = req.body;
  // try {
  //   const order = await Order.findById(orderId);
  //   if (!order) return res.status(404).json({ message: "Order not found" });
  //
  //   // Simulating crypto payment verification (Replace with actual blockchain API verification)
  //   if (!transactionId) return res.status(400).json({ message: "Transaction ID required" });
  //
  //   order.paymentStatus = "paid";
  //   order.paymentMethod = "crypto";
  //   order.transactionId = transactionId;
  //   await order.save();
  //
  //   res.json({ message: "Crypto payment confirmed", order });
  // } catch (err) {
  //   res.status(500).json({ error: err.message });
  // }
});

export default router;
