const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const Project = require("../models/Project");

// Get all projects (public route)
router.get("/", async (req, res) => {
  try {
    const { category, technologies } = req.query;
    let query = { isActive: true };

    // Add category filter if provided
    if (category && category !== "all") {
      query.category = category;
    }

    // Add technologies filter if provided
    if (technologies) {
      const techArray = technologies.split(",");
      query.technologies = { $in: techArray };
    }

    const projects = await Project.find(query).sort({ order: 1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all projects (admin only)
router.get("/admin", protect, admin, async (req, res) => {
  try {
    const { category, technologies } = req.query;
    let query = {};

    // Add category filter if provided
    if (category && category !== "all") {
      query.category = category;
    }

    // Add technologies filter if provided
    if (technologies) {
      const techArray = technologies.split(",");
      query.technologies = { $in: techArray };
    }

    const projects = await Project.find(query).sort({ order: 1 });
    res.json(projects);
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Create new project (admin only)
router.post("/", protect, admin, async (req, res) => {
  try {
    const project = new Project(req.body);
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update project (admin only)
router.patch("/:id", protect, admin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    Object.keys(req.body).forEach((key) => {
      project[key] = req.body[key];
    });

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete project (admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update project order (admin only)
router.patch("/reorder", protect, admin, async (req, res) => {
  try {
    const { projects } = req.body;
    const updates = projects.map((project) => ({
      updateOne: {
        filter: { _id: project._id },
        update: { $set: { order: project.order } },
      },
    }));

    await Project.bulkWrite(updates);
    res.json({ message: "Projects reordered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
