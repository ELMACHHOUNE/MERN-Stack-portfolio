const mongoose = require("mongoose");

// Load models in correct order
const loadModels = async () => {
  try {
    // First load Category model
    require("./Category");
    console.log("Category model loaded");

    // Then load other models that might reference Category
    require("./Skill");
    console.log("Skill model loaded");

    // Load remaining models
    require("./User");
    require("./Experience");
    require("./Project");
    require("./Setting");
    require("./Contact");
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
