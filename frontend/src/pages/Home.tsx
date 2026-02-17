import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useAdminProfile } from "../context/AdminProfileContext";
import { useLanguage } from "../context/LanguageContext";
import {
  Github,
  Linkedin,
  Mail,
  LucideIcon,
  Code2,
  Twitter,
  ArrowRight,
  User,
  Facebook,
  Instagram,
  Youtube,
  MapPin,
  MessageCircle,
  Briefcase,
  Heart,
  Download,
} from "lucide-react";
import { api } from "../utils/api";
import { toast } from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

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

interface ClientItem {
  _id: string;
  name: string;
  logo: string;
  website?: string;
  order?: number;
  isActive: boolean;
}

interface AdminProfile {
  name: string;
  title: string;
  location: string;
  bio: string;
  profileImage?: string;
  interests?: string[];
  values: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    gmail?: string;
    whatsapp?: string;
  };
  cvUrl?: string;
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

// Removed unused helper getSkillLevel

const Home: React.FC = () => {
  const { t } = useLanguage();
  const { adminProfile, isLoading } = useAdminProfile() as {
    adminProfile: AdminProfile | null;
    isLoading: boolean;
  };
  const [data, setData] = useState<{
    skills: Skill[];
    categories: Category[];
    clients: ClientItem[];
    stats: {
      yearsOfExperience: number;
      projectsCompleted: number;
      happyClients: number;
    } | null;
    loading: boolean;
    error: string | null;
  }>({
    skills: [],
    categories: [],
    clients: [],
    stats: null,
    loading: true,
    error: null,
  });
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const [isVisible, setIsVisible] = useState(false);
  const { preset } = useTheme();

  const heroBackground = (() => {
    switch (preset) {
      case "girls":
        return "radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #ec4899 100%)";
      case "boys":
        return "radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)";
      case "professional":
        return "radial-gradient(125% 125% at 50% 90%, #000000 40%, #0d1a36 100%)";
      default:
        return "radial-gradient(125% 125% at 50% 10%, #ffffff 40%, var(--brand-primary) 100%)";
    }
  })();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData((prev) => ({ ...prev, loading: true, error: null }));

        // Aggregated data for home
        const homeResponse = await api.get("/home");
        if (!homeResponse.data) {
          throw new Error("Failed to fetch home data");
        }

        const { categories, skills, clients, stats } = homeResponse.data as {
          categories: Category[];
          skills: Skill[];
          clients: ClientItem[];
          stats: {
            yearsOfExperience: number;
            projectsCompleted: number;
            happyClients: number;
          };
        };

        setData({
          skills,
          categories,
          clients,
          stats,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to fetch data",
        );
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

    if (adminProfile.socialLinks.facebook) {
      socialLinks.push({
        icon: Facebook,
        url: adminProfile.socialLinks.facebook,
        label: t("about.socialLinks.facebook"),
      });
    }

    if (adminProfile.socialLinks.instagram) {
      socialLinks.push({
        icon: Instagram,
        url: adminProfile.socialLinks.instagram,
        label: t("about.socialLinks.instagram"),
      });
    }

    if (adminProfile.socialLinks.youtube) {
      socialLinks.push({
        icon: Youtube,
        url: adminProfile.socialLinks.youtube,
        label: t("about.socialLinks.youtube"),
      });
    }

    if (adminProfile.socialLinks.gmail) {
      socialLinks.push({
        icon: Mail,
        url: adminProfile.socialLinks.gmail,
        label: t("about.socialLinks.gmail"),
      });
    }

    if (adminProfile.socialLinks.whatsapp) {
      socialLinks.push({
        icon: MessageCircle,
        url: adminProfile.socialLinks.whatsapp,
        label: t("about.socialLinks.whatsapp"),
      });
    }

    return socialLinks.length > 0 ? socialLinks : defaultSocialLinks;
  };

  // Removed unused helpers getIconComponent and getSkillsByCategory

  const personalInfo = {
    name: adminProfile?.name || t(defaultProfile.name),
    title: adminProfile?.title || t(defaultProfile.title),
    location: adminProfile?.location || t(defaultProfile.location),
    bio: adminProfile?.bio || t(defaultProfile.bio),
    profileImage: adminProfile?.profileImage || "",
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
    interests: adminProfile?.interests || [],
    cvUrl: adminProfile?.cvUrl || "",
  };

  const stats = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      label: t("about.yearsOfExperience"),
      value: data.stats ? `${data.stats.yearsOfExperience}+` : "",
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      label: t("about.projectsCompleted"),
      value: data.stats ? `${data.stats.projectsCompleted}+` : "",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      label: t("about.happyClients"),
      value: data.stats ? `${data.stats.happyClients}+` : "",
    },
  ];

  // Update the image URL construction
  const getImageUrl = (url: string) => {
    if (!url) return undefined;

    // If it's already a full URL (http/https), return as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // If it's a data URL, return as is
    if (url.startsWith("data:")) {
      return url;
    }

    // If it's a local path (starts with /uploads), prepend the base URL
    if (url.startsWith("/uploads")) {
      return `${import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")}${url}`;
    }

    // For any other case, return the URL as is
    return url;
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
      <section className="relative pt-16 min-h-[calc(100vh-0px)] flex items-center overflow-hidden">
        <motion.div
          style={{ opacity, y, background: heroBackground }}
          className="absolute inset-0 z-0"
        />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent brand-gradient">
                {personalInfo.name}
              </h1>
              <p className="mt-4 text-2xl text-gray-700 dark:text-gray-300">
                {personalInfo.title}
              </p>
              <div className="mt-2 flex items-center text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{personalInfo.location}</span>
              </div>
              <p className="mt-6 text-gray-600 dark:text-gray-400 max-w-xl">
                {personalInfo.bio?.length > 0
                  ? personalInfo.bio.slice(0, 160)
                  : t("home.defaultProfile.bio")}
                {personalInfo.bio && personalInfo.bio.length > 160 ? "…" : ""}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/projects"
                  className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-xl text-white btn-brand transform hover:scale-105 transition-all duration-300"
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
              <div className="mt-8 flex flex-wrap gap-3">
                {personalInfo.socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-[#1B2333] dark:hover:bg-[#232B3B] text-gray-600 hover-text-brand dark:text-gray-400 border border-gray-200 dark:border-gray-800"
                    aria-label={link.label}
                  >
                    <link.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center"
            >
              <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-[#1B2333]/60 shadow-sm">
                {personalInfo.profileImage ? (
                  <img
                    src={getImageUrl(personalInfo.profileImage)}
                    alt={personalInfo.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full brand-gradient flex items-center justify-center">
                    <User className="w-20 h-20 text-white/90" />
                  </div>
                )}
                <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/40 dark:ring-black/30" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[240px]">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 dark:border-[#4F46E5]"></div>
              <span className="ml-4 text-gray-600 dark:text-gray-400">
                {t("about.loading")}
              </span>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="card card-hover text-center p-6">
                    <div className="mx-auto mb-4 w-12 h-12 rounded-xl brand-gradient text-white flex justify-center items-center shadow-sm">
                      {stat.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-heading-1 mb-2">
                      {stat.value}
                    </h3>
                    <p className="text-body-var">{stat.label}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-12"
              >
                <div className="card card-hover p-8">
                  <h3 className="text-2xl font-bold text-heading-1 mb-6">
                    {t("about.bio")}
                  </h3>
                  <p className="leading-relaxed text-body-var">
                    {personalInfo.bio}
                  </p>
                </div>
              </motion.div>

              {personalInfo.values.length > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mb-12"
                >
                  <div className="card card-hover p-8">
                    <h3 className="text-2xl font-bold text-heading-1 mb-8">
                      {t("about.coreValues")}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {personalInfo.values.map((value, index) => (
                        <div key={index} className="group card card-hover p-6">
                          <div className="w-12 h-12 mx-auto mb-4 p-2.5 rounded-xl brand-gradient text-white shadow-sm">
                            <img
                              src={getImageUrl(value.icon)}
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
                                    "w-full h-full text-white flex items-center justify-center";
                                  fallbackIcon.innerHTML =
                                    '<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>';
                                  parent.appendChild(fallbackIcon);
                                }
                              }}
                            />
                          </div>
                          <h4 className="text-lg font-semibold text-heading-1 mb-2 text-center">
                            {value.title}
                          </h4>
                          <p className="text-body-var text-center text-sm">
                            {value.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {personalInfo.interests.length > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mb-16"
                >
                  <div className="card card-hover p-8">
                    <h3 className="text-2xl font-bold text-heading-1 mb-8">
                      {t("about.expertise")}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {personalInfo.interests.map((interest, index) => (
                        <motion.span
                          key={index}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="px-4 py-2 bg-white dark:bg-[#232B3B] text-brand rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover:scale-105"
                        >
                          {interest}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {personalInfo.cvUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-center"
                >
                  <a
                    href={personalInfo.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 text-white btn-brand rounded-xl transition-all duration-300"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    {t("about.downloadCV")}
                  </a>
                </motion.div>
              )}

              {/* Clients Section */}
              {Array.isArray(data.clients) && data.clients.length > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="mt-16"
                >
                  <div className="card card-hover p-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                      {t("home.clients")}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 items-center">
                      {data.clients.map((client) => {
                        const logoUrl = getImageUrl(client.logo);
                        const content = (
                          <div className="group card card-hover p-4 flex items-center justify-center transition-transform">
                            {logoUrl ? (
                              <img
                                src={logoUrl}
                                alt={client.name}
                                className="h-16 object-contain transition-transform group-hover:scale-105"
                                loading="lazy"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  const parent = target.parentElement;
                                  if (parent) {
                                    const fallback =
                                      document.createElement("div");
                                    fallback.className = "text-body-var";
                                    fallback.textContent = client.name;
                                    parent.appendChild(fallback);
                                  }
                                }}
                              />
                            ) : (
                              <span className="text-body-var text-sm">
                                {client.name}
                              </span>
                            )}
                          </div>
                        );

                        return client.website ? (
                          <a
                            key={client._id}
                            href={client.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={client.name}
                            className="block"
                          >
                            {content}
                          </a>
                        ) : (
                          <div key={client._id}>{content}</div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{
          background:
            preset === "girls"
              ? "radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #ec4899 100%)"
              : preset === "boys"
                ? "radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)"
                : preset === "professional"
                  ? "radial-gradient(125% 125% at 50% 90%, #000000 40%, #0d1a36 100%)"
                  : "radial-gradient(125% 125% at 50% 10%, #ffffff 40%, var(--brand-primary) 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-heading-2 mb-6">
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
