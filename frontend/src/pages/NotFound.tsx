import React from "react";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const NotFound: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-500 dark:text-blue-400">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4">
          {t("notFound.title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-md mx-auto">
          {t("notFound.description")}
        </p>
        <button
          onClick={handleBackToHome}
          className="inline-flex items-center px-6 py-3 mt-8 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Home className="h-5 w-5 mr-2" />
          {t("notFound.backToHome")}
        </button>
      </div>
    </div>
  );
};

export default NotFound;
