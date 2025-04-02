import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { Globe } from "lucide-react";

const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={`${t("language.switchTo")} ${
        language === "en" ? t("language.french") : t("language.english")
      }`}
    >
      <Globe className="w-5 h-5" />
      <span className="text-sm font-medium">{language.toUpperCase()}</span>
    </button>
  );
};

export default LanguageToggle;
