const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(compression());

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
    exposedHeaders: ["Content-Type", "Authorization"],
  })
);

// Serve static files from uploads directory
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"), {
    setHeaders: (res, path) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Load models
const loadModels = async () => {
  try {
    // First load Category model
    require("./models/Category");
    console.log("Category model loaded");

    // Then load other models that might reference Category
    require("./models/Skill");
    console.log("Skill model loaded");

    // Load remaining models
    require("./models/User");
    require("./models/Experience");
    require("./models/Project");
    require("./models/Setting");
    require("./models/Contact");
    console.log("All models loaded successfully");

    // Verify model references
    if (!mongoose.models.Category) {
      throw new Error("Category model not properly registered");
    }
    if (!mongoose.models.Skill) {
      throw new Error("Skill model not properly registered");
    }
    console.log("Model references verified");
  } catch (error) {
    console.error("Error loading models:", error);
    throw error;
  }
};

// Connect to MongoDB and load models
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio")
  .then(async () => {
    console.log("MongoDB Connected");
    await loadModels();

    // Load routes after models are loaded
    app.use("/api/auth", require("./routes/auth"));
    app.use("/api/skills", require("./routes/skills"));
    app.use("/api/categories", require("./routes/categories"));
    app.use("/api/experiences", require("./routes/experiences"));
    app.use("/api/projects", require("./routes/projects"));
    app.use("/api/settings", require("./routes/settings"));
    app.use("/api/contact", require("./routes/contact"));

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: "Something went wrong!" });
    });

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
