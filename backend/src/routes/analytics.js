const express = require("express");
const router = express.Router();
const Analytics = require("../models/Analytics");
const { protect, admin } = require("../middleware/auth");

// @route   GET /api/analytics
// @desc    Get analytics data
// @access  Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const { timeRange = "week" } = req.query;
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case "day":
        startDate = new Date(now.setDate(now.getDate() - 1));
        break;
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    // Get unique visitors
    const uniqueVisitors = await Analytics.distinct("visitorId", {
      timestamp: { $gte: startDate },
    });

    // Get page views
    const pageViews = await Analytics.countDocuments({
      type: "pageView",
      timestamp: { $gte: startDate },
    });

    // Get contact submissions
    const contactSubmissions = await Analytics.countDocuments({
      type: "contactSubmission",
      timestamp: { $gte: startDate },
    });

    // Get resume downloads
    const resumeDownloads = await Analytics.countDocuments({
      type: "resumeDownload",
      timestamp: { $gte: startDate },
    });

    // Get top locations
    const topLocations = await Analytics.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          country: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Get top projects
    const topProjects = await Analytics.aggregate([
      {
        $match: {
          type: "projectView",
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$metadata.projectId",
          views: { $sum: 1 },
        },
      },
      {
        $sort: { views: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $unwind: "$project",
      },
      {
        $project: {
          title: "$project.title",
          views: 1,
          _id: 0,
        },
      },
    ]);

    // Get top skills
    const topSkills = await Analytics.aggregate([
      {
        $match: {
          type: "skillView",
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$metadata.skillId",
          views: { $sum: 1 },
        },
      },
      {
        $sort: { views: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "skills",
          localField: "_id",
          foreignField: "_id",
          as: "skill",
        },
      },
      {
        $unwind: "$skill",
      },
      {
        $project: {
          name: "$skill.name",
          views: 1,
          _id: 0,
        },
      },
    ]);

    // Get time spent statistics
    const timeSpentStats = await Analytics.aggregate([
      {
        $match: {
          type: "pageView",
          timestamp: { $gte: startDate },
          timeSpent: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          average: { $avg: "$timeSpent" },
          total: { $sum: "$timeSpent" },
        },
      },
    ]);

    const timeSpent = timeSpentStats[0] || { average: 0, total: 0 };

    res.json({
      uniqueVisitors: uniqueVisitors.length,
      pageViews,
      contactSubmissions,
      resumeDownloads,
      topLocations,
      topProjects,
      topSkills,
      timeSpent,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/analytics
// @desc    Track analytics event
// @access  Public
router.post("/", async (req, res) => {
  try {
    const {
      type,
      visitorId,
      ip,
      country = "Unknown",
      city = "Unknown",
      userAgent,
      referrer,
      path,
      timeSpent = 0,
      metadata = {},
    } = req.body;

    const analytics = new Analytics({
      type,
      visitorId,
      ip,
      country,
      city,
      userAgent,
      referrer,
      path,
      timeSpent,
      metadata,
    });

    await analytics.save();
    res.status(201).json({ message: "Analytics event tracked successfully" });
  } catch (error) {
    console.error("Error tracking analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
