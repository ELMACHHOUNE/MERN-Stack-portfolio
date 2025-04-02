const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      required: [true, "Site name is required"],
      trim: true,
      maxlength: [50, "Site name cannot be more than 50 characters"],
    },
    siteDescription: {
      type: String,
      required: [true, "Site description is required"],
      trim: true,
      maxlength: [500, "Site description cannot be more than 500 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    socialLinks: {
      github: String,
      linkedin: String,
      twitter: String,
      facebook: String,
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

module.exports = mongoose.model("Setting", settingSchema);
