import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import Navbar from "./Navbar";
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
} from "lucide-react";
import SkillsManager from "./admin/SkillsManager";
import ExperienceManager from "./admin/ExperienceManager";
import CategoryManager from "./admin/CategoryManager";
import ProjectManager from "./admin/ProjectManager";
import ContactManager from "./admin/ContactManager";
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
    if (path.includes("/skills")) return "skills";
    if (path.includes("/categories")) return "categories";
    if (path.includes("/projects")) return "projects";
    if (path.includes("/experience")) return "experience";
    if (path.includes("/analytics")) return "analytics";
    if (path.includes("/messages")) return "messages";
    if (path.includes("/settings")) return "settings";
    return "";
  });

  const navItems = [
    { path: "/", label: t("navbar.menu.home") },
    { path: "/about", label: t("navbar.menu.about") },
    { path: "/projects", label: t("navbar.menu.projects") },
    { path: "/experience", label: t("navbar.menu.experience") },
    { path: "/skills", label: t("navbar.menu.skills") },
    { path: "/contact", label: t("navbar.menu.contact") },
  ];

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

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // For large screens, always show sidebar
        setIsSidebarOpen(true);
      } else {
        // For small screens, hide sidebar by default
        setIsSidebarOpen(false);
      }
    };

    // Initial call
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1121]">
      <Navbar isAdmin onSidebarToggle={handleSidebarToggle} />

      <div className="flex pt-16">
        {/* Sidebar with overlay on mobile */}
        <>
          {/* Backdrop overlay for mobile - only shown when sidebar is open */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-64px)] ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Navigation Links */}
              <nav className="flex-1 px-4 py-4 space-y-1">
                {[
                  {
                    label: t("admin.tabs.skills"),
                    icon: <Wrench className="w-5 h-5" />,
                    tab: "skills",
                  },
                  {
                    label: t("admin.tabs.projects"),
                    icon: <FolderKanban className="w-5 h-5" />,
                    tab: "projects",
                  },
                  {
                    label: t("admin.tabs.experience"),
                    icon: <Briefcase className="w-5 h-5" />,
                    tab: "experience",
                  },
                  {
                    label: t("admin.tabs.categories"),
                    icon: <Users className="w-5 h-5" />,
                    tab: "categories",
                  },
                  {
                    label: t("admin.tabs.users"),
                    icon: <User className="w-5 h-5" />,
                    tab: "users",
                  },
                  {
                    label: t("admin.tabs.analytics"),
                    icon: <BarChart3 className="w-5 h-5" />,
                    tab: "analytics",
                  },
                  {
                    label: t("admin.tabs.messages"),
                    icon: <Mail className="w-5 h-5" />,
                    tab: "messages",
                  },
                  {
                    label: t("admin.tabs.settings"),
                    icon: <Settings className="w-5 h-5" />,
                    tab: "settings",
                  },
                ].map(({ label, icon, tab }) => (
                  <button
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                    className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    <span
                      className={`mr-3 ${
                        activeTab === tab
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      }`}
                    >
                      {icon}
                    </span>
                    {label}
                  </button>
                ))}
              </nav>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all duration-200"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  {t("admin.logout")}
                </button>
              </div>
            </div>
          </div>
        </>

        {/* Main Content with extra padding on mobile when sidebar is open */}
        <div
          className={`flex-1 lg:ml-64 p-6 ${isSidebarOpen ? "md:ml-64" : ""}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "skills" && <SkillsManager />}
              {activeTab === "projects" && <ProjectManager />}
              {activeTab === "experience" && <ExperienceManager />}
              {activeTab === "categories" && <CategoryManager />}
              {activeTab === "analytics" && <AnalyticsManager />}
              {activeTab === "messages" && <ContactManager />}
              {activeTab === "settings" && <AdminSettings />}
              {activeTab === "users" && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {t("admin.users.title")}
                    </h2>
                  </div>
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              {t("admin.users.name")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              {t("admin.users.email")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              {t("admin.users.role")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              {t("admin.users.lastLogin")}
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              {t("admin.users.actions")}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {users.length > 0 ? (
                            users.map((user) => (
                              <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                  {user.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {user.isAdmin
                                    ? t("admin.users.admin")
                                    : t("admin.users.user")}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(user.lastLogin).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={() => handleEditUser(user)}
                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                                  >
                                    {t("admin.users.edit")}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(user._id)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  >
                                    {t("admin.users.delete")}
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={5}
                                className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                              >
                                {t("admin.users.noUsers")}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
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
