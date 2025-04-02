import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { Github, Link, ExternalLink } from "lucide-react";

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
  const { t, currentLanguage } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    selectedCategory: t("projects.all"),
    selectedTechnologies: [] as string[],
    searchTerm: "",
    sortBy: "newest",
    showFilters: false,
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:5000/api/projects");
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`);
      }

      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("projects.error"));
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects on mount and when language changes
  useEffect(() => {
    fetchProjects();
  }, [currentLanguage]);

  // Reset filters when language changes
  useEffect(() => {
    setFilters({
      selectedCategory: t("projects.all"),
      selectedTechnologies: [],
      searchTerm: "",
      sortBy: "newest",
      showFilters: false,
    });
  }, [currentLanguage, t]);

  const filterProjects = (projects: Project[]) => {
    const filtered = projects.filter((project) => {
      const matchesCategory =
        filters.selectedCategory === t("projects.all") ||
        project.category === filters.selectedCategory;

      const matchesTechnologies =
        filters.selectedTechnologies.length === 0 ||
        filters.selectedTechnologies.every((tech) =>
          project.technologies.includes(tech)
        );

      const matchesSearch =
        !filters.searchTerm ||
        project.title
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        project.description
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

      return matchesCategory && matchesTechnologies && matchesSearch;
    });

    return filtered;
  };

  const sortProjects = (projects: Project[]) => {
    return [...projects].sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return (
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
        case "oldest":
          return (
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );
        default:
          return 0;
      }
    });
  };

  const filteredProjects = sortProjects(filterProjects(projects));

  // Get unique technologies from all projects
  const allTechnologies = Array.from(
    new Set(projects.flatMap((project) => project.technologies))
  ).sort();

  const toggleTechnology = (tech: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedTechnologies: prev.selectedTechnologies.includes(tech)
        ? prev.selectedTechnologies.filter((t) => t !== tech)
        : [...prev.selectedTechnologies, tech],
    }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedCategory: category,
    }));
  };

  const resetFilters = () => {
    setFilters({
      selectedCategory: t("projects.all"),
      selectedTechnologies: [],
      searchTerm: "",
      sortBy: "newest",
      showFilters: false,
    });
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
          <span className="ml-4 text-gray-400">{t("projects.loading")}</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-center text-red-500">
          <p>{t("projects.error")}</p>
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
          {t("projects.title")}
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></span>
        </h2>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t("projects.search")}
              value={filters.searchTerm}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
              }
              className={`w-full pl-10 pr-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>
          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                showFilters: !prev.showFilters,
              }))
            }
            className={`flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
              isDarkMode
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-white text-gray-900 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            <Github className="w-5 h-5 mr-2" />
            {t("projects.filter")}
          </button>
        </div>

        {/* Filter Panel */}
        {filters.showFilters && (
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
                {t("projects.filter")}
              </h3>
              <button
                onClick={resetFilters}
                className={`transition-colors ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Github className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div className="mb-4">
              <h4
                className={`text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("projects.categories.category")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  t("projects.all"),
                  ...new Set(projects.map((p) => p.category)),
                ].map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      filters.selectedCategory === category
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
                {t("projects.technologies")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {allTechnologies.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => toggleTechnology(tech)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      filters.selectedTechnologies.includes(tech)
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
                {t("projects.sortBy")}
              </h4>
              <div className="flex gap-2">
                {[
                  { value: "newest", label: t("projects.newest") },
                  { value: "oldest", label: t("projects.oldest") },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: option.value as "newest" | "oldest" | "name",
                      }))
                    }
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      filters.sortBy === option.value
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
        {(filters.selectedCategory !== "All" ||
          filters.selectedTechnologies.length > 0 ||
          filters.searchTerm) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.selectedCategory !== "All" && (
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm flex items-center">
                {filters.selectedCategory}
                <button
                  onClick={() => handleCategoryChange("All")}
                  className="ml-2 hover:text-gray-200"
                >
                  <Github className="w-4 h-4" />
                </button>
              </span>
            )}
            {filters.selectedTechnologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm flex items-center"
              >
                {tech}
                <button
                  onClick={() => toggleTechnology(tech)}
                  className="ml-2 hover:text-gray-200"
                >
                  <Github className="w-4 h-4" />
                </button>
              </span>
            ))}
            {filters.searchTerm && (
              <span className="px-3 py-1 bg-yellow-600 text-white rounded-full text-sm flex items-center">
                Search: {filters.searchTerm}
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, searchTerm: "" }))
                  }
                  className="ml-2 hover:text-gray-200"
                >
                  <Github className="w-4 h-4" />
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
                      title={t("projects.viewCode")}
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:text-green-400"
                      title={t("projects.viewProject")}
                    >
                      <Link className="h-5 w-5" />
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
            {t("projects.noProjects")}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
