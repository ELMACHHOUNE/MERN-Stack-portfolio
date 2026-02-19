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
import { ProgressiveBlur } from "../components/ui/ProgressiveBlur";
import { AnimatedBeam } from "../components/ui/animated-beam";

type CoreValue = {
  icon: string;
  title: string;
  description: string;
};

const CoreValuesCircle = React.forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; title?: string }
>(({ className = "", children, title }, ref) => (
  <div
    ref={ref}
    title={title}
    className={[
      "z-10 flex size-12 items-center justify-center rounded-full",
      "border border-card bg-card",
      "shadow-[0_0_20px_-12px_rgba(0,0,0,0.35)]",
      "transition-transform duration-300 hover:scale-105",
      className,
    ].join(" ")}
  >
    {children}
  </div>
));
CoreValuesCircle.displayName = "CoreValuesCircle";

const CoreValuesBeamDiagram: React.FC<{
  values: CoreValue[];
  getImageUrl: (_url: string) => string | undefined;
}> = ({ values, getImageUrl }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const centerRef = React.useRef<HTMLDivElement>(null);
  const div1Ref = React.useRef<HTMLDivElement>(null);
  const div2Ref = React.useRef<HTMLDivElement>(null);
  const div3Ref = React.useRef<HTMLDivElement>(null);
  const div5Ref = React.useRef<HTMLDivElement>(null);
  const div6Ref = React.useRef<HTMLDivElement>(null);

  const nodes = values.slice(0, 6);
  const topRow = nodes.slice(0, 2);
  const midRow = nodes.slice(2, 5);
  const bottomRow = nodes.slice(5, 6);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[320px] w-full items-center justify-center overflow-hidden rounded-2xl border border-card bg-card/60"
    >
      <div className="flex size-full max-h-[230px] max-w-lg flex-col items-stretch justify-between gap-10 px-8">
        <div className="flex flex-row items-center justify-between">
          {topRow[0] ? (
            <CoreValuesCircle ref={div1Ref} title={topRow[0].title}>
              <img
                src={getImageUrl(topRow[0].icon)}
                alt={topRow[0].title}
                className="h-6 w-6 object-contain"
                loading="lazy"
              />
            </CoreValuesCircle>
          ) : (
            <div />
          )}

          {topRow[1] ? (
            <CoreValuesCircle ref={div5Ref} title={topRow[1].title}>
              <img
                src={getImageUrl(topRow[1].icon)}
                alt={topRow[1].title}
                className="h-6 w-6 object-contain"
                loading="lazy"
              />
            </CoreValuesCircle>
          ) : (
            <div />
          )}
        </div>

        <div className="flex flex-row items-center justify-between">
          {midRow[0] ? (
            <CoreValuesCircle ref={div2Ref} title={midRow[0].title}>
              <img
                src={getImageUrl(midRow[0].icon)}
                alt={midRow[0].title}
                className="h-6 w-6 object-contain"
                loading="lazy"
              />
            </CoreValuesCircle>
          ) : (
            <div />
          )}

          <CoreValuesCircle
            ref={centerRef}
            className="size-16 bg-card"
            title="Core Values"
          >
            <span className="text-xs font-semibold tracking-wide text-heading-1">
              CORE
            </span>
          </CoreValuesCircle>

          {midRow[1] ? (
            <CoreValuesCircle ref={div6Ref} title={midRow[1].title}>
              <img
                src={getImageUrl(midRow[1].icon)}
                alt={midRow[1].title}
                className="h-6 w-6 object-contain"
                loading="lazy"
              />
            </CoreValuesCircle>
          ) : (
            <div />
          )}
        </div>

        <div className="flex flex-row items-center justify-between">
          {bottomRow[0] ? (
            <CoreValuesCircle ref={div3Ref} title={bottomRow[0].title}>
              <img
                src={getImageUrl(bottomRow[0].icon)}
                alt={bottomRow[0].title}
                className="h-6 w-6 object-contain"
                loading="lazy"
              />
            </CoreValuesCircle>
          ) : (
            <div />
          )}
          <div />
        </div>
      </div>

      {/* Beams */}
      {nodes[0] && (
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div1Ref}
          toRef={centerRef}
          curvature={75}
          endYOffset={-10}
        />
      )}
      {nodes[1] && (
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div5Ref}
          toRef={centerRef}
          curvature={-75}
          endYOffset={-10}
          reverse
        />
      )}
      {nodes[2] && (
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div2Ref}
          toRef={centerRef}
        />
      )}
      {nodes[3] && (
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div6Ref}
          toRef={centerRef}
          reverse
        />
      )}
      {nodes[5] && (
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={div3Ref}
          toRef={centerRef}
          curvature={-75}
          endYOffset={10}
        />
      )}
    </div>
  );
};

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

  const valuesCount = personalInfo.values.length;
  const isSparseValues = valuesCount <= 2;

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
              <p className="mt-6 text-body-var max-w-xl">
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
                  className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-xl text-body-var bg-card border border-card hover:border-[var(--brand-primary)] transform hover:scale-105 transition-all duration-300"
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
                    className="p-2.5 rounded-lg bg-card text-body-var hover-text-brand border border-card hover:border-[var(--brand-primary)] transition-all duration-300"
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
                          className="px-4 py-2 bg-card text-brand rounded-lg text-sm font-medium border border-card hover:border-[var(--brand-primary)] transition-all duration-300 hover:scale-105"
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
                    <h3 className="text-2xl font-bold text-heading-1 mb-8">
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

      {/* Core Values Section (separated) */}
      {personalInfo.values.length > 0 && (
        <section
          className="relative min-h-screen w-full flex items-center overflow-hidden"
          style={{
            background:
              preset === "professional"
                ? "radial-gradient(120% 100% at 50% 115%, rgba(13,26,54,0.95) 0%, rgba(13,26,54,0.55) 26%, rgba(0,0,0,1) 62%)"
                : preset === "girls"
                  ? "radial-gradient(120% 100% at 50% 115%, rgba(236,72,153,0.65) 0%, rgba(236,72,153,0.12) 28%, rgba(255,255,255,1) 62%)"
                  : preset === "boys"
                    ? "radial-gradient(120% 100% at 50% 115%, rgba(99,102,241,0.65) 0%, rgba(99,102,241,0.12) 28%, rgba(255,255,255,1) 62%)"
                    : "radial-gradient(120% 100% at 50% 115%, rgba(79,70,229,0.65) 0%, rgba(79,70,229,0.10) 28%, rgba(255,255,255,1) 62%)",
          }}
        >
          <div className="w-full px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                viewport={{ once: true }}
                className="mb-10"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-heading-1">
                  {t("about.coreValues")}
                </h2>
                <p className="mt-3 text-lg text-body-var max-w-2xl">
                  {t("home.coreValuesSubtitle") ||
                    t("home.cta.collaborateMessage")}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.05 }}
                viewport={{ once: true }}
                className="relative w-full rounded-2xl border border-card bg-card"
              >
                <div className="p-6 md:p-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    <div className="order-2 lg:order-1">
                      <div
                        className={
                          isSparseValues
                            ? "space-y-4"
                            : "space-y-4 max-h-[360px] overflow-auto scrollbar-themed pr-1"
                        }
                      >
                        {personalInfo.values.map((value, index) => (
                          <div
                            key={index}
                            className="group card card-hover p-5"
                          >
                            <div className="flex items-start gap-4">
                              <div className="shrink-0 w-11 h-11 p-2.5 rounded-xl brand-gradient text-white shadow-sm flex items-center justify-center">
                                <img
                                  src={getImageUrl(value.icon)}
                                  alt={value.title}
                                  className="w-full h-full object-contain"
                                  loading="lazy"
                                />
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-base font-semibold text-heading-1">
                                  {value.title}
                                </h3>
                                <p className="mt-1 text-body-var text-sm leading-relaxed">
                                  {value.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {!isSparseValues && (
                        <div className="relative mt-0">
                          <ProgressiveBlur position="bottom" height="35%" />
                        </div>
                      )}
                    </div>

                    <div className="order-1 lg:order-2">
                      <CoreValuesBeamDiagram
                        values={personalInfo.values}
                        getImageUrl={getImageUrl}
                      />
                      <p className="mt-4 text-sm text-muted">
                        {t("home.coreValuesHint") ||
                          "Each value connects back to how I work."}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{
          background:
            preset === "girls"
              ? "radial-gradient(120% 100% at 50% 115%, rgba(236,72,153,0.75) 0%, rgba(236,72,153,0.20) 28%, rgba(255,255,255,1) 62%)"
              : preset === "boys"
                ? "radial-gradient(120% 100% at 50% 115%, rgba(99,102,241,0.75) 0%, rgba(99,102,241,0.20) 28%, rgba(255,255,255,1) 62%)"
                : preset === "professional"
                  ? "radial-gradient(120% 100% at 50% 115%, rgba(13,26,54,0.95) 0%, rgba(13,26,54,0.55) 26%, rgba(0,0,0,1) 62%)"
                  : "radial-gradient(120% 100% at 50% 115%, rgba(79,70,229,0.75) 0%, rgba(79,70,229,0.18) 28%, rgba(255,255,255,1) 62%)",
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
            <p className="text-xl text-body-var mb-10">
              {t("home.cta.collaborateMessage")}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-xl btn-brand transition-colors duration-300"
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
