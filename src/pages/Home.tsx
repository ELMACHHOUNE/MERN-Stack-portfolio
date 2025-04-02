import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAdminProfile } from "../context/AdminProfileContext";
import {
  Code,
  Brain,
  Heart,
  Rocket,
  ChevronDown,
  Terminal,
  Laptop,
  Cloud,
  Database,
  Github,
  Linkedin,
  Mail,
  LucideIcon,
  Server,
  Globe,
  Layout,
  Cpu,
  Smartphone,
  Code2,
  Box,
  Layers,
  Settings,
  Monitor,
} from "lucide-react";
import { ArrowRight } from "lucide-react";

interface SocialLink {
  icon: LucideIcon;
  url: string;
  label: string;
}

interface AdminProfile {
  name: string;
  email: string;
  profileImage: string | null;
  title?: string;
  location?: string;
  bio?: string;
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

const defaultProfile = {
  name: "Your Name",
  title: "Full Stack Developer",
  location: "Your Location",
  bio: `Passionate about creating elegant solutions to complex problems. Specializing in modern web technologies 
  and cloud architecture. Let's build something amazing together.`,
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

const getSkillLevel = (level: number): string => {
  if (level >= 90) return "Expert";
  if (level >= 75) return "Advanced";
  if (level >= 50) return "Intermediate";
  if (level >= 25) return "Basic";
  return "Beginner";
};

const Home: React.FC = () => {
  const { adminProfile } = useAdminProfile();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        setCategories(categoriesData);

        // Then fetch skills
        const skillsResponse = await fetch("http://localhost:5000/api/skills");
        if (!skillsResponse.ok) {
          throw new Error(`Failed to fetch skills: ${skillsResponse.status}`);
        }
        const skillsData = await skillsResponse.json();
        console.log("Raw skills data:", skillsData);

        // Filter active skills and normalize the data
        const activeSkills = skillsData
          .filter((skill: Skill) => skill.isActive)
          .map((skill: Skill) => ({
            ...skill,
            // Multiply by 10 if the level is less than 10 (assuming it's in 0-10 scale)
            level: skill.level < 10 ? skill.level * 10 : skill.level,
            // Ensure icon path is absolute and handle both full URLs and relative paths
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

        console.log("Processed active skills:", activeSkills);
        setSkills(activeSkills);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    if (!Array.isArray(skills) || !Array.isArray(categories)) return [];

    return categories
      .filter((category) => category.isActive)
      .map((category) => ({
        category,
        skills: skills
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
    name: adminProfile?.name || defaultProfile.name,
    title: adminProfile?.title || defaultProfile.title,
    location: adminProfile?.location || defaultProfile.location,
    bio: adminProfile?.bio || defaultProfile.bio,
    values: [
      {
        icon: Code,
        title: "Clean Code",
        description:
          "Writing maintainable and efficient code that follows best practices.",
      },
      {
        icon: Brain,
        title: "Problem Solving",
        description:
          "Finding innovative solutions to complex technical challenges.",
      },
      {
        icon: Heart,
        title: "User Experience",
        description:
          "Creating intuitive and accessible applications that users love.",
      },
      {
        icon: Rocket,
        title: "Innovation",
        description:
          "Pushing boundaries with cutting-edge technologies and approaches.",
      },
    ],
    socialLinks: Array.isArray(adminProfile?.socialLinks)
      ? adminProfile.socialLinks.map((link: any) => ({
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
        }))
      : defaultSocialLinks,
  };

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
              View My Work
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transform hover:scale-105 transition-all"
            >
              Get in Touch
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
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Technologies I Work With
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Modern tools for modern solutions
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              [...Array(3)].map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse"
                >
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={`item-${i}`}
                        className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"
                      ></div>
                    ))}
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="col-span-3 text-center text-red-500">{error}</div>
            ) : skills.length === 0 ? (
              <div className="col-span-3 text-center text-gray-500 dark:text-gray-400">
                No skills found
              </div>
            ) : (
              getSkillsByCategory().map(({ category, skills }, index) => {
                const IconComponent = getIconComponent(category);

                return (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <IconComponent className="h-12 w-12 text-blue-500 dark:text-blue-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 capitalize">
                      {category.name}
                    </h3>
                    <div className="space-y-6">
                      {skills.map((skill) => (
                        <div key={skill._id} className="group">
                          <div className="flex justify-between items-center text-sm mb-2">
                            <div className="flex items-center space-x-2">
                              {skill.icon ? (
                                <img
                                  src={skill.icon}
                                  alt={skill.name}
                                  className="w-5 h-5 object-contain"
                                  onError={(e) => {
                                    console.log(
                                      "Image failed to load:",
                                      skill.icon
                                    );
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.style.display = "none";
                                    const parent =
                                      target.parentNode as HTMLElement;

                                    // Use category-specific icon as fallback
                                    const IconComponent = getIconComponent(
                                      skill.category
                                    );
                                    const fallbackIcon =
                                      document.createElement("span");
                                    fallbackIcon.className =
                                      "w-5 h-5 text-blue-500 dark:text-blue-400";

                                    // Create SVG element using the category icon
                                    const iconSvg = document.createElementNS(
                                      "http://www.w3.org/2000/svg",
                                      "svg"
                                    );
                                    iconSvg.setAttribute(
                                      "viewBox",
                                      "0 0 24 24"
                                    );
                                    iconSvg.setAttribute("width", "20");
                                    iconSvg.setAttribute("height", "20");
                                    iconSvg.setAttribute("fill", "none");
                                    iconSvg.setAttribute(
                                      "stroke",
                                      "currentColor"
                                    );
                                    iconSvg.setAttribute("stroke-width", "2");
                                    iconSvg.setAttribute(
                                      "stroke-linecap",
                                      "round"
                                    );
                                    iconSvg.setAttribute(
                                      "stroke-linejoin",
                                      "round"
                                    );

                                    // Use a simple code icon path as fallback
                                    iconSvg.innerHTML = `
                                      <path d="M16 18l6-6-6-6"></path>
                                      <path d="M8 6l-6 6 6 6"></path>
                                    `;

                                    fallbackIcon.appendChild(iconSvg);
                                    parent.appendChild(fallbackIcon);
                                  }}
                                />
                              ) : (
                                <span className="w-5 h-5 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-md">
                                  <Code2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                                </span>
                              )}
                              <span className="text-gray-700 dark:text-gray-200 font-medium">
                                {skill.name}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <div className="relative">
                                <motion.span
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-blue-500 dark:bg-blue-400 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                  {skill.level}%
                                </motion.span>
                                <span className="px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 text-blue-600 dark:text-blue-400 rounded-full font-medium text-xs">
                                  {getSkillLevel(skill.level)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="relative h-2.5 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-xl">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{
                                duration: 1.5,
                                ease: [0.4, 0, 0.2, 1],
                                delay: 0.2,
                              }}
                              className="absolute top-0 left-0 h-full rounded-full"
                            >
                              <div className="relative w-full h-full">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-400 to-purple-500 dark:from-blue-400 dark:via-blue-300 dark:to-purple-400 animate-gradient" />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" />
                              </div>
                            </motion.div>
                            <div className="absolute inset-0 flex justify-between px-1">
                              {[25, 50, 75].map((marker) => (
                                <div
                                  key={marker}
                                  className="w-px h-full bg-gray-200 dark:bg-gray-600/50"
                                  style={{ left: `${marker}%` }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              My Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Principles that guide my work
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
                  <value.icon className="h-10 w-10 text-blue-500 dark:text-blue-400 mr-4" />
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
              Ready to Start Your Next Project?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Let's collaborate and create something extraordinary together
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full text-blue-600 dark:text-blue-500 bg-white dark:bg-gray-100 hover:bg-blue-50 dark:hover:bg-gray-200 transform hover:scale-105 transition-all"
            >
              Let's Talk
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
