import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Users, Eye, Mail, Download, Globe, Award, Clock } from "lucide-react";
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
          `${
            import.meta.env.VITE_API_URL
          }/api/analytics?timeRange=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Analytics data received:", response.data);

        // Ensure all required fields are present
        const data = {
          uniqueVisitors: response.data.uniqueVisitors || 0,
          pageViews: response.data.pageViews || 0,
          contactSubmissions: response.data.contactSubmissions || 0,
          resumeDownloads: response.data.resumeDownloads || 0,
          topLocations: response.data.topLocations || [],
          topProjects: response.data.topProjects || [],
          topSkills: response.data.topSkills || [],
          timeSpent: response.data.timeSpent || { average: 0, total: 0 },
        };

        console.log("Processed analytics data:", data);
        setAnalyticsData(data);
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
    <div className="space-y-8 p-6">
      {/* Header with time range selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {t("admin.analytics")}
        </h2>
        <div className="flex flex-wrap gap-2">
          {["day", "week", "month", "year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as any)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeRange === range
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {t(`admin.${range}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t("admin.uniqueVisitors")}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {analyticsData.uniqueVisitors}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <Eye className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t("admin.pageViews")}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {analyticsData.pageViews}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <Mail className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t("admin.contactSubmissions")}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {analyticsData.contactSubmissions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
              <Download className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t("admin.resumeDownloads")}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {analyticsData.resumeDownloads}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Locations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <Globe className="w-5 h-5 text-indigo-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {t("admin.topLocations")}
            </h3>
          </div>
          <div className="space-y-4">
            {analyticsData.topLocations.map((location, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  {location.country}
                </span>
                <span className="text-gray-900 dark:text-white font-medium px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                  {location.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Projects */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {t("admin.topProjects")}
            </h3>
          </div>
          <div className="space-y-4">
            {analyticsData.topProjects.map((project, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
                  {project.title}
                </span>
                <span className="text-gray-900 dark:text-white font-medium px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                  {project.views}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Time Spent */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-teal-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {t("admin.timeSpent")}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t("admin.averageTime")}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(analyticsData.timeSpent.average / 60)}{" "}
                <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                  {t("admin.minutes")}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t("admin.totalTime")}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(analyticsData.timeSpent.total / 3600)}{" "}
                <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                  {t("admin.hours")}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsManager;
