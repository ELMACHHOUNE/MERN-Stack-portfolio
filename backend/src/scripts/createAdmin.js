require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("Connected to MongoDB");

    const adminUser = {
      name: "Admin User",
      email: "admin@example.com",
      password: "Admin123!", // Strong password with uppercase, lowercase, number, and special character
      isAdmin: true,
    };

    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const user = new User(adminUser);
    await user.save();

    console.log("Admin user created successfully");
    console.log("Email:", adminUser.email);
    console.log("Password:", adminUser.password);
    console.log("\nPlease change these credentials after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdmin();
