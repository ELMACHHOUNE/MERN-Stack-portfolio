import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useAdminProfile } from "../context/AdminProfileContext";
import { Briefcase, GraduationCap, Code, Heart, Download } from "lucide-react";

const About: React.FC = () => {
  const { t } = useLanguage();
  const { adminProfile } = useAdminProfile();

  const stats = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      label: t("about.yearsOfExperience"),
      value: "5+",
    },
    {
      icon: <Code className="w-6 h-6" />,
      label: t("about.projectsCompleted"),
      value: "50+",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      label: t("about.happyClients"),
      value: "30+",
    },
  ];

  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            {t("about.title")}
          </h2>
          <p className="text-xl text-gray-400 mb-8">{t("about.subtitle")}</p>
          <p className="text-gray-300 max-w-2xl mx-auto">
            {t("about.description")}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-700 transition-colors"
            >
              <div className="text-blue-400 mb-4 flex justify-center">
                {stat.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {stat.value}
              </h3>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Download CV Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <a
            href={adminProfile?.cvUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            {t("about.downloadCV")}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
