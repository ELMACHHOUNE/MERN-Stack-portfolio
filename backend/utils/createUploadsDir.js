const fs = require("fs");
const path = require("path");

const createUploadsDir = () => {
  try {
    // Use the uploads directory at the root of the backend folder
    const uploadsDir = path.join(__dirname, "../../uploads");
    const projectsDir = path.join(uploadsDir, "projects");

    console.log("Creating directories at:", {
      uploadsDir,
      projectsDir,
    });

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      console.log("Creating uploads directory...");
      fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o777 });
      console.log("Uploads directory created successfully");
    }

    // Create projects directory if it doesn't exist
    if (!fs.existsSync(projectsDir)) {
      console.log("Creating projects directory...");
      fs.mkdirSync(projectsDir, { recursive: true, mode: 0o777 });
      console.log("Projects directory created successfully");
    }

    // Verify directories exist and are writable
    try {
      fs.accessSync(uploadsDir, fs.constants.W_OK);
      fs.accessSync(projectsDir, fs.constants.W_OK);
      console.log("Directories are writable");
    } catch (err) {
      console.error("Directory permission error:", err);
      throw new Error("Upload directories are not writable");
    }
  } catch (error) {
    console.error("Error creating upload directories:", error);
    throw error;
  }
};

module.exports = createUploadsDir;
