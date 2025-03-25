const mongoose = require("mongoose");
const Project = require("../models/Project");
require("dotenv").config();

const projects = [
  {
    title: "Portfolio Website",
    description:
      "A modern and responsive portfolio website built with React and TypeScript. Features include dark mode, animations, and a contact form.",
    image: "/images/projects/portfolio.jpg",
    technologies: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Node.js",
      "Express",
      "MongoDB",
    ],
    features: [
      "Responsive design with mobile-first approach",
      "Dark mode support",
      "Smooth animations and transitions",
      "Contact form with email integration",
      "Admin dashboard for content management",
    ],
    githubUrl: "https://github.com/yourusername/portfolio",
    liveUrl: "https://yourportfolio.com",
    category: "web",
    order: 1,
    isActive: true,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-03-01"),
  },
  {
    title: "E-commerce Platform",
    description:
      "A full-stack e-commerce platform with features like product management, shopping cart, and payment integration.",
    image: "/images/projects/ecommerce.jpg",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe", "Redux"],
    features: [
      "Product catalog with filtering and search",
      "Shopping cart functionality",
      "Secure payment processing with Stripe",
      "Admin dashboard for inventory management",
      "User authentication and authorization",
    ],
    githubUrl: "https://github.com/yourusername/ecommerce",
    liveUrl: "https://yourstore.com",
    category: "web",
    order: 2,
    isActive: true,
    startDate: new Date("2023-10-01"),
    endDate: new Date("2023-12-31"),
  },
  {
    title: "Task Management App",
    description:
      "A mobile-first task management application with real-time updates and team collaboration features.",
    image: "/images/projects/taskmanager.jpg",
    technologies: ["React Native", "Firebase", "Redux", "Node.js"],
    features: [
      "Real-time task updates",
      "Team collaboration",
      "Task categories and tags",
      "Push notifications",
      "Offline support",
    ],
    githubUrl: "https://github.com/yourusername/taskmanager",
    liveUrl:
      "https://play.google.com/store/apps/details?id=com.yourcompany.taskmanager",
    category: "mobile",
    order: 1,
    isActive: true,
    startDate: new Date("2023-07-01"),
    endDate: new Date("2023-09-30"),
  },
];

const seedProjects = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Clear existing projects
    await Project.deleteMany({});
    console.log("Cleared existing projects");

    // Insert new projects
    const insertedProjects = await Project.insertMany(projects);
    console.log(`Successfully inserted ${insertedProjects.length} projects`);

    // Close the connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding projects:", error);
    process.exit(1);
  }
};

seedProjects();
