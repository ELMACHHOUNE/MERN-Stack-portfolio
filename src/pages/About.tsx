import React from "react";
import { motion } from "framer-motion";
import { useAdminProfile } from "../context/AdminProfileContext";
import { API_URL } from "../config";
import { User } from "lucide-react";

const About: React.FC = () => {
  const { adminProfile, isLoading } = useAdminProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const defaultValues = [
    {
      icon: "https://cdn-icons-png.flaticon.com/512/1785/1785210.png",
      title: "Clean Code",
      description:
        "Writing maintainable and efficient code that follows best practices.",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/1006/1006771.png",
      title: "Problem Solving",
      description:
        "Finding innovative solutions to complex technical challenges.",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/1055/1055683.png",
      title: "User Experience",
      description:
        "Creating intuitive and accessible applications that users love.",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/1068/1068666.png",
      title: "Continuous Learning",
      description:
        "Staying updated with the latest technologies and industry trends.",
    },
  ];

  const defaultInterests = [
    "Web Development",
    "Software Architecture",
    "UI/UX Design",
    "Cloud Computing",
  ];

  const values = adminProfile ? adminProfile.values || [] : defaultValues;
  const interests = adminProfile
    ? adminProfile.interests || []
    : defaultInterests;

  const hasValues = values.length > 0;
  const hasInterests = interests.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
            <div className="w-32 h-32 relative">
              {adminProfile?.profileImage ? (
                <img
                  src={`${API_URL}${adminProfile.profileImage}`}
                  alt={adminProfile.name}
                  className="rounded-full w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {adminProfile?.name || "Your Name"}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
                {adminProfile?.title || "Full Stack Developer"}
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {adminProfile?.location || "Location"}
              </p>
              <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl">
                {adminProfile?.bio ||
                  "A passionate developer with experience in building web applications using modern technologies."}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Values Section */}
        {hasValues && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 mb-4">
                    <img
                      src={value.icon}
                      alt={value.title}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = "https://via.placeholder.com/32?text=Error";
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Interests Section */}
        {hasInterests && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                >
                  {interest}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default About;
