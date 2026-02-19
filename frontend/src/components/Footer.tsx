import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAdminProfile } from "../context/AdminProfileContext";
import { useTheme } from "../context/ThemeContext";
import {
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { adminProfile } = useAdminProfile();
  const { preset } = useTheme();

  const footerBackground = (() => {
    switch (preset) {
      case "girls":
        return "radial-gradient(120% 100% at 50% 115%, rgba(236,72,153,0.75) 0%, rgba(236,72,153,0.20) 28%, rgba(255,255,255,1) 62%)";
      case "boys":
        return "radial-gradient(120% 100% at 50% 115%, rgba(99,102,241,0.75) 0%, rgba(99,102,241,0.20) 28%, rgba(255,255,255,1) 62%)";
      case "professional":
        return "radial-gradient(120% 100% at 50% 115%, rgba(13,26,54,0.95) 0%, rgba(13,26,54,0.55) 26%, rgba(0,0,0,1) 62%)";
      default:
        return "radial-gradient(120% 100% at 50% 115%, rgba(79,70,229,0.75) 0%, rgba(79,70,229,0.18) 28%, rgba(255,255,255,1) 62%)";
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
  ];

  const footerLinks = [
    { to: "/about", label: t("navbar.menu.about") || "About" },
    { to: "/projects", label: t("navbar.menu.projects") || "Projects" },
    { to: "/contact", label: t("navbar.menu.contact") || "Contact" },
    {
      to: "/experience",
      label: t("navbar.menu.experience") || "Experience",
    },
  ];

  return (
    <footer
      className="border-t border-card py-10"
      style={{ background: footerBackground }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-card bg-card p-8 md:p-10 text-center space-y-8">
          <nav className="grid grid-flow-row sm:grid-flow-col justify-center gap-3 sm:gap-8">
            {footerLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-body-var hover-text-brand text-sm md:text-base font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <nav>
            <div className="grid grid-flow-col justify-center gap-3 md:gap-4">
              {socialLinks.map((link, index) =>
                link.url ? (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl border border-card bg-card text-body-var hover-text-brand hover:border-[var(--brand-primary)] transition-all duration-300 flex items-center justify-center"
                    aria-label={link.label}
                  >
                    {link.icon}
                  </a>
                ) : null,
              )}
            </div>
          </nav>

          <aside>
            <p className="text-sm text-body-var">
              &copy; {new Date().getFullYear()}{" "}
              {adminProfile?.name || "Your Name"}. {t("footer.copyright")}
            </p>
          </aside>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
