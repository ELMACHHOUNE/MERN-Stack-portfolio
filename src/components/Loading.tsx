import React from "react";
import { useTranslation } from "react-i18next";

const Loading: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-400 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          {t("common.loading")}
        </p>
      </div>
    </div>
  );
};

export default Loading;
