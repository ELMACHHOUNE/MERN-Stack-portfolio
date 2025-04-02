import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import {
  Users,
  Mail,
  Settings,
  LogOut,
  LayoutDashboard,
  BarChart3,
  Wrench,
  Briefcase,
  FolderKanban,
  User,
  Menu,
  X,
  Layout,
} from "lucide-react";
import SkillsManager from "./admin/SkillsManager";
import ExperienceManager from "./admin/ExperienceManager";
import CategoryManager from "../components/admin/CategoryManager";
import ProjectManager from "../components/admin/ProjectManager";
import ContactManager from "../components/admin/ContactManager";

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  lastLogin: string;
}

const AdminDashboard: React.FC = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname;
    if (path.includes("/skills")) return "skills";
    if (path.includes("/categories")) return "categories";
    if (path.includes("/projects")) return "projects";
    if (path.includes("/experience")) return "experience";
    if (path.includes("/messages")) return "messages";
    return "skills";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/admin/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, token, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Close sidebar on mobile when tab is clicked
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800 shadow-lg md:hidden"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 768) && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg z-40 overflow-y-auto md:relative md:translate-x-0"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {t("admin.dashboard")}
                </h2>
                <button
                  onClick={toggleSidebar}
                  className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {user?.email}
              </p>
            </div>
            <nav className="mt-6">
              <button
                onClick={() => handleTabClick("overview")}
                className={`flex items-center w-full px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 ${
                  activeTab === "overview"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : ""
                }`}
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                {t("admin.overview")}
              </button>
              <button
                onClick={() => handleTabClick("users")}
                className={`flex items-center w-full px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 ${
                  activeTab === "users"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : ""
                }`}
              >
                <Users className="w-5 h-5 mr-3" />
                {t("admin.users")}
              </button>
              <button
                onClick={() => handleTabClick("skills")}
                className={`flex items-center w-full px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 ${
                  activeTab === "skills"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : ""
                }`}
              >
                <Wrench className="w-5 h-5 mr-3" />
                {t("admin.skills")}
              </button>
              <button
                onClick={() => handleTabClick("categories")}
                className={`flex items-center w-full px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 ${
                  activeTab === "categories"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : ""
                }`}
              >
                <Layout className="w-5 h-5 mr-3" />
                {t("admin.categories")}
              </button>
              <button
                onClick={() => handleTabClick("projects")}
                className={`flex items-center w-full px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 ${
                  activeTab === "projects"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : ""
                }`}
              >
                <FolderKanban className="w-5 h-5 mr-3" />
                {t("admin.projects")}
              </button>
              <button
                onClick={() => handleTabClick("experience")}
                className={`flex items-center w-full px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 ${
                  activeTab === "experience"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : ""
                }`}
              >
                <Briefcase className="w-5 h-5 mr-3" />
                {t("admin.experience")}
              </button>
              <button
                onClick={() => handleTabClick("analytics")}
                className={`flex items-center w-full px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 ${
                  activeTab === "analytics"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : ""
                }`}
              >
                <BarChart3 className="w-5 h-5 mr-3" />
                {t("admin.analytics")}
              </button>
              <button
                onClick={() => handleTabClick("messages")}
                className={`flex items-center w-full px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 ${
                  activeTab === "messages"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : ""
                }`}
              >
                <Mail className="w-5 h-5 mr-3" />
                {t("admin.messages")}
              </button>
              <button
                onClick={() => handleTabClick("settings")}
                className={`flex items-center w-full px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 ${
                  activeTab === "settings"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : ""
                }`}
              >
                <Settings className="w-5 h-5 mr-3" />
                {t("admin.settings")}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-6 py-3 text-red-600 hover:bg-red-50 mt-4"
              >
                <LogOut className="w-5 h-5 mr-3" />
                {t("auth.logout")}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 p-4 md:p-8 overflow-x-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {t("admin.totalUsers")}
              </h3>
              <p className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                {users.length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {t("admin.adminUsers")}
              </h3>
              <p className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                {users.filter((u) => u.isAdmin).length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {t("admin.regularUsers")}
              </h3>
              <p className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                {users.filter((u) => !u.isAdmin).length}
              </p>
            </div>
          </div>

          {activeTab === "users" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-4 md:p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  {t("admin.userManagement")}
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t("admin.name")}
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t("auth.email")}
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t("admin.role")}
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          {t("admin.lastLogin")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.isAdmin
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                                  : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
                              }`}
                            >
                              {user.isAdmin
                                ? t("admin.admin")
                                : t("admin.user")}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(user.lastLogin).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-4 md:p-6">
                <SkillsManager />
              </div>
            </div>
          )}

          {activeTab === "categories" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-4 md:p-6">
                <CategoryManager />
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-4 md:p-6">
                <ProjectManager />
              </div>
            </div>
          )}

          {activeTab === "experience" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-4 md:p-6">
                <ExperienceManager />
              </div>
            </div>
          )}

          {activeTab === "overview" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                {t("admin.dashboard")} {t("admin.overview")}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t("admin.overviewDescription")}
              </p>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                {t("admin.analytics")}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t("admin.analyticsComingSoon")}
              </p>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-4 md:p-6">
                <ContactManager />
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                {t("admin.settings")}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t("admin.settingsComingSoon")}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
