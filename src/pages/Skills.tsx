import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Code,
  Box,
  Cpu,
  Globe,
  Shield,
  Layout,
  Terminal,
  Network,
  Cloud,
  GitBranch,
  Database as DatabaseIcon,
  Code2,
  Server as ServerIcon,
  Wrench as WrenchIcon,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";
import { trackPageView, trackSkillView } from "../services/analytics";
import { api } from "../utils/api";
import { toast } from "react-toastify";

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

  useEffect(() => {
    trackPageView("/skills");
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error("No categories data received");
      }

      setCategories(response.data as Category[]);
    } catch (err) {
      console.error("Error fetching categories:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch categories";
      toast.error(errorMessage);
    }
  };

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/skills");

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error("No skills data received");
      }

      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response format: expected an array of skills");
      }

      console.log("Received skills data:", response.data); // Debug log
      setSkills(response.data);
    } catch (err) {
      console.error("Error fetching skills:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while fetching skills";
      setError(errorMessage);
      toast.error(errorMessage);
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

  const getImageUrl = (url: string | null | undefined): string | undefined => {
    if (!url) return undefined;

    // If it's already a full URL (http/https), return as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // If it's a data URL, return as is
    if (url.startsWith("data:")) {
      return url;
    }

    // If it's a local path (starts with /uploads), prepend the base URL
    if (url.startsWith("/uploads")) {
      return `${import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")}${url}`;
    }

    // For any other case, return the URL as is
    return url;
  };

  // Add tracking when a skill is viewed
  const handleSkillView = (skillId: string) => {
    trackSkillView(skillId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0B1121] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <span className="ml-4 text-gray-600 dark:text-gray-400">
          {t("skills.loading")}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0B1121] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {t("skills.error")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1121] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA] mb-4">
            {t("skills.title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("skills.description")}
          </p>
        </div>

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
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="group"
                >
                  <div className="bg-gray-50 dark:bg-[#1B2333] rounded-2xl p-8 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 shadow-sm dark:shadow-none">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-gradient-to-br from-blue-600/10 to-purple-600/10 dark:from-[#4F46E5]/10 dark:to-[#9333EA]/10 rounded-xl border border-gray-200 dark:border-gray-800 group-hover:border-gray-300 dark:group-hover:border-gray-700 transition-colors">
                        {category.icon ? (
                          <img
                            src={getImageUrl(category.icon)}
                            alt={category.name}
                            className="w-8 h-8"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (
                                target.src !==
                                `${window.location.origin}/placeholder-image.jpg`
                              ) {
                                target.src = "/placeholder-image.jpg";
                                target.style.display = "none";
                                const parent = target.parentElement;
                                if (parent) {
                                  const fallbackIcon =
                                    document.createElement("div");
                                  fallbackIcon.className =
                                    "w-8 h-8 text-blue-600 group-hover:text-purple-600 dark:text-[#4F46E5] dark:group-hover:text-[#9333EA] transition-colors";
                                  const icon = getDefaultIcon(category.name);
                                  if (React.isValidElement(icon)) {
                                    parent.appendChild(fallbackIcon);
                                  }
                                }
                              }
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 text-blue-600 group-hover:text-purple-600 dark:text-[#4F46E5] dark:group-hover:text-[#9333EA] transition-colors">
                            {getDefaultIcon(category.name)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#4F46E5] transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {categorySkills
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((skill) => (
                          <div
                            key={skill._id}
                            className="group/skill"
                            onClick={() => handleSkillView(skill._id)}
                          >
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 mr-3 flex-shrink-0">
                                {skill.icon ? (
                                  <img
                                    src={getImageUrl(skill.icon)}
                                    alt={skill.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      if (
                                        target.src !==
                                        `${window.location.origin}/placeholder-image.jpg`
                                      ) {
                                        target.src = "/placeholder-image.jpg";
                                        target.style.display = "none";
                                        const parent = target.parentElement;
                                        if (parent) {
                                          const fallbackIcon =
                                            document.createElement("div");
                                          fallbackIcon.className =
                                            "w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400";
                                          const categoryName =
                                            skill.category?.name || "";
                                          const icon =
                                            getDefaultIcon(categoryName);
                                          if (React.isValidElement(icon)) {
                                            parent.appendChild(fallbackIcon);
                                            // Render the icon into the fallback div
                                            const iconContainer =
                                              document.createElement("div");
                                            iconContainer.className = "w-8 h-8";
                                            fallbackIcon.appendChild(
                                              iconContainer
                                            );
                                          }
                                        }
                                      }
                                    }}
                                  />
                                ) : (
                                  <div className="text-gray-500 dark:text-gray-400">
                                    {getDefaultIcon(skill.category?.name || "")}
                                  </div>
                                )}
                              </div>
                              <div className="flex-grow">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {skill.name}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {skill.level * 10}%
                                  </span>
                                </div>
                                <div className="mt-1 h-2 relative bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <motion.div
                                    className="absolute top-0 left-0 h-full bg-blue-500 dark:bg-blue-400"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${skill.level * 10}%` }}
                                    transition={{
                                      duration: 1,
                                      ease: "easeOut",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>

        {categories.filter((category) => category.isActive).length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-400 mt-16">
            <div className="mx-auto w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 dark:from-[#4F46E5]/10 dark:to-[#9333EA]/10 border border-gray-200 dark:border-gray-800 flex items-center justify-center">
              <Code className="w-10 h-10 text-blue-600 dark:text-[#4F46E5]" />
            </div>
            <p className="text-lg">{t("skills.noSkills")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills;
