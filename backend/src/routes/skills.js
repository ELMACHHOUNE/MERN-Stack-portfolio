const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const Skill = require("../models/Skill");
const fs = require("fs");
const path = require("path");

// Helper function to save base64 image
const saveBase64Image = (base64String, filename) => {
  // Extract the actual base64 data (remove data:image/png;base64, prefix)
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  // Create uploads directory if it doesn't exist
  const uploadDir = path.join(__dirname, "../../uploads/skill-icons");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Save the file
  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, buffer);

  // Return the relative path to be stored in the database
  return `skill-icons/${filename}`;
};

// Get all skills (public route)
router.get("/", async (req, res) => {
  try {
    console.log("Fetching public skills");
    const skills = await Skill.find({ isActive: true })
      .populate("category", "name description icon")
      .sort({
        category: 1,
        order: 1,
      });
    console.log(`Found ${skills.length} skills`);
    res.json(skills);
  } catch (error) {
    console.error("Error fetching public skills:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get all skills (admin only)
router.get("/admin", protect, admin, async (req, res) => {
  try {
    console.log("Fetching admin skills for user:", req.user._id);
    const skills = await Skill.find()
      .populate("category", "name description icon")
      .sort({ category: 1, order: 1 });
    console.log(`Found ${skills.length} skills`);
    res.json(skills);
  } catch (error) {
    console.error("Error fetching admin skills:", error);
    res.status(500).json({ message: error.message });
  }
});

// Create new skill (admin only)
router.post("/", protect, admin, async (req, res) => {
  try {
    console.log("Creating new skill");
    const { icon, ...skillData } = req.body;

    // Handle icon
    let iconPath = icon;
    if (icon && icon.startsWith("data:image")) {
      // Generate a unique filename
      const filename = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.png`;
      iconPath = saveBase64Image(icon, filename);
    }

    const skill = new Skill({
      ...skillData,
      icon: iconPath,
    });

    const newSkill = await skill.save();
    const populatedSkill = await Skill.findById(newSkill._id).populate(
      "category",
      "name description icon"
    );
    console.log("Skill created successfully:", newSkill._id);
    res.status(201).json(populatedSkill);
  } catch (error) {
    console.error("Error creating skill:", error);
    res.status(400).json({ message: error.message });
  }
});

// Update skill (admin only)
router.patch("/:id", protect, admin, async (req, res) => {
  try {
    console.log("Updating skill:", req.params.id);
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      console.log("Skill not found:", req.params.id);
      return res.status(404).json({ message: "Skill not found" });
    }

    const { icon, ...updateData } = req.body;

    // Handle icon update
    if (icon && icon.startsWith("data:image")) {
      // Delete old icon if it exists and is a local file
      if (skill.icon && !skill.icon.startsWith("http")) {
        const oldIconPath = path.join(__dirname, "../../uploads", skill.icon);
        if (fs.existsSync(oldIconPath)) {
          fs.unlinkSync(oldIconPath);
        }
      }

      // Save new icon
      const filename = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.png`;
      updateData.icon = saveBase64Image(icon, filename);
    } else {
      updateData.icon = icon;
    }

    Object.assign(skill, updateData);
    const updatedSkill = await skill.save();
    const populatedSkill = await Skill.findById(updatedSkill._id).populate(
      "category",
      "name description icon"
    );
    console.log("Skill updated successfully:", updatedSkill._id);
    res.json(populatedSkill);
  } catch (error) {
    console.error("Error updating skill:", error);
    res.status(400).json({ message: error.message });
  }
});

// Delete skill (admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    console.log("Deleting skill:", req.params.id);
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      console.log("Skill not found:", req.params.id);
      return res.status(404).json({ message: "Skill not found" });
    }

    // Delete icon file if it's a local file
    if (skill.icon && !skill.icon.startsWith("http")) {
      const iconPath = path.join(__dirname, "../../uploads", skill.icon);
      if (fs.existsSync(iconPath)) {
        fs.unlinkSync(iconPath);
      }
    }

    await skill.deleteOne();
    console.log("Skill deleted successfully:", req.params.id);
    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Error deleting skill:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update skill order (admin only)
router.patch("/reorder", protect, admin, async (req, res) => {
  try {
    console.log("Reordering skills");
    const { skills } = req.body;
    const updates = skills.map((skill) => ({
      updateOne: {
        filter: { _id: skill._id },
        update: { $set: { order: skill.order } },
      },
    }));

    await Skill.bulkWrite(updates);
    console.log("Skills reordered successfully");
    res.json({ message: "Skills reordered successfully" });
  } catch (error) {
    console.error("Error reordering skills:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
