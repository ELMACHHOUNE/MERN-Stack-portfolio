import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useAdminProfile } from "../context/AdminProfileContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
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
  Star,
  Twitter,
  ArrowRight,
  Briefcase,
  Heart,
} from "lucide-react";

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
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    gmail?: string;
  };
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
  const { theme } = useTheme();
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
    if (!adminProfile?.socialLinks) {
      return defaultSocialLinks;
    }

    const socialLinks = [];

    if (adminProfile.socialLinks.github) {
      socialLinks.push({
        icon: Github,
        url: adminProfile.socialLinks.github,
        label: t("about.socialLinks.github"),
      });
    }

    if (adminProfile.socialLinks.linkedin) {
      socialLinks.push({
        icon: Linkedin,
        url: adminProfile.socialLinks.linkedin,
        label: t("about.socialLinks.linkedin"),
      });
    }

    if (adminProfile.socialLinks.twitter) {
      socialLinks.push({
        icon: Twitter,
        url: adminProfile.socialLinks.twitter,
        label: t("about.socialLinks.twitter"),
      });
    }

    if (adminProfile.socialLinks.gmail) {
      socialLinks.push({
        icon: Mail,
        url: adminProfile.socialLinks.gmail,
        label: t("about.socialLinks.gmail"),
      });
    }

    return socialLinks.length > 0 ? socialLinks : defaultSocialLinks;
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
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#0B1121]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-[#4F46E5]"></div>
        <span className="ml-4 text-gray-600 dark:text-gray-400">
          {t("home.skills.loading")}
        </span>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#0B1121]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {t("home.skills.error")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1121]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ opacity, y }}
          className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-[#4F46E5]/10 dark:to-[#9333EA]/10"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-4xl mx-auto text-center z-10 px-4 sm:px-6 lg:px-8"
        >
          <h1 className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA] mb-6">
            {personalInfo.name}
          </h1>
          <p className="text-3xl text-gray-700 dark:text-gray-300 mb-4">
            {personalInfo.title}
          </p>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            {personalInfo.bio}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/projects"
              className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA] hover:from-blue-700 hover:to-purple-700 dark:hover:from-[#4338CA] dark:hover:to-[#7E22CE] transform hover:scale-105 transition-all duration-300"
            >
              {t("home.cta.viewWork")}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-[#1B2333] dark:hover:bg-[#232B3B] border border-gray-200 dark:border-gray-800 dark:hover:border-gray-700 transform hover:scale-105 transition-all duration-300"
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
                className="p-3 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-[#4F46E5] bg-gray-50 hover:bg-gray-100 dark:bg-[#1B2333] dark:hover:bg-[#232B3B] border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 rounded-xl"
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

      {/* Skills Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA] mb-4">
              {t("home.skills.title")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t("home.skills.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {getSkillsByCategory().map((group) => (
              <motion.div
                key={group.category._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-50 dark:bg-[#1B2333] rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 shadow-sm dark:shadow-none"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8">
                    {(() => {
                      const IconComponent = getIconComponent(group.category);
                      return (
                        <IconComponent className="w-8 h-8 text-blue-600 dark:text-[#4F46E5]" />
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
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                const fallbackIcon =
                                  document.createElement("div");
                                fallbackIcon.className =
                                  "text-gray-500 dark:text-gray-400";
                                fallbackIcon.innerHTML =
                                  '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>';
                                parent.appendChild(fallbackIcon);
                              }
                            }}
                          />
                        ) : (
                          <Star className="w-6 h-6 text-yellow-400 mr-3" />
                        )}
                        <span className="text-gray-700 dark:text-gray-300">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-gray-500 dark:text-gray-400">
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
              className="inline-flex items-center px-6 py-3 rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA] hover:from-blue-700 hover:to-purple-700 dark:hover:from-[#4338CA] dark:hover:to-[#7E22CE] transition-all duration-300"
            >
              {t("home.skills.viewAll")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#1B2333]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA] mb-4">
              {t("home.values.sectionTitle")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
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
                className="bg-white dark:bg-[#232B3B] rounded-xl p-8 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 shadow-sm dark:shadow-none"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 p-2.5 rounded-xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 dark:from-[#4F46E5]/10 dark:to-[#9333EA]/10 border border-gray-200 dark:border-gray-800 mr-4">
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
                          const fallbackIcon = document.createElement("div");
                          fallbackIcon.className =
                            "w-full h-full text-blue-600 dark:text-[#4F46E5]";
                          fallbackIcon.innerHTML =
                            '<svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>';
                          parent.appendChild(fallbackIcon);
                        }
                      }}
                    />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {value.title}
                  </h3>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-[#4F46E5] dark:to-[#9333EA]">
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
              className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
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
