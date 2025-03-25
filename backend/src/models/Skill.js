const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
      maxlength: [50, "Skill name cannot be more than 50 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["frontend", "backend", "database", "devops"],
      default: "frontend",
    },
    level: {
      type: Number,
      required: [true, "Skill level is required"],
      min: [0, "Skill level cannot be less than 0"],
      max: [100, "Skill level cannot be more than 100"],
    },
    icon: {
      type: String,
      required: [true, "Icon is required"],
      trim: true,
    },
    order: {
      type: Number,
      required: [true, "Order is required"],
      min: [0, "Order cannot be less than 0"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for efficient querying
skillSchema.index({ category: 1, order: 1 });

const Skill = mongoose.model("Skill", skillSchema);

module.exports = Skill;
