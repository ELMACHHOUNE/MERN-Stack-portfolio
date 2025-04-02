import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
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
} from "lucide-react";
import SkillsManager from "./admin/SkillsManager";
import ExperienceManager from "./admin/ExperienceManager";
import CategoryManager from "../components/admin/CategoryManager";
import ProjectManager from "../components/admin/ProjectManager";
import ContactManager from "../components/admin/ContactManager";
import { useTheme } from "../context/ThemeContext";
import { useAdminProfile } from "../context/AdminProfileContext";

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
  const { isDarkMode } = useTheme();
  const { adminProfile } = useAdminProfile();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-white shadow-lg"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
          <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
        </div>
        <nav className="mt-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center w-full px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
              activeTab === "overview" ? "bg-blue-50 text-blue-600" : ""
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center w-full px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
              activeTab === "users" ? "bg-blue-50 text-blue-600" : ""
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            Users
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`flex items-center w-full px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
              activeTab === "skills" ? "bg-blue-50 text-blue-600" : ""
            }`}
          >
            <Wrench className="w-5 h-5 mr-3" />
            Skills
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center w-full px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
              activeTab === "categories" ? "bg-blue-50 text-blue-600" : ""
            }`}
          >
            <FolderKanban className="w-5 h-5 mr-3" />
            Categories
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center w-full px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
              activeTab === "projects" ? "bg-blue-50 text-blue-600" : ""
            }`}
          >
            <User className="w-5 h-5 mr-3" />
            Projects
          </button>
          <button
            onClick={() => setActiveTab("experience")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === "experience"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Settings className="w-5 h-5" />
            Experience
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center w-full px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
              activeTab === "analytics" ? "bg-blue-50 text-blue-600" : ""
            }`}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex items-center w-full px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
              activeTab === "messages" ? "bg-blue-50 text-blue-600" : ""
            }`}
          >
            <Mail className="w-5 h-5 mr-3" />
            Messages
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center w-full px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
              activeTab === "settings" ? "bg-blue-50 text-blue-600" : ""
            }`}
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-6 py-3 text-red-600 hover:bg-red-50 mt-4"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </nav>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 p-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Total Users
              </h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {users.length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Admin Users
              </h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {users.filter((u) => u.isAdmin).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Regular Users
              </h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {users.filter((u) => !u.isAdmin).length}
              </p>
            </div>
          </div>

          {activeTab === "users" && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  User Management
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Login
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.isAdmin
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {user.isAdmin ? "Admin" : "User"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <SkillsManager />
              </div>
            </div>
          )}

          {activeTab === "categories" && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <CategoryManager />
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <ProjectManager />
              </div>
            </div>
          )}

          {activeTab === "experience" && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <ExperienceManager />
              </div>
            </div>
          )}

          {activeTab === "overview" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Dashboard Overview
              </h2>
              <p className="text-gray-600">
                Welcome to your admin dashboard. Here you can manage users,
                skills, view analytics, and configure your application settings.
              </p>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Analytics
              </h2>
              <p className="text-gray-600">Analytics features coming soon...</p>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <ContactManager />
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Settings
              </h2>
              <p className="text-gray-600">
                Application settings features coming soon...
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
