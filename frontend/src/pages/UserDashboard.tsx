import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Removed unused UserProfile interface after light-only simplification

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  // Removed unused state hooks from previous implementation
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {t("user.dashboard")}
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>{t("user.logout")}</span>
          </button>
        </div>

        <div className="rounded-lg shadow-lg p-6 bg-white">
          <div className="flex items-center space-x-4 mb-6">
            {user.profileImage ? (
              <img
                src={`${import.meta.env.VITE_API_URL}${user.profileImage}`}
                alt={user.name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full flex items-center justify-center bg-gray-100">
                <User className="h-8 w-8 text-gray-600" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user.name}
              </h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium mb-2 text-gray-900">
                {t("user.profile.title")}
              </h3>
              <p className="text-gray-600">{t("user.profile.description")}</p>
            </div>

            <div className="p-6 rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium mb-2 text-gray-900">
                {t("user.security.title")}
              </h3>
              <p className="text-gray-600">{t("user.security.description")}</p>
            </div>

            <div className="p-6 rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium mb-2 text-gray-900">
                {t("user.notifications.title")}
              </h3>
              <p className="text-gray-600">
                {t("user.notifications.description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
