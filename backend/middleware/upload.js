const multer = require("multer");
const path = require("path");
const fs = require("fs");

const getUploadsRoot = () =>
  process.env.UPLOADS_DIR || path.join(__dirname, "../uploads");

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    const uploadsRoot = getUploadsRoot();

    // Determine upload path based on the field name
    if (file.fieldname === "icon") {
      uploadPath = path.join(uploadsRoot, "skills");
    } else if (file.fieldname === "image") {
      // Reuse the same field name "image" for multiple endpoints.
      // Route by request path to avoid collisions.
      if (req.baseUrl === "/api/settings" && req.path === "/profile-image") {
        uploadPath = path.join(uploadsRoot, "profile-images");
      } else {
        uploadPath = path.join(uploadsRoot, "projects");
      }
    } else {
      return cb(new Error("Invalid file field name"), false);
    }

    console.log("Upload path:", uploadPath);

    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      console.log("Creating upload directory:", uploadPath);
      fs.mkdirSync(uploadPath, { recursive: true, mode: 0o777 });
    }

    // Verify directory is writable
    try {
      fs.accessSync(uploadPath, fs.constants.W_OK);
      console.log("Upload directory is writable");
      cb(null, uploadPath);
    } catch (err) {
      console.error("Upload directory error:", err);
      cb(new Error("Upload directory is not writable"));
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];
  console.log("Checking file type:", file.mimetype);

  if (allowedTypes.includes(file.mimetype)) {
    console.log("File type accepted");
    cb(null, true);
  } else {
    console.log("File type rejected");
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, GIF, WebP, and SVG are allowed.",
      ),
      false,
    );
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Error handler middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("Multer error:", err);
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File size too large. Maximum size is 5MB." });
    }
    return res.status(400).json({ message: err.message });
  } else if (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: "Error uploading file" });
  }
  next();
};

module.exports = { upload, handleMulterError };
