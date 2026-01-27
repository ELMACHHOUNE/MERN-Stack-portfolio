const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const Project = require("../models/Project");
const { upload, handleMulterError } = require("../middleware/upload");
const path = require("path");
const fs = require("fs");

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
router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  handleMulterError,
  async (req, res) => {
    try {
      console.log("Creating new project with data:", {
        body: req.body,
        file: req.file,
      });

      const projectData = { ...req.body };

      // Parse technologies and features if they're JSON strings
      try {
        if (typeof projectData.technologies === "string") {
          projectData.technologies = JSON.parse(projectData.technologies);
        }
        if (typeof projectData.features === "string") {
          projectData.features = JSON.parse(projectData.features);
        }
      } catch (error) {
        console.error("Error parsing technologies or features:", error);
        return res
          .status(400)
          .json({ message: "Invalid technologies or features format" });
      }

      // Handle image based on source
      if (req.body.imageSource === "file" && req.file) {
        projectData.image = `/uploads/projects/${req.file.filename}`;
        console.log("Using uploaded file image path:", projectData.image);

        // Verify file exists
        const uploadsRoot =
          process.env.UPLOADS_DIR || path.join(__dirname, "../uploads");
        const relativePath = projectData.image.replace(/^\/uploads\/?/, "");
        const fullPath = path.join(uploadsRoot, relativePath);
        if (!fs.existsSync(fullPath)) {
          console.error("Uploaded file not found at:", fullPath);
          return res.status(400).json({ message: "Image file not found" });
        }
      } else if (req.body.imageSource === "url" && req.body.image) {
        projectData.image = req.body.image;
        console.log("Using URL image:", projectData.image);
      } else {
        console.error("No valid image provided");
        return res.status(400).json({ message: "Image is required" });
      }

      // Remove imageSource from the data
      delete projectData.imageSource;

      const project = new Project(projectData);
      const newProject = await project.save();
      console.log("Project created successfully:", newProject._id);
      res.status(201).json(newProject);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(400).json({ message: error.message });
    }
  },
);

// Update project (admin only)
router.patch(
  "/:id",
  protect,
  admin,
  upload.single("image"),
  handleMulterError,
  async (req, res) => {
    try {
      console.log("Updating project:", req.params.id, {
        body: req.body,
        file: req.file,
      });

      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const updateData = { ...req.body };

      // Parse technologies and features if they're JSON strings
      try {
        if (typeof updateData.technologies === "string") {
          updateData.technologies = JSON.parse(updateData.technologies);
        }
        if (typeof updateData.features === "string") {
          updateData.features = JSON.parse(updateData.features);
        }
      } catch (error) {
        console.error("Error parsing technologies or features:", error);
        return res
          .status(400)
          .json({ message: "Invalid technologies or features format" });
      }

      // Handle image based on source
      if (req.body.imageSource === "file" && req.file) {
        // Delete old image if it's a local file
        if (project.image && project.image.startsWith("/uploads/")) {
          const uploadsRoot =
            process.env.UPLOADS_DIR || path.join(__dirname, "../uploads");
          const relativeOld = project.image.replace(/^\/uploads\/?/, "");
          const oldImagePath = path.join(uploadsRoot, relativeOld);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        updateData.image = `/uploads/projects/${req.file.filename}`;
        console.log("Using new uploaded file image path:", updateData.image);

        // Verify new file exists
        const uploadsRoot =
          process.env.UPLOADS_DIR || path.join(__dirname, "../uploads");
        const relativePath = updateData.image.replace(/^\/uploads\/?/, "");
        const fullPath = path.join(uploadsRoot, relativePath);
        if (!fs.existsSync(fullPath)) {
          console.error("Uploaded file not found at:", fullPath);
          return res.status(400).json({ message: "Image file not found" });
        }
      } else if (req.body.imageSource === "url" && req.body.image) {
        updateData.image = req.body.image;
        console.log("Using URL image:", updateData.image);
      }

      // Remove imageSource from the data
      delete updateData.imageSource;

      Object.keys(updateData).forEach((key) => {
        project[key] = updateData[key];
      });

      const updatedProject = await project.save();
      console.log("Project updated successfully:", updatedProject._id);
      res.json(updatedProject);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(400).json({ message: error.message });
    }
  },
);

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
