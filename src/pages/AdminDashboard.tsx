import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useAdminProfile } from "../context/AdminProfileContext";
import { User, Settings, FolderTree } from "lucide-react";
import SkillsManager from "../components/admin/SkillsManager";
import ProjectManager from "../components/admin/ProjectManager";
import ExperienceManager from "../components/admin/ExperienceManager";
import CategoryManager from "../components/admin/CategoryManager";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { adminProfile } = useAdminProfile();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname;
    if (path.includes("/skills")) return "skills";
    if (path.includes("/projects")) return "projects";
    if (path.includes("/experience")) return "experience";
    if (path.includes("/categories")) return "categories";
    return "skills";
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("skills")}
              className={`${
                activeTab === "skills"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Skills
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`${
                activeTab === "projects"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab("experience")}
              className={`${
                activeTab === "experience"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Experience
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`${
                activeTab === "categories"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Categories
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          {activeTab === "skills" && <SkillsManager />}
          {activeTab === "projects" && <ProjectManager />}
          {activeTab === "experience" && <ExperienceManager />}
          {activeTab === "categories" && <CategoryManager />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
