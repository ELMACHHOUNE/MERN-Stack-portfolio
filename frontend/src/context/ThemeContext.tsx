import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../utils/api";

type Theme = "dark" | "light";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme: Theme;
  applyTheme: (_: ThemeSettings) => void;
}

interface ThemeSettings {
  primary: string;
  secondary: string;
  headingH1: string;
  headingH2: string;
  textBody: string;
  primaryHover?: string;
  accent?: string;
  buttonBg?: string;
  buttonText?: string;
  buttonHoverBg?: string;
  cardBg?: string;
  cardBorder?: string;
  sidebarBg?: string;
  sidebarText?: string;
  sidebarActiveBg?: string;
  sidebarActiveText?: string;
  sidebarHoverBg?: string;
  sidebarHoverText?: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const isDarkMode = theme === "dark";

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme, isDarkMode]);

  const toggleDarkMode = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const applyTheme = (t: ThemeSettings) => {
    const root = document.documentElement;
    root.style.setProperty("--brand-primary", t.primary);
    root.style.setProperty("--brand-secondary", t.secondary);
    root.style.setProperty("--heading-h1", t.headingH1);
    root.style.setProperty("--heading-h2", t.headingH2);
    root.style.setProperty("--text-body", t.textBody);
    root.style.setProperty(
      "--brand-primary-hover",
      t.primaryHover || "#4338CA",
    );
    root.style.setProperty("--brand-accent", t.accent || "#10B981");
    root.style.setProperty("--button-bg", t.buttonBg || t.primary);
    root.style.setProperty("--button-text", t.buttonText || "#FFFFFF");
    root.style.setProperty(
      "--button-hover-bg",
      t.buttonHoverBg || t.primaryHover || "#4338CA",
    );
    root.style.setProperty("--card-bg", t.cardBg || "#FFFFFF");
    root.style.setProperty("--card-border", t.cardBorder || "#E5E7EB");
    root.style.setProperty("--bg-sidebar", t.sidebarBg || "#FFFFFF");
    root.style.setProperty("--sidebar-text", t.sidebarText || "#374151");
    root.style.setProperty(
      "--sidebar-active-bg",
      t.sidebarActiveBg || "#E0E7FF",
    );
    root.style.setProperty(
      "--sidebar-active-text",
      t.sidebarActiveText || t.primary || "#4F46E5",
    );
    root.style.setProperty("--sidebar-hover-bg", t.sidebarHoverBg || "#F3F4F6");
    root.style.setProperty(
      "--sidebar-hover-text",
      t.sidebarHoverText || t.primary || "#4F46E5",
    );
  };

  useEffect(() => {
    // Fetch public theme from admin profile
    (async () => {
      try {
        const res = await api.get("/settings/public-profile");
        const data: any = res.data || {};
        const theme = (data.theme || {}) as Partial<ThemeSettings>;
        const settings: ThemeSettings = {
          primary: theme.primary || "#4F46E5",
          secondary: theme.secondary || "#9333EA",
          headingH1: theme.headingH1 || "#111827",
          headingH2: theme.headingH2 || "#1F2937",
          textBody: theme.textBody || "#374151",
          primaryHover: theme.primaryHover || "#4338CA",
          accent: theme.accent || "#10B981",
          buttonBg: theme.buttonBg || theme.primary || "#4F46E5",
          buttonText: theme.buttonText || "#FFFFFF",
          buttonHoverBg: theme.buttonHoverBg || theme.primaryHover || "#4338CA",
          cardBg: theme.cardBg || "#FFFFFF",
          cardBorder: theme.cardBorder || "#E5E7EB",
          sidebarBg: theme.sidebarBg || "#FFFFFF",
          sidebarText: theme.sidebarText || "#374151",
          sidebarActiveBg: theme.sidebarActiveBg || "#E0E7FF",
          sidebarActiveText:
            theme.sidebarActiveText || theme.primary || "#4F46E5",
          sidebarHoverBg: theme.sidebarHoverBg || "#F3F4F6",
          sidebarHoverText:
            theme.sidebarHoverText || theme.primary || "#4F46E5",
        };
        applyTheme(settings);
      } catch {
        // ignore
      }
    })();
  }, []);

  return (
    <ThemeContext.Provider
      value={{ isDarkMode, toggleDarkMode, theme, applyTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
