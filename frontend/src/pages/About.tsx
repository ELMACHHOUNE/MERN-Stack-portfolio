import React from "react";
import { motion } from "framer-motion";
import { useAdminProfile } from "../context/AdminProfileContext";
import { useLanguage } from "../context/LanguageContext";
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
  Code2,
  Briefcase,
  Heart,
  Download,
} from "lucide-react";

const About: React.FC = () => {
  const { adminProfile, isLoading } = useAdminProfile();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#0B1121]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-[#4F46E5]"></div>
        <span className="ml-4 text-gray-600 dark:text-gray-400">
          {t("about.loading")}
        </span>
      </div>
    );
  }

  const stats = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      label: t("about.yearsOfExperience"),
      value: "5+",
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      label: t("about.projectsCompleted"),
      value: "50+",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      label: t("about.happyClients"),
      value: "30+",
    },
  ];

  const renderSocialLinks = () => {
    const socialLinks = [
      {
        icon: <Github className="w-5 h-5" />,
        url: adminProfile?.socialLinks?.github,
        label: t("about.socialLinks.github"),
      },
      {
        icon: <Linkedin className="w-5 h-5" />,
        url: adminProfile?.socialLinks?.linkedin,
        label: t("about.socialLinks.linkedin"),
      },
      {
        icon: <Twitter className="w-5 h-5" />,
        url: adminProfile?.socialLinks?.twitter,
        label: t("about.socialLinks.twitter"),
      },
      {
        icon: <Facebook className="w-5 h-5" />,
        url: adminProfile?.socialLinks?.facebook,
        label: t("about.socialLinks.facebook"),
      },
      {
        icon: <Instagram className="w-5 h-5" />,
        url: adminProfile?.socialLinks?.instagram,
        label: t("about.socialLinks.instagram"),
      },
      {
        icon: <Youtube className="w-5 h-5" />,
        url: adminProfile?.socialLinks?.youtube,
        label: t("about.socialLinks.youtube"),
      },
      {
        icon: <Mail className="w-5 h-5" />,
        url: adminProfile?.socialLinks?.gmail,
        label: t("about.socialLinks.gmail"),
      },
      {
        icon: <MessageCircle className="w-5 h-5" />,
        url: adminProfile?.socialLinks?.whatsapp,
        label: t("about.socialLinks.whatsapp"),
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
              className="p-3 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-[#4F46E5] bg-gray-50 hover:bg-gray-100 dark:bg-[#1B2333] dark:hover:bg-[#232B3B] border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 rounded-xl"
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
    <div className="min-h-screen bg-white dark:bg-[#0B1121]">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="relative pt-20 pb-32">
          <div className="relative z-10">
            <div className="text-center mb-16">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative inline-block"
              >
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300">
                  {adminProfile?.profileImage ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL.replace(
                        /\/?api\/?$/,
                        ""
                      )}${adminProfile.profileImage}`}
                      alt={adminProfile.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          const fallbackIcon = document.createElement("div");
                          fallbackIcon.className =
                            "w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA] flex items-center justify-center";
                          fallbackIcon.innerHTML =
                            '<svg xmlns="http://www.w3.org/2000/svg" class="w-20 h-20 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>';
                          parent.appendChild(fallbackIcon);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA] flex items-center justify-center">
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
                <h1 className="mt-8 text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA]">
                  {adminProfile?.name || t("about.title")}
                </h1>
                <p className="mt-4 text-xl text-blue-600 dark:text-[#4F46E5] font-medium">
                  {adminProfile?.title || t("about.subtitle")}
                </p>
                <div className="mt-3 flex items-center justify-center text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{adminProfile?.location || t("about.location")}</span>
                </div>
                <div className="mt-8">{renderSocialLinks()}</div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-[#1B2333] rounded-xl p-6 text-center border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 shadow-sm dark:shadow-none"
            >
              <div className="text-blue-600 dark:text-[#4F46E5] mb-4 flex justify-center">
                {stat.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Content Sections */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Bio Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-3"
            >
              <div className="bg-gray-50 dark:bg-[#1B2333] rounded-xl p-8 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 shadow-sm dark:shadow-none">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {t("about.bio")}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {adminProfile?.bio || t("about.description")}
                </p>
              </div>
            </motion.div>

            {/* Values Section */}
            {adminProfile?.values && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="lg:col-span-2"
              >
                <div className="bg-gray-50 dark:bg-[#1B2333] rounded-xl p-8 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 shadow-sm dark:shadow-none">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                    {t("about.coreValues")}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {adminProfile.values.map((value, index) => (
                      <div
                        key={index}
                        className="group bg-white dark:bg-[#232B3B] rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300"
                      >
                        <div className="w-12 h-12 mx-auto mb-4 p-2.5 rounded-xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 dark:from-[#4F46E5]/10 dark:to-[#9333EA]/10 border border-gray-200 dark:border-gray-800 group-hover:border-gray-300 dark:group-hover:border-gray-700 transition-all duration-300">
                          <img
                            src={value.icon}
                            alt={value.title}
                            className="w-full h-full object-contain"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                const fallbackIcon =
                                  document.createElement("div");
                                fallbackIcon.className =
                                  "w-full h-full text-blue-600 dark:text-[#4F46E5]";
                                fallbackIcon.innerHTML =
                                  '<svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>';
                                parent.appendChild(fallbackIcon);
                              }
                            }}
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
                          {value.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-center text-sm">
                          {value.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Interests Section */}
            {adminProfile?.interests && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="lg:col-span-1"
              >
                <div className="bg-gray-50 dark:bg-[#1B2333] rounded-xl p-8 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 shadow-sm dark:shadow-none">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                    {t("about.expertise")}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {adminProfile.interests.map((interest, index) => (
                      <motion.span
                        key={index}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="px-4 py-2 bg-white dark:bg-[#232B3B] text-blue-600 dark:text-[#4F46E5] rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300"
                      >
                        {interest}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Download CV Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-16"
          >
            <a
              href={adminProfile?.cvUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA] hover:from-blue-700 hover:to-purple-700 dark:hover:from-[#4338CA] dark:hover:to-[#7E22CE] text-white rounded-xl transition-all duration-300"
            >
              <Download className="w-5 h-5 mr-2" />
              {t("about.downloadCV")}
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
