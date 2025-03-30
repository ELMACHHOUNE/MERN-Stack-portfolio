import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { API_URL } from "../config";

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
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Work Experience
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A timeline of my professional journey and work experience
          </p>
        </motion.div>

        {/* Experience Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>

          {/* Experience Items */}
          <div className="space-y-8">
            {experiences
              .filter((exp) => exp.isActive)
              .sort((a, b) => b.order - a.order)
              .map((experience, index) => (
                <motion.div
                  key={experience._id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 dark:bg-blue-400 rounded-full"></div>

                  {/* Experience Card */}
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8" : "pl-8"}`}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                      <div className="flex items-center mb-4">
                        <Briefcase className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {experience.position}
                        </h3>
                      </div>
                      <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                        {experience.company}
                      </p>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                        <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <span>
                          {new Date(experience.startDate).toLocaleDateString()}{" "}
                          -{" "}
                          {experience.current
                            ? "Present"
                            : new Date(experience.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {experience.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {experience.technologies?.map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
