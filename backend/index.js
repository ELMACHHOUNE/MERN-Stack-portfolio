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
const errorHandler = require("./middleware/error");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

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
  })
);

app.use(hpp());

// CORS configuration
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Authorization"],
  })
);

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
const uploadsPath = path.join(__dirname, "uploads");
// Create uploads directory if it doesn't exist
const fs = require("fs");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
if (!fs.existsSync(path.join(uploadsPath, "profile-images"))) {
  fs.mkdirSync(path.join(uploadsPath, "profile-images"), { recursive: true });
}
app.use("/uploads", express.static(uploadsPath));

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

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Load models after successful connection
    await loadModels();

    // Start server only after successful database connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    console.error(
      "Please make sure MongoDB is installed and running on your system."
    );
    console.error(
      "You can download MongoDB from: https://www.mongodb.com/try/download/community"
    );
    process.exit(1);
  }
};

// Start the application
connectDB();
