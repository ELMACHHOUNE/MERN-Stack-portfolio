const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "pageView",
        "contactSubmission",
        "resumeDownload",
        "projectView",
        "skillView",
      ],
    },
    visitorId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    ip: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: "Unknown",
    },
    city: {
      type: String,
      default: "Unknown",
    },
    userAgent: {
      type: String,
      required: true,
    },
    referrer: {
      type: String,
    },
    path: {
      type: String,
      required: true,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
analyticsSchema.index({ type: 1, timestamp: -1 });
analyticsSchema.index({ visitorId: 1, timestamp: -1 });
analyticsSchema.index({ country: 1, timestamp: -1 });
analyticsSchema.index({ path: 1, timestamp: -1 });

const Analytics = mongoose.model("Analytics", analyticsSchema);

module.exports = Analytics;
