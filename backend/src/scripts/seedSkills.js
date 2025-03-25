const mongoose = require("mongoose");
const Skill = require("../models/Skill");
require("dotenv").config();

const skills = [
  {
    name: "React",
    category: "frontend",
    level: 90,
    icon: "react",
    order: 1,
    isActive: true,
  },
  {
    name: "TypeScript",
    category: "frontend",
    level: 85,
    icon: "typescript",
    order: 2,
    isActive: true,
  },
  {
    name: "Node.js",
    category: "backend",
    level: 88,
    icon: "nodejs",
    order: 1,
    isActive: true,
  },
  {
    name: "Express",
    category: "backend",
    level: 85,
    icon: "express",
    order: 2,
    isActive: true,
  },
  {
    name: "MongoDB",
    category: "database",
    level: 82,
    icon: "mongodb",
    order: 1,
    isActive: true,
  },
  {
    name: "PostgreSQL",
    category: "database",
    level: 80,
    icon: "postgresql",
    order: 2,
    isActive: true,
  },
  {
    name: "Docker",
    category: "devops",
    level: 75,
    icon: "docker",
    order: 1,
    isActive: true,
  },
  {
    name: "AWS",
    category: "devops",
    level: 70,
    icon: "aws",
    order: 2,
    isActive: true,
  },
];

const seedSkills = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Clear existing skills
    await Skill.deleteMany({});
    console.log("Cleared existing skills");

    // Insert new skills
    const insertedSkills = await Skill.insertMany(skills);
    console.log(`Successfully inserted ${insertedSkills.length} skills`);

    // Close the connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding skills:", error);
    process.exit(1);
  }
};

seedSkills();
