import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { trackPageView } from "../services/analytics";
import { api } from "../utils/api";

interface ExperienceItem {
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
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExperiences = useCallback(async () => {
    try {
      const response = await api.get<ExperienceItem[]>("/experience");
      if (response.error) {
        throw new Error(response.error);
      }
      setExperiences(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("experience.error"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  useEffect(() => {
    trackPageView("/experience");
  }, []);

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
        <span className="ml-4 text-body-var">{t("experience.loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{t("experience.error")}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 btn-brand"
          >
            {t("experience.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent brand-gradient mb-4">
            {t("experience.title")}
          </h1>
          <p className="text-lg text-body-var max-w-2xl mx-auto">
            {t("experience.description")}
          </p>
        </div>

        {/* Experience Timeline */}
        <div className="relative pl-8 ml-8 md:ml-0">
          {/* Timeline Line */}
          <div
            className="absolute left-0 top-0 h-full w-1 rounded-full"
            style={{
              background:
                "linear-gradient(to bottom, var(--brand-primary), var(--brand-secondary))",
              opacity: 0.5,
            }}
          ></div>

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
                <div
                  className="absolute -left-[37px] w-4 h-4 rounded-full transform -translate-y-1/2"
                  style={{
                    background:
                      "linear-gradient(to right, var(--brand-primary), var(--brand-secondary))",
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full animate-ping opacity-20"
                    style={{
                      background:
                        "linear-gradient(to right, var(--brand-primary), var(--brand-secondary))",
                    }}
                  ></div>
                </div>

                {/* Experience Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  className="card card-hover group"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-xl border border-gray-200 group-hover:border-gray-300 transition-colors">
                        <Briefcase className="h-8 w-8 text-brand transition-colors" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-heading-1 mb-2 group-hover:text-brand transition-colors">
                        {experience.position}
                      </h3>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-body-var">
                        <p className="text-lg font-medium">
                          {experience.company}
                        </p>
                        <div className="hidden md:block text-body-var">•</div>
                        <div className="flex items-center text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="text-sm">
                            {new Date(
                              experience.startDate,
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {experience.current
                              ? "Present"
                              : new Date(
                                  experience.endDate,
                                ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-body-var mb-6 leading-relaxed">
                    {experience.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {experience.technologies?.map((tech) => (
                      <span
                        key={tech}
                        className="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors"
                        style={{ borderColor: "var(--brand-primary)" }}
                      >
                        <span className="text-brand">{tech}</span>
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
        </div>

        {experiences.filter((exp) => exp.isActive).length === 0 && (
          <div className="text-center text-body-var mt-16">
            <div className="mx-auto w-20 h-20 mb-6 rounded-2xl border border-gray-200 flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-brand" />
            </div>
            <p className="text-lg">{t("experience.noExperiences")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Experience;
