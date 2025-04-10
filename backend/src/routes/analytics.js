const express = require("express");
const router = express.Router();
const Analytics = require("../models/Analytics");
const { protect, admin } = require("../middleware/auth");
const User = require("../models/User");

// @route   GET /api/analytics
// @desc    Get analytics data
// @access  Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    console.log("Fetching analytics data");
    const { timeRange = "week" } = req.query;
    console.log("Time range:", timeRange);

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

    console.log("Start date:", startDate);

    // Get all analytics records for debugging
    const allRecords = await Analytics.find({
      createdAt: { $gte: startDate },
    });
    console.log("Total records found:", allRecords.length);
    console.log("Sample records:", allRecords.slice(0, 3));

    // Get unique visitors
    const uniqueVisitors = await Analytics.distinct("visitorId", {
      createdAt: { $gte: startDate },
      isAdmin: { $ne: true },
    });
    console.log("Unique visitors:", uniqueVisitors.length);

    // Get page views
    const pageViews = await Analytics.countDocuments({
      type: "pageView",
      createdAt: { $gte: startDate },
      path: { $not: /^\/admin/ },
      isAdmin: { $ne: true },
    });
    console.log("Page views:", pageViews);

    // Get contact submissions
    const contactSubmissions = await Analytics.countDocuments({
      type: "contactSubmission",
      createdAt: { $gte: startDate },
    });
    console.log("Contact submissions:", contactSubmissions);

    // Get resume downloads
    const resumeDownloads = await Analytics.countDocuments({
      type: "resumeDownload",
      createdAt: { $gte: startDate },
    });
    console.log("Resume downloads:", resumeDownloads);

    // Get top locations
    const topLocations = await Analytics.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          isAdmin: { $ne: true },
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
          createdAt: { $gte: startDate },
          isAdmin: { $ne: true },
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
          createdAt: { $gte: startDate },
          isAdmin: { $ne: true },
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
          createdAt: { $gte: startDate },
          timeSpent: { $gt: 0 },
          isAdmin: { $ne: true },
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

    const analyticsData = {
      uniqueVisitors: uniqueVisitors.length,
      pageViews,
      contactSubmissions,
      resumeDownloads,
      topLocations,
      topProjects,
      topSkills,
      timeSpent,
    };

    console.log("Final analytics data:", analyticsData);
    res.json(analyticsData);
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
      userId,
      ip,
      userAgent,
      referrer,
      path,
      timeSpent = 0,
      metadata = {},
    } = req.body;

    // Check if user is admin
    let isAdmin = false;
    if (userId) {
      const user = await User.findById(userId);
      isAdmin = user ? user.isAdmin : false;
    }

    // Skip tracking if user is admin
    if (isAdmin) {
      return res.status(200).json({ message: "Admin activity not tracked" });
    }

    const analytics = new Analytics({
      type,
      visitorId,
      userId,
      isAdmin,
      ip,
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
