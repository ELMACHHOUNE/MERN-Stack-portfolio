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
const analyticsRouter = require("./routes/analytics");
const hpp = require("hpp");
const loadModels = require("./models");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const logger = require("./utils/logger");

// Load environment variables
dotenv.config({ quiet: true });

// Create Express app
const app = express();

// CORS configuration - MUST BE FIRST
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Configure Helmet with necessary adjustments for image loading and XSS protection
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:", "*"],
        connectSrc: ["'self'", "*"],
      },
    },
    xssFilter: true,
  }),
);

app.use(hpp());

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
// Use a local uploads directory in development. In serverless deployments, you may
// want to override this via UPLOADS_DIR.
const uploadsPath = process.env.UPLOADS_DIR || path.join(__dirname, "uploads");
// Create uploads directory if it doesn't exist
const fs = require("fs");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
if (!fs.existsSync(path.join(uploadsPath, "profile-images"))) {
  fs.mkdirSync(path.join(uploadsPath, "profile-images"), { recursive: true });
}
if (!fs.existsSync(path.join(uploadsPath, "projects"))) {
  fs.mkdirSync(path.join(uploadsPath, "projects"), { recursive: true });
}

// Serve static files with proper headers
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(uploadsPath),
);

// Routes
app.use("/api/contact", contactRouter);
app.use("/api/auth", authRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/experience", experienceRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/analytics", analyticsRouter);

// Root route handler
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Portfolio API",
    status: "online",
    version: "1.0.0",
    endpoints: [
      "/api/auth",
      "/api/contact",
      "/api/skills",
      "/api/categories",
      "/api/experience",
      "/api/projects",
      "/api/settings",
      "/api/analytics",
    ],
  });
});

// Error handling middleware
app.use(errorHandler);

// Start the application
(async () => {
  try {
    logger.info("Backend starting", {
      service: "portfolio-backend",
      env: process.env.NODE_ENV || "development",
    });

    await connectDB();

    // Load models after successful connection
    await loadModels();

    // Start server only after successful database connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info("Server listening", { port: Number(PORT) });
    });
  } catch (error) {
    logger.error("Startup failed", {
      errorName: error?.name,
      errorMessage: error?.message,
      code: error?.code,
      syscall: error?.syscall,
      hostname: error?.hostname,
    });
    process.exit(1);
  }
})();
