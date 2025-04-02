import React from "react";
import { motion } from "framer-motion";
import { useAdminProfile } from "../context/AdminProfileContext";
import { API_URL } from "../config";
import {
  User,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  MapPin,
  Mail,
  MessageCircle,
  Calendar,
} from "lucide-react";

const About: React.FC = () => {
  const { adminProfile, isLoading } = useAdminProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  const renderSocialLinks = () => {
    const socialLinks = [
      {
        icon: <Github className="w-5 h-5" />,
        url: adminProfile?.socialLinks?.github,
        label: "GitHub",
      },
      {
        icon: <Linkedin className="w-5 h-5" />,
        url: adminProfile?.socialLinks?.linkedin,
        label: "LinkedIn",
      },
      {
        icon: <Twitter className="w-5 h-5" />,
        url: adminProfile?.socialLinks?.twitter,
        label: "Twitter",
      },
      {
        icon: <Facebook className="w-5 h-5" />,
        url: adminProfile?.socialLinks?.facebook,
        label: "Facebook",
      },
      {
        icon: <Instagram className="w-5 h-5" />,
        url: adminProfile?.socialLinks?.instagram,
        label: "Instagram",
      },
      {
        icon: <Youtube className="w-5 h-5" />,
        url: adminProfile?.socialLinks?.youtube,
        label: "YouTube",
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M22 7h-7V2H9v5H2v15h20V7zM9 13.47c0 .43-.15.77-.46 1.03-.31.25-.75.38-1.32.38H5.94V12h1.31c.54 0 .96.12 1.27.37.3.25.46.58.46.99l.02.11zm6.31.03c0 .42-.14.76-.41 1.05-.28.28-.65.42-1.12.42-.48 0-.87-.15-1.16-.45-.29-.31-.44-.7-.44-1.18 0-.47.15-.85.46-1.15.31-.31.71-.46 1.21-.46.46 0 .83.14 1.09.42.27.28.4.63.4 1.06l-.03.29zm-6.31-3.93c0 .42-.15.75-.45 1-.3.25-.72.37-1.27.37H5.94V8.43h1.31c.54 0 .97.13 1.28.38.31.25.46.59.46 1l.02.11zm6.31-.08c0 .36-.11.66-.34.89-.23.23-.55.34-.96.34-.42 0-.75-.12-1-.37-.25-.25-.38-.57-.38-.97 0-.41.13-.74.4-1 .27-.26.62-.39 1.05-.39.41 0 .74.12.99.36.24.24.36.55.36.92l-.12.22z" />
          </svg>
        ),
        url: adminProfile?.socialLinks?.behance,
        label: "Behance",
      },
      {
        icon: <Mail className="w-5 h-5" />,
        url: adminProfile?.socialLinks?.gmail,
        label: "Gmail",
      },
      {
        icon: <MessageCircle className="w-5 h-5" />,
        url: adminProfile?.socialLinks?.whatsapp,
        label: "WhatsApp",
      },
    ];

    return (
      <div className="flex flex-wrap gap-4 justify-center">
        {socialLinks.map((link, index) =>
          link.url && link.url.trim() !== "" ? (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
              aria-label={link.label}
            >
              {link.icon}
            </a>
          ) : null
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>

        {/* Header Section */}
        <div className="relative pt-20 pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative z-10">
              <div className="text-center mb-16">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative inline-block"
                >
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-3xl overflow-hidden border-8 border-white dark:border-gray-800 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    {adminProfile?.profileImage ? (
                      <img
                        src={`${API_URL}${adminProfile.profileImage}`}
                        alt={adminProfile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 flex items-center justify-center">
                        <User className="w-20 h-20 text-white/90" />
                      </div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h1 className="mt-8 text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                    {adminProfile?.name || "Your Name"}
                  </h1>
                  <p className="mt-4 text-xl text-indigo-600 dark:text-indigo-400 font-medium">
                    {adminProfile?.title || "Software Engineer"}
                  </p>
                  <div className="mt-3 flex items-center justify-center text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{adminProfile?.location || "Location"}</span>
                  </div>
                  <div className="mt-8">{renderSocialLinks()}</div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Bio Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-3"
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  About Me
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {adminProfile?.bio ||
                    "A passionate professional with experience in modern technologies."}
                </p>
              </div>
            </motion.div>

            {/* Values Section */}
            {adminProfile?.values && adminProfile.values.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="lg:col-span-2"
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                    Core Values
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {adminProfile.values.map((value, index) => (
                      <div
                        key={index}
                        className="group bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/50 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/70 transition-colors mb-4 mx-auto">
                          <img
                            src={value.icon}
                            alt={value.title}
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
                          {value.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
                          {value.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Interests Section */}
            {adminProfile?.interests && adminProfile.interests.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="lg:col-span-1"
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                    Expertise
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {adminProfile.interests.map((interest, index) => (
                      <motion.span
                        key={index}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium hover:shadow-md transition-shadow"
                      >
                        {interest}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
