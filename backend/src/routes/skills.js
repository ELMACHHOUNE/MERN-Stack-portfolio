const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const Skill = require("../models/Skill");

// Get all skills (public route)
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find({ isActive: true }).sort({
      category: 1,
      order: 1,
    });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all skills (admin only)
router.get("/admin", protect, admin, async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new skill (admin only)
router.post("/", protect, admin, async (req, res) => {
  try {
    const skill = new Skill(req.body);
    const newSkill = await skill.save();
    res.status(201).json(newSkill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update skill (admin only)
router.patch("/:id", protect, admin, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    Object.keys(req.body).forEach((key) => {
      skill[key] = req.body[key];
    });

    const updatedSkill = await skill.save();
    res.json(updatedSkill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete skill (admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }
    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update skill order (admin only)
router.patch("/reorder", protect, admin, async (req, res) => {
  try {
    const { skills } = req.body;
    const updates = skills.map((skill) => ({
      updateOne: {
        filter: { _id: skill._id },
        update: { $set: { order: skill.order } },
      },
    }));

    await Skill.bulkWrite(updates);
    res.json({ message: "Skills reordered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
