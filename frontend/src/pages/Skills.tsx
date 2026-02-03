import React, { useState, useEffect, useCallback } from "react";
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

  const fetchCategories = useCallback(async () => {
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
  }, []);

  const fetchSkills = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchSkills();
  }, [fetchCategories, fetchSkills]);

  const getSkillsByCategory = (categoryId: string) => {
    return skills.filter(
      (skill) => skill.category && skill.category._id === categoryId,
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{
            borderTopColor: "var(--brand-primary)",
            borderBottomColor: "var(--brand-secondary)",
          }}
        ></div>
        <span className="ml-4 text-body-var">{t("skills.loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{t("skills.error")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent brand-gradient mb-4">
            {t("skills.title")}
          </h1>
          <p className="text-lg text-body-var max-w-2xl mx-auto">
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
                  <div className="card card-hover">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 rounded-xl border border-gray-200 group-hover:border-gray-300 transition-colors">
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
                                // Fallback to default icon style
                              }
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 text-brand transition-colors">
                            {getDefaultIcon(category.name)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-heading-1 group-hover:text-brand transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-body-var text-sm mt-1">
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
                                        // Fallback handled by placeholder image
                                      }
                                    }}
                                  />
                                ) : (
                                  <div className="text-body-var">
                                    {getDefaultIcon(skill.category?.name || "")}
                                  </div>
                                )}
                              </div>
                              <div className="flex-grow">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-body-var">
                                    {skill.name}
                                  </span>
                                  <span className="text-xs text-body-var">
                                    {skill.level * 10}%
                                  </span>
                                </div>
                                <div className="mt-1 h-2 relative bg-gray-200 rounded-full overflow-hidden">
                                  <motion.div
                                    className="absolute top-0 left-0 h-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${skill.level * 10}%` }}
                                    transition={{
                                      duration: 1,
                                      ease: "easeOut",
                                    }}
                                    style={{
                                      background: "var(--brand-primary)",
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
          <div className="text-center text-body-var mt-16">
            <div className="mx-auto w-20 h-20 mb-6 rounded-2xl border border-gray-200 flex items-center justify-center">
              <Code className="w-10 h-10 text-brand" />
            </div>
            <p className="text-lg">{t("skills.noSkills")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills;
