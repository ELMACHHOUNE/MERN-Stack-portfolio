import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAdminProfile } from "../context/AdminProfileContext";
import { useTheme } from "../context/ThemeContext";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { adminProfile } = useAdminProfile();
  const { preset } = useTheme();

  const footerBackground = (() => {
    switch (preset) {
      case "girls":
        return "radial-gradient(125% 125% at 50% 110%, #ffffff 40%, #ec4899 100%)";
      case "boys":
        return "radial-gradient(125% 125% at 50% 110%, #fff 40%, #6366f1 100%)";
      case "professional":
        return "radial-gradient(125% 125% at 50% 110%, #000000 40%, #0d1a36 100%)";
      default:
        return "radial-gradient(125% 125% at 50% 110%, #ffffff 40%, var(--brand-primary) 100%)";
    }
  })();

  const socialLinks = [
    {
      icon: <Github className="w-5 h-5" />,
      url: adminProfile?.socialLinks?.github,
      label: t("footer.socialLinks.github"),
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      url: adminProfile?.socialLinks?.linkedin,
      label: t("footer.socialLinks.linkedin"),
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      url: adminProfile?.socialLinks?.twitter,
      label: t("footer.socialLinks.twitter"),
    },
  ];

  return (
    <footer className="py-10 border-t" style={{ background: footerBackground }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-body-var">
              &copy; {new Date().getFullYear()}{" "}
              {adminProfile?.name || "Your Name"}. {t("footer.copyright")}
            </p>
          </div>
          <div className="flex space-x-6">
            {socialLinks.map((link, index) =>
              link.url ? (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-var hover-text-brand transition-colors duration-300"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ) : null,
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
