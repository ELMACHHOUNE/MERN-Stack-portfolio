const mongoose = require("mongoose");
const User = require("./User");
const Project = require("./Project");
const Skill = require("./Skill");
const Category = require("./Category");
const Experience = require("./Experience");
const Contact = require("./Contact");
const Setting = require("./Setting");
const Analytics = require("./Analytics");

// Load models in correct order
const loadModels = async () => {
  try {
    await User.init();
    await Project.init();
    await Skill.init();
    await Category.init();
    await Experience.init();
    await Contact.init();
    await Setting.init();
    await Analytics.init();
    console.log("All models loaded successfully");

    // Verify model references
    if (!mongoose.models.Category) {
      throw new Error("Category model not properly registered");
    }
    if (!mongoose.models.Skill) {
      throw new Error("Skill model not properly registered");
    }
    console.log("Model references verified");
  } catch (error) {
    console.error("Error loading models:", error);
    throw error;
  }
};

module.exports = loadModels;
