import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useAdminProfile } from "../context/AdminProfileContext";
import { useLanguage } from "../context/LanguageContext";
import {
  Code,
  ChevronDown,
  Cloud,
  Database,
  Github,
  Linkedin,
  Mail,
  LucideIcon,
  Server,
  Layout,
  Smartphone,
  Code2,
  Settings,
} from "lucide-react";
import { ArrowRight } from "lucide-react";

interface SocialLink {
  icon: LucideIcon;
  url: string;
  label: string;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
}

interface Skill {
  _id: string;
  name: string;
  level: number;
  category: Category;
  icon?: string;
  order?: number;
  isActive: boolean;
}

interface AdminProfile {
  name: string;
  title: string;
  location: string;
  bio: string;
  values: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;
}

const defaultProfile = {
  name: "home.defaultProfile.name",
  title: "home.defaultProfile.title",
  location: "home.defaultProfile.location",
  bio: "home.defaultProfile.bio",
};

const defaultSocialLinks: SocialLink[] = [
  {
    icon: Github,
    url: "https://github.com/yourusername",
    label: "GitHub",
  },
  {
    icon: Linkedin,
    url: "https://linkedin.com/in/yourusername",
    label: "LinkedIn",
  },
  {
    icon: Mail,
    url: "mailto:youremail@example.com",
    label: "Email",
  },
];

const getSkillLevel = (level: number, t: (key: string) => string): string => {
  if (level >= 90) return t("home.skills.level.expert");
  if (level >= 75) return t("home.skills.level.advanced");
  if (level >= 50) return t("home.skills.level.intermediate");
  if (level >= 25) return t("home.skills.level.basic");
  return t("home.skills.level.beginner");
};

