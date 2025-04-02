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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-400"></div>
            <div className="absolute top-0 left-0 w-full h-full animate-pulse">
              <Sparkles className="w-6 h-6 text-blue-500 dark:text-blue-400 mx-auto" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg font-medium">
            Loading your skills...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <div className="relative">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <div className="absolute -top-2 -right-2">
              <Star className="h-6 w-6 text-yellow-400 animate-spin-slow" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRetry}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-all duration-200"
          >
            <RefreshCw className="h-5 w-5 mr-2 animate-spin-slow" />
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Filter out skills without categories
  const validSkills = skills.filter(
    (skill) => skill.category && skill.category._id
  );
  const validCategories = categories.filter((category) =>
    validSkills.some((skill) => skill.category._id === category._id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 mb-4">
            My Skills & Expertise
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A comprehensive showcase of my technical skills and areas of
            expertise
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {validCategories.map((category, index) => {
              const categorySkills = getSkillsByCategory(category._id);
              if (categorySkills.length === 0) return null;

              return (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          {category.icon ? (
                            <img
                              src={getImageUrl(category.icon)}
                              alt={category.name}
                              className="w-8 h-8 object-contain"
                              onError={handleImageError}
                            />
                          ) : (
                            <div className="text-blue-500 dark:text-blue-400">
                              {getDefaultIcon(category.name)}
                            </div>
                          )}
                        </div>
                        <div className="absolute -top-2 -right-2">
                          <Star className="h-6 w-6 text-yellow-400 animate-pulse" />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                          {category.name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {categorySkills.map((skill, skillIndex) => (
                        <motion.div
                          key={skill._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: skillIndex * 0.1,
                          }}
                          className="group/skill"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center group-hover/skill:scale-110 transition-transform duration-300">
                                {skill.icon ? (
                                  <img
                                    src={getImageUrl(skill.icon)}
                                    alt={skill.name}
                                    className="w-6 h-6 object-contain"
                                    onError={(e) => {
                                      console.log(
                                        "Image error for:",
                                        skill.icon
                                      );
                                      handleImageError(e);
                                    }}
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="text-gray-500 dark:text-gray-400">
                                    {getDefaultIcon(skill.name)}
                                  </div>
                                )}
                              </div>
                              <span className="text-gray-700 dark:text-gray-300 font-medium group-hover/skill:text-blue-500 dark:group-hover/skill:text-blue-400 transition-colors">
                                {skill.name}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              {skill.level * 10}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level * 10}%` }}
                              transition={{
                                duration: 1,
                                delay: 0.2 + skillIndex * 0.1,
                                ease: "easeOut",
                              }}
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Skills;
