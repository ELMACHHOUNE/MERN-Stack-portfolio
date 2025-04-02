const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [50, "Category name cannot be more than 50 characters"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Category description is required"],
      trim: true,
      maxlength: [
        500,
        "Category description cannot be more than 500 characters",
      ],
    },
    icon: {
      type: String,
      required: [true, "Category icon is required"],
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
categorySchema.index({ order: 1 });

module.exports = mongoose.model("Category", categorySchema);
