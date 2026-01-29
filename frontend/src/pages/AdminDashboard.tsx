import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { Cog, Mail, BarChart3 } from "lucide-react";
import SkillsManager from "../components/admin/SkillsManager";
import ProjectManager from "../components/admin/ProjectManager";
import ExperienceManager from "../components/admin/ExperienceManager";
import CategoryManager from "../components/admin/CategoryManager";
import ContactManager from "../components/admin/ContactManager";
import AnalyticsManager from "../components/admin/AnalyticsManager";
import AdminSettings from "./AdminSettings";
import ClientsManager from "../components/admin/ClientsManager";

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname;
    if (path.includes("/skills")) return "skills";
    if (path.includes("/projects")) return "projects";
    if (path.includes("/experience")) return "experience";
    if (path.includes("/categories")) return "categories";
    if (path.includes("/clients")) return "clients";
    if (path.includes("/messages")) return "messages";
    if (path.includes("/analytics")) return "analytics";
    if (path.includes("/settings")) return "settings";
    return "skills";
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow"></header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
              {t("admin.tabs.skills")}
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`${
                activeTab === "projects"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {t("admin.tabs.projects")}
            </button>
            <button
              onClick={() => setActiveTab("experience")}
              className={`${
                activeTab === "experience"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {t("admin.tabs.experience")}
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`${
                activeTab === "categories"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {t("admin.tabs.categories")}
            </button>
            <button
              onClick={() => setActiveTab("clients")}
              className={`${
                activeTab === "clients"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Clients
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`${
                activeTab === "analytics"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {t("admin.tabs.analytics")}
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`${
                activeTab === "messages"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Mail className="w-4 h-4 mr-2" />
              {t("admin.tabs.messages")}
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`${
                activeTab === "settings"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Cog className="w-4 h-4 mr-2" />
              {t("admin.tabs.settings")}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          {activeTab === "skills" && <SkillsManager />}
          {activeTab === "projects" && <ProjectManager />}
          {activeTab === "experience" && <ExperienceManager />}
          {activeTab === "categories" && <CategoryManager />}
          {activeTab === "clients" && <ClientsManager />}
          {activeTab === "analytics" && <AnalyticsManager />}
          {activeTab === "messages" && <ContactManager />}
          {activeTab === "settings" && <AdminSettings />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
