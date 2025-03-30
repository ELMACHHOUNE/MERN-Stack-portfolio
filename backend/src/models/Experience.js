const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide a company name"],
      trim: true,
    },
    position: {
      type: String,
      required: [true, "Please provide a position"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Please provide a start date"],
    },
    endDate: {
      type: Date,
      required: [
        function () {
          return !this.current;
        },
        "Please provide an end date for past experiences",
      ],
    },
    current: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
    },
    technologies: [
      {
        type: String,
        trim: true,
      },
    ],
    order: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model("Experience", experienceSchema);
