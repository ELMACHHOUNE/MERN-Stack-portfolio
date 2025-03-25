const express = require("express");
const router = express.Router();
const Experience = require("../models/Experience");
const { protect, admin } = require("../middleware/auth");

// Get all active experiences (public)
router.get("/", async (req, res) => {
  try {
    const experiences = await Experience.find({ isActive: true })
      .sort({ order: 1 })
      .select("-__v");
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all experiences (admin only)
router.get("/admin", protect, admin, async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ order: 1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new experience (admin only)
router.post("/", protect, admin, async (req, res) => {
  try {
    const experience = new Experience({
      ...req.body,
      order: req.body.order || 0,
    });
    const newExperience = await experience.save();
    res.status(201).json(newExperience);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update experience (admin only)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    Object.assign(experience, req.body);
    const updatedExperience = await experience.save();
    res.json(updatedExperience);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete experience (admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    await experience.remove();
    res.json({ message: "Experience deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reorder experiences (admin only)
router.put("/reorder", protect, admin, async (req, res) => {
  try {
    const { experiences } = req.body;
    await Promise.all(
      experiences.map((exp) =>
        Experience.findByIdAndUpdate(exp._id, { order: exp.order })
      )
    );
    res.json({ message: "Experiences reordered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
