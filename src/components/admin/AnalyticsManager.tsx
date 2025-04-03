import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Users, Eye, Mail, Download } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

interface AnalyticsData {
  uniqueVisitors: number;
  pageViews: number;
  contactSubmissions: number;
  resumeDownloads: number;
  topLocations: Array<{ country: string; count: number }>;
  topProjects: Array<{ title: string; views: number }>;
  topSkills: Array<{ name: string; views: number }>;
  timeSpent: {
    average: number;
    total: number;
  };
}

const AnalyticsManager: React.FC = () => {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "year">(
    "week"
  );
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("AnalyticsManager initialized", { token, timeRange });

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!token) {
        console.error("No token available");
        setError("Authentication required");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching analytics with token:", token);
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/analytics?timeRange=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Analytics data received:", response.data);
        setAnalyticsData(response.data);
        setError(null);
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch analytics data";
        console.error("Error fetching analytics:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange, token]);

  if (loading) {
    console.log("Loading state");
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    console.log("Error state:", error);
    return (
      <div className="text-red-500 text-center p-4">
        <p className="font-semibold mb-2">Error loading analytics</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!analyticsData) {
    console.log("No analytics data");
    return (
      <div className="text-gray-500 text-center p-4">
        No analytics data available
      </div>
    );
  }

  console.log("Rendering analytics data:", analyticsData);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {t("admin.analytics")}
        </h2>
        <div className="flex space-x-2">
          {["day", "week", "month", "year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as any)}
              className={`px-4 py-2 rounded-md ${
                timeRange === range
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {t(`admin.${range}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {t("admin.uniqueVisitors")}
            </h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {analyticsData.uniqueVisitors}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <Eye className="w-6 h-6 text-green-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {t("admin.pageViews")}
            </h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {analyticsData.pageViews}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <Mail className="w-6 h-6 text-purple-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {t("admin.contactSubmissions")}
            </h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {analyticsData.contactSubmissions}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <Download className="w-6 h-6 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {t("admin.resumeDownloads")}
            </h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {analyticsData.resumeDownloads}
          </p>
        </div>
      </div>

      {/* Top Locations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {t("admin.topLocations")}
        </h3>
        <div className="space-y-2">
          {analyticsData.topLocations.map((location, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">
                {location.country}
              </span>
              <span className="text-gray-900 dark:text-white font-semibold">
                {location.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Projects and Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {t("admin.topProjects")}
          </h3>
          <div className="space-y-2">
            {analyticsData.topProjects.map((project, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">
                  {project.title}
                </span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {project.views}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {t("admin.topSkills")}
          </h3>
          <div className="space-y-2">
            {analyticsData.topSkills.map((skill, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">
                  {skill.name}
                </span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {skill.views}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Spent */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {t("admin.timeSpent")}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              {t("admin.averageTime")}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(analyticsData.timeSpent.average / 60)}{" "}
              {t("admin.minutes")}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              {t("admin.totalTime")}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(analyticsData.timeSpent.total / 3600)}{" "}
              {t("admin.hours")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsManager;
