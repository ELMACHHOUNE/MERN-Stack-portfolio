import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SkillsManager from "../components/SkillsManager";
import ProjectManager from "../components/ProjectManager";
import SettingsManager from "../components/SettingsManager";
import {
  IconLogout,
  IconSettings,
  IconCode,
  IconFolder,
} from "@tabler/icons-react";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("skills");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900"
          >
            <IconLogout className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("skills")}
                className={`${
                  activeTab === "skills"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm inline-flex items-center`}
              >
                <IconCode className="w-5 h-5 mr-2" />
                Skills
              </button>
              <button
                onClick={() => setActiveTab("projects")}
                className={`${
                  activeTab === "projects"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm inline-flex items-center`}
              >
                <IconFolder className="w-5 h-5 mr-2" />
                Projects
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`${
                  activeTab === "settings"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm inline-flex items-center`}
              >
                <IconSettings className="w-5 h-5 mr-2" />
                Settings
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "skills" && <SkillsManager />}
            {activeTab === "projects" && <ProjectManager />}
            {activeTab === "settings" && <SettingsManager />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
