import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { API_URL } from "../config";
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
  Sun,
  Moon,
  Settings,
  Globe,
} from "lucide-react";

interface NavbarProps {
  isAdmin?: boolean;
  onSidebarToggle?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isAdmin = false,
  onSidebarToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems = [
    { path: "/", label: t("navbar.menu.home"), icon: Home },
    { path: "/about", label: t("navbar.menu.about"), icon: User },
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
            {isAdmin && (
              <button
                onClick={onSidebarToggle}
                className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                <LayoutDashboard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </button>
            )}
            {!isAdmin && (
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
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary hover:text-blue-600 dark:hover:text-blue-400"
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
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg text-light-text-secondary hover:bg-light-bg-tertiary hover:text-blue-600 transition-colors dark:text-dark-text-secondary dark:hover:bg-dark-bg-tertiary light:text-light-text-secondary light:hover:bg-light-bg-tertiary light:hover:text-blue-600"
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
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary transition-colors"
              aria-label={t("navbar.theme.toggle")}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
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
                    {user.profileImage ? (
                      <img
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                        src={`${API_URL}${user.profileImage}`}
                        alt={user.name}
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700">
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
                            <Settings className="h-5 w-5 mr-3 text-gray-400 group-hover:text-blue-500 dark:text-gray-400 dark:group-hover:text-blue-400" />
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
                className="text-sm font-medium text-light-text-secondary hover:text-blue-600 transition-all duration-200 dark:text-dark-text-secondary dark:hover:text-blue-600 light:text-light-text-secondary light:hover:text-blue-600"
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
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary transition-colors"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
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
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary hover:text-blue-600 dark:hover:text-blue-400"
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
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium text-light-text-secondary hover:bg-light-bg-tertiary hover:text-blue-600 transition-colors dark:text-dark-text-secondary dark:hover:bg-dark-bg-tertiary light:text-light-text-secondary light:hover:bg-light-bg-tertiary light:hover:text-blue-600"
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
                    className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-base font-medium text-light-text-secondary hover:bg-light-bg-tertiary hover:text-blue-600 transition-colors dark:text-dark-text-secondary dark:hover:bg-dark-bg-tertiary light:text-light-text-secondary light:hover:bg-light-bg-tertiary light:hover:text-blue-600"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{t("navbar.profile.signOut")}</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium text-light-text-secondary hover:bg-light-bg-tertiary hover:text-blue-600 transition-colors dark:text-dark-text-secondary dark:hover:bg-dark-bg-tertiary light:text-light-text-secondary light:hover:bg-light-bg-tertiary light:hover:text-blue-600"
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
