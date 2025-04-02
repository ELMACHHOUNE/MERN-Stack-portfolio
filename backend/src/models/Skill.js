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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    level: {
      type: Number,
      required: [true, "Skill level is required"],
      min: [1, "Skill level cannot be less than 1"],
      max: [10, "Skill level cannot be more than 10"],
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

module.exports = mongoose.model("Skill", skillSchema);
