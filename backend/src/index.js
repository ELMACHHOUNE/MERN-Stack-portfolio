const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const morgan = require("morgan");
const contactRouter = require("./routes/contact");
const authRouter = require("./routes/auth");
const skillsRouter = require("./routes/skills");
const categoriesRouter = require("./routes/categories");
const experienceRouter = require("./routes/experience");
const projectsRouter = require("./routes/projects");
const settingsRouter = require("./routes/settings");
const xss = require("xss-clean");
const hpp = require("hpp");
const loadModels = require("./models");
const errorHandler = require("./middleware/error");

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Logging middleware
app.use(morgan("dev"));

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

// Prevent XSS attacks
app.use(xss());

// Prevent http param pollution
app.use(hpp());

// CORS configuration
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// More lenient limiter for development
const devLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // much higher limit for development
  message: "Too many requests from this IP, please try again later.",
});

// Apply rate limiting based on environment
if (process.env.NODE_ENV === "production") {
  app.use("/api/", limiter);
} else {
  app.use("/api", devLimiter);
}

// Enable compression
app.use(compression());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Connect to MongoDB and load models
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");

    // Load models
    await loadModels();
    console.log("Models loaded successfully");

    // Create uploads directory if it doesn't exist
    const fs = require("fs");
    const uploadsDir = path.join(__dirname, "../uploads/profiles");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/contact", contactRouter);
app.use("/api/auth", authRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/experience", experienceRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/settings", settingsRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  // Close server & exit process
  server.close(() => process.exit(1));
});
