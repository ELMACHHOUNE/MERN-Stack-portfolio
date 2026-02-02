import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/admin", label: t("dashboardLayout.menu.overview"), icon: "📊" },
    {
      path: "/admin/projects",
      label: t("dashboardLayout.menu.projects"),
      icon: "🚀",
    },
    {
      path: "/admin/skills",
      label: t("dashboardLayout.menu.skills"),
      icon: "💡",
    },
    {
      path: "/admin/experience",
      label: t("dashboardLayout.menu.experience"),
      icon: "💼",
    },
    {
      path: "/admin/clients",
      label: "Clients",
      icon: "🤝",
    },
    {
      path: "/admin/theme",
      label: t("admin.tabs.theme"),
      icon: "🎨",
    },
    {
      path: "/admin/about",
      label: t("dashboardLayout.menu.about"),
      icon: "👤",
    },
  ];

  if (!user?.isAdmin) {
    return <div>{t("dashboardLayout.accessDenied")}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-800">
        <nav className="mt-5 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                isActive(item.path)
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-gray-800">
          <div className="flex items-center">
            <span className="text-gray-300">
              {t("dashboardLayout.welcome")} {user.name}
            </span>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            {t("dashboardLayout.logout")}
          </button>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
