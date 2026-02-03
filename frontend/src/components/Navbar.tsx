import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { API_URL } from "../utils/api";
import {
  Menu,
  X,
  Home,
  User,
  Briefcase,
  Code,
  Mail,
  LayoutDashboard,
  LogOut,
  Settings,
  Globe,
} from "lucide-react";

interface NavbarProps {
  isAdmin?: boolean;
  onAdminMenuToggle?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isAdmin = false,
  onAdminMenuToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileImageKey, setProfileImageKey] = useState<number>(0);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen for profile image updates
  useEffect(() => {
    const handleProfileImageUpdate = (event: Event) => {
      const custom = event as CustomEvent;
      if ((custom.detail as any)?.profileImage) {
        setProfileImageKey((custom.detail as any).timestamp || Date.now());
      }
    };

    window.addEventListener("profileImageUpdated", handleProfileImageUpdate);

    return () => {
      window.removeEventListener(
        "profileImageUpdated",
        handleProfileImageUpdate,
      );
    };
  }, []);

  // Mobile menu is closed via nav item clicks; no global route-change effect needed

  const navItems = [
    { path: "/", label: t("navbar.menu.home"), icon: Home },
    { path: "/projects", label: t("navbar.menu.projects"), icon: Briefcase },
    {
      path: "/experience",
      label: t("navbar.menu.experience"),
      icon: Briefcase,
    },
    { path: "/skills", label: t("navbar.menu.skills"), icon: Code },
    { path: "/contact", label: t("navbar.menu.contact"), icon: Mail },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en");
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-dark-bg-secondary/95 backdrop-blur-lg shadow-lg border-b border-light-border-primary dark:border-dark-border-primary"
          : "bg-white dark:bg-dark-bg-secondary"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center">
            {isAdmin ? (
              // Mobile-only admin sidebar toggle button, top-left
              <button
                onClick={onAdminMenuToggle}
                className="md:hidden inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 bg-white shadow-sm text-sm hover:bg-gray-50"
                aria-label="Toggle admin sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            ) : (
              <Link
                to="/"
                className="flex items-center space-x-2 text-xl font-bold text-light-text-primary dark:text-dark-text-primary"
              >
                {/* Empty link to maintain layout */}
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "sidebar-active text-brand"
                      : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary hover-text-brand"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {user?.isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg text-light-text-secondary hover:bg-light-bg-tertiary transition-colors dark:text-dark-text-secondary dark:hover:bg-dark-bg-tertiary light:text-light-text-secondary light:hover:bg-light-bg-tertiary hover-text-brand"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>{t("navbar.menu.dashboard")}</span>
              </Link>
            )}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium">
                {language.toUpperCase()}
              </span>
            </button>
            {/* Theme toggle removed for light-only mode */}
            {user ? (
              <div className="flex items-center">
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition-all duration-200"
                  >
                    <span className="sr-only">
                      {t("navbar.profile.openMenu")}
                    </span>
                    {user?.profileImage ? (
                      <img
                        key={profileImageKey}
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                        src={`${API_URL.replace("/api", "")}${
                          user.profileImage
                        }?v=${profileImageKey}`}
                        alt={user.name}
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full brand-gradient flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </button>
                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="origin-top-right absolute right-0 mt-2 w-64 rounded-xl shadow-lg py-2 bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700"
                      >
                        <div className="px-4 py-4">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                            {user.email}
                          </p>
                        </div>
                        <div className="py-2">
                          <Link
                            to="/profile"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200 group"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <Settings className="h-5 w-5 mr-3 text-gray-400 group-hover:text-brand dark:text-gray-400 group-hover:text-brand" />
                            <div>
                              <p className="font-medium">
                                {t("navbar.profile.settings")}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {t("navbar.profile.manageAccount")}
                              </p>
                            </div>
                          </Link>
                          <button
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              handleLogout();
                            }}
                            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200 group"
                          >
                            <LogOut className="h-5 w-5 mr-3 text-gray-400 group-hover:text-red-500 dark:text-gray-400 dark:group-hover:text-red-400" />
                            <div>
                              <p className="font-medium">
                                {t("navbar.profile.signOut")}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {t("navbar.profile.signOutDesc")}
                              </p>
                            </div>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-light-text-secondary hover-text-brand transition-all duration-200 dark:text-dark-text-secondary"
              >
                {t("navbar.auth.login")}
              </Link>
            )}
          </div>

          {/* Mobile menu controls */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium">
                {language.toUpperCase()}
              </span>
            </button>
            {/* Theme toggle removed for light-only mode (mobile) */}
            {/* Navigation toggle button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-light-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary dark:hover:bg-dark-bg-tertiary light:text-light-text-secondary light:hover:bg-light-bg-tertiary transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white dark:bg-dark-bg-secondary shadow-lg border-t border-light-border-primary dark:border-dark-border-primary"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? "sidebar-active text-brand"
                      : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary hover-text-brand"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              {user?.isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium text-light-text-secondary hover:bg-light-bg-tertiary transition-colors dark:text-dark-text-secondary dark:hover:bg-dark-bg-tertiary light:text-light-text-secondary light:hover:bg-light-bg-tertiary hover-text-brand"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>{t("navbar.menu.dashboard")}</span>
                </Link>
              )}
              {user ? (
                <div className="space-y-1">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium text-light-text-secondary hover:bg-light-bg-tertiary hover:text-blue-600 transition-colors dark:text-dark-text-secondary dark:hover:bg-dark-bg-tertiary light:text-light-text-secondary light:hover:bg-light-bg-tertiary light:hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    <span>{t("navbar.profile.settings")}</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-base font-medium text-light-text-secondary hover:bg-light-bg-tertiary transition-colors dark:text-dark-text-secondary dark:hover:bg-dark-bg-tertiary light:text-light-text-secondary light:hover:bg-light-bg-tertiary hover-text-brand"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{t("navbar.profile.signOut")}</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium text-light-text-secondary hover:bg-light-bg-tertiary transition-colors dark:text-dark-text-secondary dark:hover:bg-dark-bg-tertiary light:text-light-text-secondary light:hover:bg-light-bg-tertiary hover-text-brand"
                  onClick={() => setIsOpen(false)}
                >
                  <span>{t("navbar.auth.login")}</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
