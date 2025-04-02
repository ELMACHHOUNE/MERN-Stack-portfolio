import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Server,
  Database,
  Wrench,
  RefreshCw,
  AlertCircle,
  Star,
  Sparkles,
  Box,
  Cpu,
  Globe,
  Shield,
  Layout,
  Terminal,
  Network,
  Cloud,
  Settings,
  GitBranch,
  Database as DatabaseIcon,
  Code2,
  Server as ServerIcon,
  Wrench as WrenchIcon,
} from "lucide-react";
import { API_URL } from "../config";
import { useLanguage } from "../context/LanguageContext";

interface Skill {
  _id: string;
  name: string;
  category: {
    _id: string;
    name: string;
    description: string;
    icon: string;
  };
  level: number;
  icon: string;
  order: number;
  isActive: boolean;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
}

const getDefaultIcon = (categoryName: string) => {
  const icons: { [key: string]: React.ReactNode } = {
    "Frontend Development": <Layout className="w-8 h-8" />,
    "Backend Development": <ServerIcon className="w-8 h-8" />,
    Database: <DatabaseIcon className="w-8 h-8" />,
    DevOps: <WrenchIcon className="w-8 h-8" />,
    "Programming Languages": <Code2 className="w-8 h-8" />,
    "Web Development": <Globe className="w-8 h-8" />,
    Security: <Shield className="w-8 h-8" />,
    Cloud: <Cloud className="w-8 h-8" />,
    "Version Control": <GitBranch className="w-8 h-8" />,
    Networking: <Network className="w-8 h-8" />,
    "System Administration": <Terminal className="w-8 h-8" />,
    Other: <Box className="w-8 h-8" />,
  };

  return icons[categoryName] || <Cpu className="w-8 h-8" />;
};

const Skills: React.FC = () => {
  const { t } = useLanguage();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received categories data:", data);
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/skills`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to fetch skills: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Received skills data:", data);
      console.log("Sample skill icon:", data[0]?.icon);

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format: expected an array of skills");
      }

      setSkills(data);
    } catch (err) {
      console.error("Error fetching skills:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while fetching skills"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSkills();
  }, []);

  const getSkillsByCategory = (categoryId: string) => {
    return skills.filter(
      (skill) => skill.category && skill.category._id === categoryId
    );
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    fetchSkills();
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.style.display = "none";
    const parent = target.parentElement;
    if (parent) {
      // Add a fallback icon
      const fallbackIcon = document.createElement("div");
      fallbackIcon.className = "text-gray-500 dark:text-gray-400";
      const categoryName = target.alt;
      const defaultIcon = getDefaultIcon(categoryName);
      if (defaultIcon && defaultIcon.props && defaultIcon.props.children) {
        fallbackIcon.innerHTML = defaultIcon.props.children;
      } else {
        fallbackIcon.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>';
      }
      parent.appendChild(fallbackIcon);
    }
  };

  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return null;

    // If it's a base64 image, return it as is
    if (url.startsWith("data:image")) {
      return url;
    }

    // If it's already a full URL (http or https), return it as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // For any local images (including skill icons)
    return `${API_URL}/uploads/${url}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
        <span className="ml-4 text-gray-600 dark:text-gray-400">
          {t("skills.loading")}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {t("skills.error")}
          </p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            {t("skills.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("skills.title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t("skills.description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories
            .filter((category) => category.isActive)
            .sort((a, b) => a.order - b.order)
            .map((category) => {
              const categorySkills = getSkillsByCategory(category._id);
              if (categorySkills.length === 0) return null;

              return (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
                >
                  <div className="flex items-center mb-4">
                    {getDefaultIcon(category.name)}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white ml-3">
                      {t(
                        `skills.categories.${category.name
                          .toLowerCase()
                          .replace(/\s+/g, "")}`
                      )}
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {category.description}
                  </p>
                  <div className="space-y-4">
                    {categorySkills.map((skill) => (
                      <div
                        key={skill._id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          {skill.icon ? (
                            <img
                              src={getImageUrl(skill.icon)}
                              alt={skill.name}
                              className="w-6 h-6 mr-3"
                              onError={handleImageError}
                            />
                          ) : (
                            <Star className="w-6 h-6 text-yellow-400 mr-3" />
                          )}
                          <span className="text-gray-700 dark:text-gray-300">
                            {skill.name}
                          </span>
                        </div>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <Star
                              key={level}
                              className={`w-4 h-4 ${
                                level <= skill.level
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
        </div>

        {categories.filter((category) => category.isActive).length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-400">
            {t("skills.noSkills")}
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills;
