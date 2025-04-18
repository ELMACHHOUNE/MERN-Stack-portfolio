import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../context/LanguageContext";
import {
  Github,
  ExternalLink,
  Code2,
  FolderGit2,
  Search,
  Filter,
  X,
} from "lucide-react";

import { api, API_URL } from "../utils/api";
import { toast } from "react-toastify";

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

// Add a helper function to get the base URL
const getBaseUrl = () => {
  return API_URL.replace(/\/api\/?$/, "");
};

const Projects: React.FC = () => {
  const { t, language } = useLanguage();
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
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/projects");

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error("No projects data received");
      }

      if (!Array.isArray(response.data)) {
        throw new Error(
          "Invalid response format: expected an array of projects"
        );
      }

      setProjects(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t("projects.error");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get<{ _id: string; name: string }[]>(
        "/categories"
      );
      if (response.error) {
        throw new Error(response.error);
      }
      if (response.data) {
        setCategories(response.data);
      } else {
        throw new Error("No categories data received");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : t("categories.management.errors.fetchFailed");
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Fetch projects on mount and when language changes
  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, [language]);

  // Reset filters when language changes
  useEffect(() => {
    setFilters({
      selectedCategory: t("projects.all"),
      selectedTechnologies: [],
      searchTerm: "",
      sortBy: "newest",
      showFilters: false,
    });
  }, [language, t]);

  const filterProjects = (projects: Project[]) => {
    const filtered = projects.filter((project) => {
      const categoryName = categories.find(
        (c) => c._id === project.category
      )?.name;
      const matchesCategory =
        filters.selectedCategory === t("projects.all") ||
        categoryName === filters.selectedCategory;

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

  // Update filter rendering to use project titles
  const renderCategoryFilters = () => {
    return [t("projects.all"), ...categories.map((c) => c.name)].map(
      (category) => (
        <button
          key={category}
          onClick={() => handleCategoryChange(category)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
            filters.selectedCategory === category
              ? "bg-gradient-to-r from-blue-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA] text-white"
              : "bg-gray-100 dark:bg-[#232B3B] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2A3341] border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
          }`}
        >
          {category}
        </button>
      )
    );
  };

  if (loading) {
    return (
      <section className="py-24 bg-white dark:bg-[#0B1121]">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-4 text-gray-600 dark:text-gray-400">
            {t("projects.loading")}
          </span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-white dark:bg-[#0B1121]">
        <div className="text-center text-red-600 dark:text-red-400">
          <p>{t("projects.error")}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="min-h-screen bg-white dark:bg-[#0B1121] py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA] mb-4">
            {t("projects.title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("projects.description")}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t("projects.search")}
              value={filters.searchTerm}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
              }
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1B2333] border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#4F46E5] focus:border-transparent transition-all duration-300"
            />
          </div>
          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                showFilters: !prev.showFilters,
              }))
            }
            className="flex items-center justify-center px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1B2333] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 gap-2"
          >
            <Filter className="w-5 h-5" />
            {t("projects.filter")}
          </button>
        </div>

        {/* Filter Panel */}
        {filters.showFilters && (
          <div className="bg-gray-50 dark:bg-[#1B2333] rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("projects.filter")}
              </h3>
              <button
                onClick={resetFilters}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                {t("projects.categories.category")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {renderCategoryFilters()}
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                {t("projects.technologies")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {allTechnologies.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => toggleTechnology(tech)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      filters.selectedTechnologies.includes(tech)
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 dark:from-[#9333EA] dark:to-[#4F46E5] text-white"
                        : "bg-gray-100 dark:bg-[#232B3B] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2A3341] border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
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
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      filters.sortBy === option.value
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 dark:from-[#059669] dark:to-[#047857] text-white"
                        : "bg-gray-100 dark:bg-[#232B3B] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2A3341] border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
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
        {(filters.selectedCategory !== t("projects.all") ||
          filters.selectedTechnologies.length > 0 ||
          filters.searchTerm) && (
          <div className="flex flex-wrap gap-2 mb-8">
            {filters.selectedCategory !== t("projects.all") && (
              <span className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA] text-white rounded-xl text-sm flex items-center gap-2">
                {filters.selectedCategory}
                <button
                  onClick={() => handleCategoryChange(t("projects.all"))}
                  className="hover:text-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            )}
            {filters.selectedTechnologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-[#9333EA] dark:to-[#4F46E5] text-white rounded-xl text-sm flex items-center gap-2"
              >
                {tech}
                <button
                  onClick={() => toggleTechnology(tech)}
                  className="hover:text-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
            {filters.searchTerm && (
              <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-600 to-amber-600 dark:from-[#D97706] dark:to-[#B45309] text-white rounded-xl text-sm flex items-center gap-2">
                {t("projects.searchResult")}: {filters.searchTerm}
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, searchTerm: "" }))
                  }
                  className="hover:text-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project._id}
              ref={(el) => (cardsRef.current[index] = el as HTMLDivElement)}
              className="group bg-gray-50 dark:bg-[#1B2333] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 shadow-sm dark:shadow-none"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={
                    project.image.startsWith("/uploads/")
                      ? `${getBaseUrl()}${project.image}`
                      : project.image
                  }
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (
                      target.src !==
                      `${window.location.origin}/placeholder-image.jpg`
                    ) {
                      target.src = "/placeholder-image.jpg";
                    }
                  }}
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-[#4F46E5] transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg text-sm bg-gray-100 dark:bg-[#232B3B] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <FolderGit2 className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(project.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-[#4F46E5] transition-colors"
                        title={t("projects.viewCode")}
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
                        title={t("projects.viewProject")}
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 dark:from-[#4F46E5]/10 dark:to-[#9333EA]/10 border border-gray-200 dark:border-gray-800 flex items-center justify-center">
              <Code2 className="w-10 h-10 text-blue-600 dark:text-[#4F46E5]" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {t("projects.noProjects")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
