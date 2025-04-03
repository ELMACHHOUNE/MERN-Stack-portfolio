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
  Pencil,
  Trash2,
} from "lucide-react";
import SkillsManager from "./admin/SkillsManager";
import ExperienceManager from "./admin/ExperienceManager";
import CategoryManager from "../components/admin/CategoryManager";
import ProjectManager from "../components/admin/ProjectManager";
import ContactManager from "../components/admin/ContactManager";
import AnalyticsManager from "./admin/AnalyticsManager";
import AdminSettings from "../pages/AdminSettings";
import { toast } from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  lastLogin: string;
}

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: Partial<User>) => Promise<void>;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const { t } = useLanguage();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({ name, email });
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {t("admin.editUser")}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("admin.name")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("auth.email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? t("common.saving") : t("common.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname;
    if (path.includes("/users")) return "users";
    if (path.includes("/skills")) return "skills";
    if (path.includes("/categories")) return "categories";
    if (path.includes("/projects")) return "projects";
    if (path.includes("/experience")) return "experience";
    if (path.includes("/analytics")) return "analytics";
    if (path.includes("/messages")) return "messages";
    if (path.includes("/settings")) return "settings";
    return "";
  });

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!user || !user.isAdmin) {
      console.log("User not authenticated or not admin, redirecting to login");
      navigate("/login");
      return;
    }

    // Set loading to false once we've checked authentication
    setLoading(false);

    // Fetch users if on users tab
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [user, navigate, activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/auth/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(t("admin.errors.fetchUsersFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTabClick = (tab: string) => {
    console.log("Tab clicked:", tab);
    setActiveTab(tab);
    setIsSidebarOpen(false); // Close sidebar on mobile when tab is clicked
    navigate(`/admin/${tab === "" ? "" : tab}`);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm(t("admin.confirmDeleteUser"))) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      toast.success(t("admin.userDeleteSuccess"));
      fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(t("admin.errors.deleteUserFailed"));
    }
  };

  const handleSaveUser = async (userData: Partial<User>) => {
    if (!editingUser) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/admin/users/${editingUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      toast.success(t("admin.userUpdateSuccess"));
      fetchUsers(); // Refresh the users list
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(t("admin.errors.updateUserFailed"));
    }
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
                  {t("admin.dashboard.title")}
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
                onClick={() => handleTabClick("")}
                className={`flex items-center w-full px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 ${
                  activeTab === ""
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : ""
                }`}
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                {t("admin.")}
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
                className="flex items-center w-full px-6 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-500"
              >
                <LogOut className="w-5 h-5 mr-3" />
                {t("auth.logout")}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 p-8 md:ml-64">
        {activeTab === "" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {t("admin.")}
            </h2>
            {/*  content */}
          </div>
        )}

        {activeTab === "users" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {t("admin.userManagement")}
            </h2>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {t("admin.name")}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {t("auth.email")}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {t("admin.lastLogin")}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {t("common.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(user.lastLogin).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex space-x-2">
                            {!user.isAdmin && (
                              <>
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  <Pencil className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {loading && (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
              {!loading && users.length === 0 && (
                <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                  {t("common.noResults")}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "skills" && <SkillsManager />}
        {activeTab === "categories" && <CategoryManager />}
        {activeTab === "projects" && <ProjectManager />}
        {activeTab === "experience" && <ExperienceManager />}
        {activeTab === "analytics" && <AnalyticsManager />}
        {activeTab === "messages" && <ContactManager />}
        {activeTab === "settings" && <AdminSettings />}
      </div>

      {/* Edit User Modal */}
      <EditUserModal
        user={editingUser}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default AdminDashboard;
