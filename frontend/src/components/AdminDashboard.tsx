import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import Navbar from "./Navbar";
import {
  Users,
  Mail,
  Settings,
  LogOut,
  BarChart3,
  Wrench,
  Briefcase,
  FolderKanban,
  User as UserIcon,
  Palette,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import SkillsManager from "./admin/SkillsManager";
import ExperienceManager from "./admin/ExperienceManager";
import CategoryManager from "./admin/CategoryManager";
import ProjectManager from "./admin/ProjectManager";
import ContactManager from "./admin/ContactManager";
import AnalyticsManager from "./admin/AnalyticsManager";
import AdminSettings from "../pages/AdminSettings";
import ClientsManager from "./admin/ClientsManager";
import ThemeManager from "./admin/ThemeManager";
import { toast } from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import Loading from "./Loading";

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
  onSave: (_userData: Partial<User>) => Promise<void>;
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
  const { preset } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // mobile slide-in/out
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // desktop collapsed (icons-only)
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname;
    if (path.includes("/skills")) return "skills";
    if (path.includes("/categories")) return "categories";
    if (path.includes("/projects")) return "projects";
    if (path.includes("/experience")) return "experience";
    if (path.includes("/analytics")) return "analytics";
    if (path.includes("/messages")) return "messages";
    if (path.includes("/settings")) return "settings";
    if (path.includes("/users")) return "users";
    if (path.includes("/clients")) return "clients";
    // Default to skills on base /admin for immediate content on mobile
    return "skills";
  });

  // Keep active tab synced with location changes
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/skills")) setActiveTab("skills");
    else if (path.includes("/categories")) setActiveTab("categories");
    else if (path.includes("/projects")) setActiveTab("projects");
    else if (path.includes("/experience")) setActiveTab("experience");
    else if (path.includes("/analytics")) setActiveTab("analytics");
    else if (path.includes("/messages")) setActiveTab("messages");
    else if (path.includes("/settings")) setActiveTab("settings");
    else if (path.includes("/users")) setActiveTab("users");
    else if (path.includes("/clients")) setActiveTab("clients");
    else if (path.includes("/theme")) setActiveTab("theme");
    else setActiveTab("skills");
  }, [location.pathname]);

  // Fetch users list (stable across renders)
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
  }, [token, t]);

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
  }, [user, navigate, activeTab, fetchUsers]);

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
        `${import.meta.env.VITE_API_URL}/auth/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
        `${import.meta.env.VITE_API_URL}/auth/admin/users/${editingUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        },
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
    // On desktop, toggle collapsed (icons-only vs expanded). On mobile, toggle open/closed.
    if (window.innerWidth >= 1024) {
      setIsSidebarCollapsed((prev) => !prev);
      // Ensure sidebar is shown on desktop even if previously closed
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // For large screens, show sidebar (expanded/collapsed controlled separately)
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
    return <Loading />;
  }

  return (
    <div
      className={`${preset === "professional" ? "dark" : ""} min-h-screen`}
      style={{
        background:
          preset === "girls"
            ? "radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #ec4899 100%)"
            : preset === "boys"
              ? "radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #3b82f6 100%)"
              : preset === "professional"
                ? "radial-gradient(125% 125% at 50% 90%, #000000 40%, #0d1a36 100%)"
                : "radial-gradient(125% 125% at 50% 10%, #ffffff 40%, var(--brand-primary) 100%)",
      }}
    >
      <Navbar
        isAdmin
        onAdminMenuToggle={() => setIsSidebarOpen((prev) => !prev)}
      />

      <div className="flex pt-16">
        {/* Sidebar with overlay on mobile and collapse on desktop */}
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
            className={`fixed top-16 bottom-0 left-0 z-50 transform transition-transform duration-300 ease-in-out sidebar-bg border-r border-gray-200 dark:border-gray-800
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
              lg:translate-x-0
              ${isSidebarCollapsed ? "lg:w-20" : "lg:w-64"}
              w-64`}
          >
            <div className="flex flex-col h-full">
              {/* Sidebar Header with internal toggle */}
              <div
                className={`sticky top-0 z-10 p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between sidebar-bg`}
              >
                {!isSidebarCollapsed && (
                  <span className="font-semibold sidebar-text">Admin</span>
                )}
                <button
                  onClick={handleSidebarToggle}
                  className={`p-2 rounded-lg sidebar-hover transition-colors sidebar-text`}
                  title={
                    isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
                  }
                  aria-label={
                    isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
                  }
                  aria-expanded={!isSidebarCollapsed}
                >
                  {isSidebarCollapsed ? (
                    <ChevronRight className="w-5 h-5" />
                  ) : (
                    <ChevronLeft className="w-5 h-5" />
                  )}
                </button>
              </div>
              {/* Navigation Links */}
              <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto overflow-x-hidden pr-2 scrollbar-themed">
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
                    icon: <UserIcon className="w-5 h-5" />,
                    tab: "users",
                  },
                  {
                    label: "Clients",
                    icon: <Users className="w-5 h-5" />,
                    tab: "clients",
                  },
                  {
                    label: t("admin.tabs.theme"),
                    icon: <Palette className="w-5 h-5" />,
                    tab: "theme",
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
                    className={`flex w-full rounded-xl transition-all duration-200 sidebar-text sidebar-hover ${
                      isSidebarCollapsed
                        ? "justify-center px-3 py-3"
                        : "items-center justify-start px-4 py-3"
                    } ${activeTab === tab ? "sidebar-active" : ""}`}
                    aria-current={activeTab === tab ? "page" : undefined}
                  >
                    <span
                      className={`${
                        isSidebarCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3"
                      } flex items-center justify-center`}
                    >
                      {icon}
                    </span>
                    {!isSidebarCollapsed && (
                      <span className="truncate">{label}</span>
                    )}
                  </button>
                ))}
              </nav>

              {/* Sidebar Footer */}
              <div
                className={`mt-auto p-4 border-t border-gray-200 dark:border-gray-800 sidebar-bg`}
              >
                <button
                  onClick={handleLogout}
                  className={`flex w-full rounded-xl transition-all duration-200 sidebar-hover sidebar-text ${
                    isSidebarCollapsed
                      ? "justify-center px-3 py-3"
                      : "items-center justify-start px-4 py-3"
                  }`}
                >
                  <LogOut
                    className={`${isSidebarCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3"}`}
                  />
                  {!isSidebarCollapsed && t("admin.logout")}
                </button>
              </div>
            </div>
          </div>
        </>

        {/* Main Content with extra padding on mobile when sidebar is open */}
        <div
          className={`flex-1 p-6 ${isSidebarOpen ? "md:ml-64" : ""} ${
            isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
          }`}
        >
          {/* Mobile header toggle moved into Navbar */}
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
              {activeTab === "clients" && <ClientsManager />}
              {activeTab === "theme" && <ThemeManager />}
              {activeTab === "users" && (
                <div className="card card-hover p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-heading-1">
                      {t("admin.users.title")}
                    </h2>
                  </div>
                  {loading ? (
                    <div className="h-64 flex items-center justify-center">
                      <Loading />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-body-var uppercase tracking-wider">
                              {t("admin.users.name")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-body-var uppercase tracking-wider">
                              {t("admin.users.email")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-body-var uppercase tracking-wider">
                              {t("admin.users.role")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-body-var uppercase tracking-wider">
                              {t("admin.users.lastLogin")}
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-body-var uppercase tracking-wider">
                              {t("admin.users.actions")}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {users.length > 0 ? (
                            users.map((user) => (
                              <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-heading-1">
                                  {user.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-body-var">
                                  {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-body-var">
                                  {user.isAdmin
                                    ? t("admin.users.admin")
                                    : t("admin.users.user")}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-body-var">
                                  {new Date(user.lastLogin).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={() => handleEditUser(user)}
                                    className="text-brand hover-text-brand mr-3"
                                  >
                                    {t("admin.users.edit")}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(user._id)}
                                    className="text-red-600 hover:text-red-700"
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
                                className="px-6 py-4 text-center text-sm text-body-var"
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
