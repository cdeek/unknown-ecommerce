import express from "express";
const router = express.Router();
// import { Page } from "../models;

// Get all pages
// router.get("/", async (req, res) => {
//   const pages = await Page.find();
//   res.json(pages);
// });
//
// // Get a single page by slug
// router.get("/:slug", async (req, res) => {
//   const page = await Page.findOne({ slug: req.params.slug });
//   res.json(page);
// });
//
// // Create a new page
// router.post("/", async (req, res) => {
//   const newPage = new Page(req.body);
//   await newPage.save();
//   res.json(newPage);
// });
//
// // Update a page
// router.put("/:id", async (req, res) => {
//   const updatedPage = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true });
//   res.json(updatedPage);
// });
//
// // Delete a page
// router.delete("/:id", async (req, res) => {
//   await Page.findByIdAndDelete(req.params.id);
//   res.json({ message: "Page deleted" });
// });
//
export default router;
