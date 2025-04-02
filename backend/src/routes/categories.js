const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const Category = require("../models/Category");

// Get all categories (public route)
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      order: 1,
    });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching public categories:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get all categories (admin only)
router.get("/admin", protect, admin, async (req, res) => {
  try {
    console.log("Fetching admin categories for user:", req.user._id);
    const categories = await Category.find().sort({ order: 1 });
    console.log(`Found ${categories.length} categories`);
    res.json(categories);
  } catch (error) {
    console.error("Error fetching admin categories:", error);
    res.status(500).json({ message: error.message });
  }
});

// Create new category (admin only)
router.post("/", protect, admin, async (req, res) => {
  try {
    console.log("Creating new category:", req.body);
    const category = new Category({
      ...req.body,
      order: await Category.countDocuments(),
    });
    const newCategory = await category.save();
    console.log("Category created successfully:", newCategory._id);
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(400).json({ message: error.message });
  }
});

// Update category (admin only)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    console.log("Updating category:", req.params.id);
    const category = await Category.findById(req.params.id);
    if (!category) {
      console.log("Category not found:", req.params.id);
      return res.status(404).json({ message: "Category not found" });
    }
    Object.assign(category, req.body);
    const updatedCategory = await category.save();
    console.log("Category updated successfully:", updatedCategory._id);
    res.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(400).json({ message: error.message });
  }
});

// Delete category (admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    console.log("Deleting category:", req.params.id);
    const category = await Category.findById(req.params.id);
    if (!category) {
      console.log("Category not found:", req.params.id);
      return res.status(404).json({ message: "Category not found" });
    }
    await Category.deleteOne({ _id: req.params.id });
    console.log("Category deleted successfully:", req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: error.message });
  }
});

// Reorder categories (admin only)
router.put("/admin/reorder", protect, admin, async (req, res) => {
  try {
    console.log("Reordering categories");
    const { categories } = req.body;
    await Promise.all(
      categories.map((category) =>
        Category.findByIdAndUpdate(category._id, { order: category.order })
      )
    );
    console.log("Categories reordered successfully");
    res.json({ message: "Categories reordered successfully" });
  } catch (error) {
    console.error("Error reordering categories:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
