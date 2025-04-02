import React from "react";
import { motion } from "framer-motion";
import { useAdminProfile } from "../context/AdminProfileContext";
import { API_URL } from "../config";
import { User, Github, Linkedin, Twitter } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About Me
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover my journey, values, and what drives me in the world of
            technology
          </p>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 mb-12"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-blue-500 ring-offset-4 ring-offset-white dark:ring-offset-gray-800">
                {adminProfile?.profileImage ? (
                  <img
                    src={`${API_URL}${adminProfile.profileImage}`}
                    alt={adminProfile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="w-20 h-20 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
                <div className="flex space-x-2">
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {adminProfile?.name || "Your Name"}
              </h2>
              <p className="text-xl text-blue-600 dark:text-blue-400 mt-2">
                {adminProfile?.title || "Full Stack Developer"}
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {adminProfile?.location || "Location"}
              </p>
              <p className="mt-6 text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
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
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="group relative bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-blue-100 dark:bg-blue-900 mb-4 mx-auto">
                      <img
                        src={value.icon}
                        alt={value.title}
                        className="w-10 h-10 object-contain"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.src = "https://via.placeholder.com/40?text=Error";
                        }}
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center">
                      {value.description}
                    </p>
                  </div>
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
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Areas of Interest
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {interests.map((interest, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
