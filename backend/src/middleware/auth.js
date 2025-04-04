const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      console.log("No token found in request headers:", req.headers);
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token verified, decoded:", decoded);

      // Get user from token
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        console.log("No user found with token ID:", decoded.id);
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      // Add user to request
      req.user = user;

      // Update last login
      req.user.lastLogin = new Date();
      await req.user.save();

      next();
    } catch (error) {
      console.log("Token verification failed:", error.message);
      console.log("Token used:", token.substring(0, 10) + "...");
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const admin = async (req, res, next) => {
  try {
    if (!req.user) {
      console.log("No user found in request");
      return res.status(401).json({ message: "Not authorized, no user" });
    }
    if (!req.user.isAdmin) {
      console.log("User is not admin:", req.user);
      return res.status(403).json({ message: "Not authorized as admin" });
    }
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Export the middleware functions
module.exports = {
  protect,
  admin,
};