const Home: React.FC = () => {
  const { t } = useLanguage();
  const { adminProfile } = useAdminProfile() as {
    adminProfile: AdminProfile | null;
  };
  const [data, setData] = useState<{
    skills: Skill[];
    categories: Category[];
    loading: boolean;
    error: string | null;
  }>({
    skills: [],
    categories: [],
    loading: true,
    error: null,
  });
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData((prev) => ({ ...prev, loading: true, error: null }));

        // Fetch categories first
        const categoriesResponse = await fetch(
          "http://localhost:5000/api/categories"
        );
        if (!categoriesResponse.ok) {
          throw new Error(
            `Failed to fetch categories: ${categoriesResponse.status}`
          );
        }
        const categoriesData = await categoriesResponse.json();

        // Then fetch skills
        const skillsResponse = await fetch("http://localhost:5000/api/skills");
        if (!skillsResponse.ok) {
          throw new Error(`Failed to fetch skills: ${skillsResponse.status}`);
        }
        const skillsData = await skillsResponse.json();

        // Process skills data
        const processedSkills = skillsData
          .filter((skill: Skill) => skill.isActive)
          .map((skill: Skill) => ({
            ...skill,
            level: skill.level < 10 ? skill.level * 10 : skill.level,
            icon: skill.icon
              ? skill.icon.startsWith("http")
                ? skill.icon
                : `http://localhost:5000/uploads/${skill.icon.replace(
                    /^\/+/,
                    ""
                  )}`
              : null,
          }))
          .sort((a: Skill, b: Skill) => (a.order || 0) - (b.order || 0));

        setData({
          skills: processedSkills,
          categories: categoriesData,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setData((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error ? error.message : "Failed to fetch data",
        }));
      }
    };

    fetchData();
  }, []);

  const getSocialLinks = () => {
    if (
      !adminProfile?.socialLinks ||
      !Array.isArray(adminProfile.socialLinks)
    ) {
      return defaultSocialLinks;
    }

    return adminProfile.socialLinks.map((link) => ({
      icon:
        link.platform === "github"
          ? Github
          : link.platform === "linkedin"
          ? Linkedin
          : link.platform === "email"
          ? Mail
          : Github,
      url: link.url || "#",
      label: link.platform || "Social Link",
    }));
  };

  // Map icon strings to actual icon components
  const getIconComponent = (category: Category) => {
    const iconMap: { [key: string]: any } = {
      frontend: Layout,
      backend: Server,
      database: Database,
      cloud: Cloud,
      mobile: Smartphone,
      tools: Settings,
      testing: Code2,
      devops: Cloud,
      "tools & others": Settings,
      default: Code,
    };

    // Try to match by category name
    const icon = iconMap[category.name.toLowerCase()] || iconMap.default;
    return icon;
  };

  // Group skills by category
  const getSkillsByCategory = () => {
    if (!Array.isArray(data.skills) || !Array.isArray(data.categories))
      return [];

    return data.categories
      .filter((category) => category.isActive)
      .map((category) => ({
        category,
        skills: data.skills
          .filter(
            (skill) =>
              skill.isActive &&
              skill.category &&
              skill.category._id === category._id
          )
          .sort((a, b) => (a.order || 0) - (b.order || 0)),
      }))
      .filter((group) => group.skills.length > 0);
  };

  const personalInfo = {
    name: adminProfile?.name || t(defaultProfile.name),
    title: adminProfile?.title || t(defaultProfile.title),
    location: adminProfile?.location || t(defaultProfile.location),
    bio: adminProfile?.bio || t(defaultProfile.bio),
    values: adminProfile?.values?.map((value) => ({
      icon: value.icon,
      title: value.title,
      description: value.description,
    })) || [
      {
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        title: t("home.values.cleanCode.title"),
        description: t("home.values.cleanCode.description"),
      },
      {
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
        title: t("home.values.problemSolving.title"),
        description: t("home.values.problemSolving.description"),
      },
      {
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        title: t("home.values.userExperience.title"),
        description: t("home.values.userExperience.description"),
      },
      {
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        title: t("home.values.innovation.title"),
        description: t("home.values.innovation.description"),
      },
    ],
    socialLinks: getSocialLinks(),
  };

  if (data.loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
        <span className="ml-4 text-gray-600 dark:text-gray-400">
          {t("home.skills.loading")}
        </span>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {t("home.skills.error")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          style={{ opacity, y }}
          className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-4xl mx-auto text-center z-10"
        >
          <h1 className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-6">
            {personalInfo.name}
          </h1>
          <p className="text-3xl text-gray-700 dark:text-gray-300 mb-4">
            {personalInfo.title}
          </p>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            {personalInfo.bio}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              to="/projects"
              className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 transform hover:scale-105 transition-all"
            >
              {t("home.cta.viewWork")}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transform hover:scale-105 transition-all"
            >
              {t("home.cta.getInTouch")}
            </Link>
          </div>
          <div className="flex justify-center gap-6">
            {personalInfo.socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label={link.label}
              >
                <link.icon className="h-6 w-6" />
              </motion.a>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="h-8 w-8 text-gray-400 dark:text-gray-500 animate-bounce" />
        </motion.div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t("home.skills.title")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t("home.skills.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getSkillsByCategory().map((group) => (
              <motion.div
                key={group.category._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8">
                    {(() => {
                      const IconComponent = getIconComponent(group.category);
                      return (
                        <IconComponent className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                      );
                    })()}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {group.category.name}
                  </h3>
                </div>
                <div className="space-y-4">
                  {group.skills.map((skill) => (
                    <div
                      key={skill._id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        {skill.icon ? (
                          <img
                            src={skill.icon}
                            alt={skill.name}
                            className="w-6 h-6 mr-3"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = target.parentNode as HTMLElement;
                              const fallbackIcon =
                                document.createElement("span");
                              fallbackIcon.className =
                                "w-6 h-6 mr-3 text-blue-500 dark:text-blue-400";
                              const iconSvg = document.createElementNS(
                                "http://www.w3.org/2000/svg",
                                "svg"
                              );
                              iconSvg.setAttribute("viewBox", "0 0 24 24");
                              iconSvg.setAttribute("width", "24");
                              iconSvg.setAttribute("height", "24");
                              iconSvg.setAttribute("fill", "none");
                              iconSvg.setAttribute("stroke", "currentColor");
                              iconSvg.setAttribute("stroke-width", "2");
                              iconSvg.setAttribute("stroke-linecap", "round");
                              iconSvg.setAttribute("stroke-linejoin", "round");
                              iconSvg.innerHTML = `
                                <path d="M16 18l6-6-6-6"></path>
                                <path d="M8 6l-6 6 6 6"></path>
                              `;
                              fallbackIcon.appendChild(iconSvg);
                              parent.appendChild(fallbackIcon);
                            }}
                          />
                        ) : (
                          <span className="w-6 h-6 mr-3 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-md">
                            <Code2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                          </span>
                        )}
                        <span className="text-gray-700 dark:text-gray-300">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {getSkillLevel(skill.level, t)}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/skills"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-colors"
            >
              {t("home.skills.viewAll")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("home.values.sectionTitle")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t("home.values.sectionDescription")}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {personalInfo.values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={value.icon}
                    alt={value.title}
                    className="h-10 w-10 mr-4"
                  />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {value.title}
                  </h3>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              {t("home.cta.readyToStart")}
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              {t("home.cta.collaborateMessage")}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full text-blue-600 dark:text-blue-500 bg-white dark:bg-gray-100 hover:bg-blue-50 dark:hover:bg-gray-200 transform hover:scale-105 transition-all"
            >
              {t("home.cta.letsTalk")}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
