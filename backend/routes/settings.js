const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const User = require("../models/User");
const path = require("path");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { upload, handleMulterError } = require("../middleware/upload");

const getUploadsRoot = () =>
  process.env.UPLOADS_DIR || path.join(__dirname, "../uploads");

// Get current user's profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update current user's profile
router.put("/profile", protect, async (req, res) => {
  try {
    const {
      name,
      email,
      currentPassword,
      newPassword,
      title,
      location,
      bio,
      interests,
      socialLinks,
    } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }
      user.password = newPassword;
    }

    // Update other fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (title) user.title = title;
    if (location) user.location = location;
    if (bio) user.bio = bio;
    if (interests) user.interests = interests;
    if (socialLinks) user.socialLinks = socialLinks;

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ message: "Profile updated successfully", user: userResponse });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Upload profile image
router.post(
  "/profile-image",
  protect,
  upload.single("image"),
  handleMulterError,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Delete old profile image if it exists
      if (user.profileImage) {
        const uploadsRoot = getUploadsRoot();
        const relativeOld = user.profileImage.replace(/^\/uploads\/?/, "");
        const oldImagePath = path.join(uploadsRoot, relativeOld);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Update user's profile image path
      user.profileImage = `/uploads/profile-images/${req.file.filename}`;
      await user.save();

      res.json({
        message: "Profile image updated successfully",
        profileImage: user.profileImage,
      });
    } catch (error) {
      console.error("Profile image upload error:", error);
      res.status(500).json({ message: "Failed to upload profile image" });
    }
  },
);

// Get admin profile
router.get("/admin-profile", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update admin profile
router.put("/admin-profile", protect, admin, async (req, res) => {
  try {
    const {
      name,
      email,
      title,
      location,
      bio,
      interests,
      values,
      socialLinks,
    } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (title) user.title = title;
    if (location) user.location = location;
    if (bio) user.bio = bio;
    if (interests) user.interests = interests;
    if (values) user.values = values;
    if (socialLinks) user.socialLinks = socialLinks;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Admin profile update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get public admin profile
router.get("/public-profile", async (req, res) => {
  try {
    // Find the admin user with all necessary fields
    const adminUser = await User.findOne({ isAdmin: true })
      .select("-password -__v -createdAt -updatedAt")
      .lean();

    if (!adminUser) {
      return res.status(404).json({ message: "Admin profile not found" });
    }

    // Ensure all required fields have default values if not set
    const publicProfile = {
      name: adminUser.name || "Admin User",
      email: adminUser.email || "",
      title: adminUser.title || "Full Stack Developer",
      location: adminUser.location || "Location not specified",
      bio: adminUser.bio || "No bio available",
      profileImage: adminUser.profileImage || null,
      interests: adminUser.interests || [],
      values: adminUser.values || [],
      socialLinks: adminUser.socialLinks || {},
    };

    res.json(publicProfile);
  } catch (error) {
    console.error("Error fetching public admin profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
