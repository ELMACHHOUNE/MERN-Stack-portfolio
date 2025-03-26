import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../context/ThemeContext";
import {
  IconBrandGithub,
  IconExternalLink,
  IconSearch,
  IconFilter,
  IconX,
} from "@tabler/icons-react";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  features: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: string;
  startDate: string;
  endDate: string;
  order: number;
  isActive: boolean;
}

const Projects: React.FC = () => {
  const { isDarkMode } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(
    []
  );
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const [categories, setCategories] = useState<string[]>(["All"]);

  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log("Fetching all projects...");
        setLoading(true);

        const response = await fetch("http://localhost:5000/api/projects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          mode: "cors",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched projects:", data);
        setProjects(data);

        // Extract unique categories
        const uniqueCategories = [
          "All",
          ...new Set(data.map((p: Project) => p.category)),
        ] as string[];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch projects"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    console.log("Applying filters:", {
      selectedCategory,
      selectedTechnologies,
      searchTerm,
      sortBy,
    });

    let filtered = [...projects];

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (project) =>
          project.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Technologies filter
    if (selectedTechnologies.length > 0) {
      filtered = filtered.filter((project) =>
        selectedTechnologies.every((tech) =>
          project.technologies.some(
            (projectTech) => projectTech.toLowerCase() === tech.toLowerCase()
          )
        )
      );
    }

    // Search term filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(search) ||
          project.description.toLowerCase().includes(search) ||
          project.technologies.some((tech) =>
            tech.toLowerCase().includes(search)
          )
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
        case "oldest":
          return (
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    console.log("Filtered projects:", filtered);
    setFilteredProjects(filtered);
  }, [projects, selectedCategory, selectedTechnologies, searchTerm, sortBy]);

  // Get unique technologies from all projects
  const allTechnologies = Array.from(
    new Set(projects.flatMap((project) => project.technologies))
  ).sort();

  const toggleTechnology = (tech: string) => {
    setSelectedTechnologies((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const handleCategoryChange = (category: string) => {
    console.log("Changing category to:", category);
    setSelectedCategory(category);
    setShowFilters(false);
  };

  const resetFilters = () => {
    console.log("Resetting all filters");
    setSelectedCategory("All");
    setSelectedTechnologies([]);
    setSortBy("newest");
    setSearchTerm("");
    setShowFilters(false);
  };

  // Animation effects
  useEffect(() => {
    if (!titleRef.current || !cardsRef.current.length) return;

    gsap.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      gsap.fromTo(
        card,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [filteredProjects]);

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-center text-red-500">
          <p>Error loading projects: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="projects"
      className={`py-24 ${
        isDarkMode
          ? "bg-gradient-to-b from-gray-900 to-gray-800"
          : "bg-gradient-to-b from-gray-100 to-white"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          ref={titleRef}
          className={`text-4xl font-bold text-center mb-12 relative ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          My Projects
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></span>
        </h2>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
              isDarkMode
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-white text-gray-900 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            <IconFilter className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div
            className={`rounded-lg p-4 mb-6 ${
              isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Filters
              </h3>
              <button
                onClick={resetFilters}
                className={`transition-colors ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div className="mb-4">
              <h4
                className={`text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Category
              </h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : isDarkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className="mb-4">
              <h4
                className={`text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {allTechnologies.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => toggleTechnology(tech)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedTechnologies.includes(tech)
                        ? "bg-purple-600 text-white"
                        : isDarkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <h4
                className={`text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Sort By
              </h4>
              <div className="flex gap-2">
                {[
                  { value: "newest", label: "Newest First" },
                  { value: "oldest", label: "Oldest First" },
                  { value: "name", label: "Name" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setSortBy(option.value as "newest" | "oldest" | "name")
                    }
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      sortBy === option.value
                        ? "bg-green-600 text-white"
                        : isDarkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(selectedCategory !== "All" ||
          selectedTechnologies.length > 0 ||
          searchTerm) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCategory !== "All" && (
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm flex items-center">
                {selectedCategory}
                <button
                  onClick={() => handleCategoryChange("All")}
                  className="ml-2 hover:text-gray-200"
                >
                  <IconX className="w-4 h-4" />
                </button>
              </span>
            )}
            {selectedTechnologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm flex items-center"
              >
                {tech}
                <button
                  onClick={() => toggleTechnology(tech)}
                  className="ml-2 hover:text-gray-200"
                >
                  <IconX className="w-4 h-4" />
                </button>
              </span>
            ))}
            {searchTerm && (
              <span className="px-3 py-1 bg-yellow-600 text-white rounded-full text-sm flex items-center">
                Search: {searchTerm}
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-2 hover:text-gray-200"
                >
                  <IconX className="w-4 h-4" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <div
              key={project._id}
              ref={(el) => (cardsRef.current[index] = el as HTMLDivElement)}
              className={`rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 ${
                isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
              }`}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {project.title}
                </h3>
                <p
                  className={`mb-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className={`px-2 py-1 rounded-full text-sm ${
                        isDarkMode
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-400"
                    >
                      GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:text-green-400"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div
            className={`text-center mt-8 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            No projects found matching your criteria.
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
