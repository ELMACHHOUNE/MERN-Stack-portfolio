import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";
import { API_URL } from "../config";
import { useLanguage } from "../context/LanguageContext";
import { trackPageView } from "../services/analytics";

interface Experience {
  _id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  technologies: string[];
  order: number;
  isActive: boolean;
}

const Experience: React.FC = () => {
  const { t } = useLanguage();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch(`${API_URL}/api/experience`);
        if (!response.ok) {
          throw new Error("Failed to fetch experiences");
        }
        const data = await response.json();
        setExperiences(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("experience.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [t]);

  useEffect(() => {
    trackPageView("/experience");
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0B1121] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <span className="ml-4 text-gray-600 dark:text-gray-400">
          {t("experience.loading")}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0B1121] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {t("experience.error")}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            {t("experience.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1121] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA] mb-4">
            {t("experience.title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("experience.description")}
          </p>
        </div>

        {/* Experience Timeline */}
        <div className="relative pl-8 ml-8 md:ml-0">
          {/* Timeline Line */}
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-600/50 to-purple-600/50 dark:from-[#4F46E5]/50 dark:to-[#9333EA]/50 rounded-full"></div>

          {/* Experience Items */}
          {experiences
            .filter((exp) => exp.isActive)
            .sort((a, b) => b.order - a.order)
            .map((experience, index) => (
              <motion.div
                key={experience._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative mb-12 last:mb-0"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[37px] w-4 h-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA] transform -translate-y-1/2">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA] animate-ping opacity-20"></div>
                </div>

                {/* Experience Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  className="bg-gray-50 dark:bg-[#1B2333] rounded-2xl p-8 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 shadow-sm dark:shadow-none group"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-gradient-to-br from-blue-600/10 to-purple-600/10 dark:from-[#4F46E5]/10 dark:to-[#9333EA]/10 rounded-xl border border-gray-200 dark:border-gray-800 group-hover:border-gray-300 dark:group-hover:border-gray-700 transition-colors">
                        <Briefcase className="h-8 w-8 text-blue-600 group-hover:text-purple-600 dark:text-[#4F46E5] dark:group-hover:text-[#9333EA] transition-colors" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-[#4F46E5] transition-colors">
                        {experience.position}
                      </h3>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-gray-600 dark:text-gray-400">
                        <p className="text-lg font-medium">
                          {experience.company}
                        </p>
                        <div className="hidden md:block text-gray-400 dark:text-gray-600">
                          •
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="text-sm">
                            {new Date(
                              experience.startDate
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {experience.current
                              ? "Present"
                              : new Date(
                                  experience.endDate
                                ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {experience.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {experience.technologies?.map((tech) => (
                      <span
                        key={tech}
                        className="px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-[#4F46E5]/10 dark:to-[#9333EA]/10 text-blue-600 dark:text-[#4F46E5] border border-blue-500/20 dark:border-[#4F46E5]/20 hover:border-blue-400/30 dark:hover:border-[#4F46E5]/30 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
        </div>

        {experiences.filter((exp) => exp.isActive).length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-400 mt-16">
            <div className="mx-auto w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 dark:from-[#4F46E5]/10 dark:to-[#9333EA]/10 border border-gray-200 dark:border-gray-800 flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-blue-600 dark:text-[#4F46E5]" />
            </div>
            <p className="text-lg">{t("experience.noExperiences")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Experience;
