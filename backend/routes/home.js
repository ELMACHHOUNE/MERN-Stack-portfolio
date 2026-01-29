const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Category = require("../models/Category");
const Skill = require("../models/Skill");
const Project = require("../models/Project");
const Experience = require("../models/Experience");
const Contact = require("../models/Contact");

// @route   GET /api/home
// @desc    Get aggregated public data for Home page
// @access  Public
router.get("/", async (req, res) => {
  try {
    // Fetch public admin profile
    const adminUser = await User.findOne({ isAdmin: true })
      .select("-password -__v -createdAt -updatedAt")
      .lean();

    const profile = adminUser
      ? {
          name: adminUser.name || "Admin User",
          email: adminUser.email || "",
          title: adminUser.title || "Full Stack Developer",
          location: adminUser.location || "",
          bio: adminUser.bio || "",
          profileImage: adminUser.profileImage || null,
          interests: adminUser.interests || [],
          values: adminUser.values || [],
          socialLinks: adminUser.socialLinks || {},
          cvUrl: adminUser.cvUrl || "",
        }
      : null;

    // Fetch active categories and skills
    const [categories, skills] = await Promise.all([
      Category.find({ isActive: true }).sort({ order: 1 }).lean(),
      Skill.find({ isActive: true })
        .populate("category", "name description icon")
        .sort({ order: 1 })
        .lean(),
    ]);

    // Compute basic stats
    const [projectsCount, contactsCount, experiences] = await Promise.all([
      Project.countDocuments({ isActive: true }),
      Contact.countDocuments({ isActive: true }),
      Experience.find({ isActive: true }).select("startDate current").lean(),
    ]);

    let yearsOfExperience = 0;
    if (experiences && experiences.length > 0) {
      const earliestStart = experiences
        .map((e) => e.startDate)
        .filter(Boolean)
        .sort((a, b) => new Date(a) - new Date(b))[0];
      if (earliestStart) {
        const diffMs = Date.now() - new Date(earliestStart).getTime();
        yearsOfExperience = Math.max(
          0,
          Math.floor(diffMs / (365 * 24 * 60 * 60 * 1000)),
        );
      }
    }

    const stats = {
      yearsOfExperience,
      projectsCompleted: projectsCount,
      happyClients: contactsCount,
    };

    res.json({ profile, categories, skills, stats });
  } catch (error) {
    console.error("Error fetching home data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
