import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconCode,
  IconServer,
  IconDatabase,
  IconTools,
  IconRefresh,
  IconAlertCircle,
} from "@tabler/icons-react";

interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
  icon: string;
  order: number;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: React.FC<{ className?: string }>;
  description: string;
}

const categories: Category[] = [
  {
    id: "frontend",
    name: "Frontend Development",
    icon: IconCode,
    description: "Building responsive and interactive user interfaces",
  },
  {
    id: "backend",
    name: "Backend Development",
    icon: IconServer,
    description: "Creating robust server-side applications",
  },
  {
    id: "database",
    name: "Database Management",
    icon: IconDatabase,
    description: "Designing and optimizing database systems",
  },
  {
    id: "devops",
    name: "DevOps & Cloud",
    icon: IconTools,
    description: "Implementing CI/CD and cloud infrastructure",
  },
];

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:5000/api/skills", {
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
    fetchSkills();
  }, [retryCount]);

  const getSkillsByCategory = (category: string) => {
    const filteredSkills = skills.filter(
      (skill) => skill.category === category && skill.isActive
    );
    console.log(`Skills for category ${category}:`, filteredSkills);
    return filteredSkills;
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Skills & Expertise
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and areas of
            expertise
          </p>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center justify-center space-x-4"
            >
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md flex items-center">
                <IconAlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
              <button
                onClick={handleRetry}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
              >
                <IconRefresh className="h-4 w-4 mr-2" />
                Retry
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence>
            {categories.map((category, index) => {
              const categorySkills = getSkillsByCategory(category.id);

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <category.icon className="h-8 w-8 text-blue-500 dark:text-blue-400 mr-3" />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {category.name}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {categorySkills.length > 0 ? (
                        categorySkills.map((skill) => (
                          <motion.div
                            key={skill._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-700 dark:text-gray-300 font-medium">
                                {skill.name}
                              </span>
                              <span className="text-gray-500 dark:text-gray-400">
                                {skill.level}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.level}%` }}
                                transition={{
                                  duration: 1,
                                  delay: 0.2,
                                  ease: "easeOut",
                                }}
                                className="bg-blue-500 dark:bg-blue-400 h-full rounded-full"
                              />
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-gray-500 dark:text-gray-400 text-center py-4"
                        >
                          No skills found in this category
                        </motion.p>
                      )}
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
