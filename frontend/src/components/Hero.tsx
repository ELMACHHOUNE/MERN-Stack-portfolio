import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAdminProfile } from "../context/AdminProfileContext";

interface SocialLink {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const { adminProfile } = useAdminProfile();

  const socialLinks: SocialLink[] = [
    {
      href: adminProfile?.socialLinks?.github || "#",
      icon: <Github className="h-6 w-6" />,
      label: t("about.socialLinks.github"),
    },
    {
      href: adminProfile?.socialLinks?.linkedin || "#",
      icon: <Linkedin className="h-6 w-6" />,
      label: t("about.socialLinks.linkedin"),
    },
    {
      href: adminProfile?.socialLinks?.twitter || "#",
      icon: <Twitter className="h-6 w-6" />,
      label: t("about.socialLinks.twitter"),
    },
    {
      href: adminProfile?.socialLinks?.gmail || "#",
      icon: <Mail className="h-6 w-6" />,
      label: t("about.socialLinks.gmail"),
    },
  ];

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          style={{ backgroundColor: "var(--brand-primary)" }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          style={{ backgroundColor: "var(--brand-secondary)" }}
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-heading-1 mb-6">
            {adminProfile?.name || t("home.hero.title")}
          </h1>
          <p className="text-xl sm:text-2xl text-body-var mb-8">
            {adminProfile?.title || t("home.hero.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-center space-x-6"
        >
          {socialLinks.map(
            (link) =>
              link.href !== "#" && (
                <motion.a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-var hover-text-brand transition-colors duration-300"
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={link.label}
                >
                  {link.icon}
                </motion.a>
              ),
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12"
        >
          <motion.a
            href="#about"
            className="inline-flex items-center text-body-var hover-text-brand transition-colors duration-300"
            whileHover={{ y: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-2">{t("home.hero.scrollDown")}</span>
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
