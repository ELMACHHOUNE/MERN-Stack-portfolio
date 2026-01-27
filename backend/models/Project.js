const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: [100, "Project title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Project image is required"],
      trim: true,
    },
    technologies: [
      {
        type: String,
        required: [true, "At least one technology is required"],
        trim: true,
      },
    ],
    features: [
      {
        type: String,
        required: [true, "At least one feature is required"],
        trim: true,
      },
    ],
    githubUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\/(www\.)?github\.com\/.+/.test(v);
        },
        message: "Invalid GitHub URL format",
      },
    },
    liveUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\//.test(v);
        },
        message: "Invalid URL format",
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Project category is required"],
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
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
  },
  {
    timestamps: true,
  },
);

// Add index for efficient querying
projectSchema.index({ category: 1, order: 1 });

// Validate that endDate is after startDate
projectSchema.pre("save", function () {
  if (this.endDate < this.startDate) {
    throw new Error("End date must be after start date");
  }
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
