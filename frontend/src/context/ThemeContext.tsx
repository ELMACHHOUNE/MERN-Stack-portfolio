import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../utils/api";

// Light-only mode: dark/light support removed
type Theme = "light";
type ThemePreset = "girls" | "boys" | "professional" | "custom";

interface ThemeContextType {
  theme: Theme;
  applyTheme: (_: ThemeSettings) => void;
  preset: ThemePreset;
  setPreset: (_: ThemePreset) => void;
  applyPreset: (_: ThemePreset) => void;
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
  const theme: Theme = "light";

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

  const [preset, setPreset] = useState<ThemePreset>(() => {
    const savedPreset = localStorage.getItem(
      "themePreset",
    ) as ThemePreset | null;
    return savedPreset || "custom";
  });

  const getPresetTheme = (p: ThemePreset): ThemeSettings => {
    const baseLight = {
      headingH1: "#111827",
      headingH2: "#1F2937",
      textBody: "#374151",
      cardBg: "#FFFFFF",
      cardBorder: "#E5E7EB",
      sidebarBg: "#FFFFFF",
      sidebarText: "#374151",
    };
    const base = baseLight;

    switch (p) {
      case "girls": {
        const primary = "#ec4899";
        const secondary = "#a78bfa";
        const primaryHover = "#d946ef";
        const accent = "#f472b6";
        return {
          ...base,
          primary,
          secondary,
          primaryHover,
          accent,
          buttonBg: primary,
          buttonText: "#FFFFFF",
          buttonHoverBg: primaryHover,
          sidebarActiveBg: "#FCE7F3",
          sidebarActiveText: primary,
          sidebarHoverBg: "#F9A8D4",
          sidebarHoverText: primary,
        };
      }
      case "boys": {
        const primary = "#3b82f6";
        const secondary = "#06b6d4";
        const primaryHover = "#2563eb";
        const accent = "#10b981";
        return {
          ...base,
          primary,
          secondary,
          primaryHover,
          accent,
          buttonBg: primary,
          buttonText: "#FFFFFF",
          buttonHoverBg: primaryHover,
          sidebarActiveBg: "#DBEAFE",
          sidebarActiveText: primary,
          sidebarHoverBg: "#BFDBFE",
          sidebarHoverText: primary,
        };
      }
      case "professional": {
        const primary = "#0ea5e9";
        const secondary = "#64748b";
        const primaryHover = "#0284c7";
        const accent = "#22d3ee";
        return {
          ...base,
          primary,
          secondary,
          primaryHover,
          accent,
          buttonBg: "#111827",
          buttonText: "#FFFFFF",
          buttonHoverBg: "#0F172A",
          sidebarActiveBg: "#F1F5F9",
          sidebarActiveText: "#0F172A",
          sidebarHoverBg: "#E5E7EB",
          sidebarHoverText: primary,
        };
      }
      default: {
        return {
          ...base,
          primary: "#4F46E5",
          secondary: "#9333EA",
          primaryHover: "#4338CA",
          accent: "#10B981",
          buttonBg: "#4F46E5",
          buttonText: "#FFFFFF",
          buttonHoverBg: "#4338CA",
          sidebarActiveBg: "#E0E7FF",
          sidebarActiveText: "#4F46E5",
          sidebarHoverBg: "#F3F4F6",
          sidebarHoverText: "#4F46E5",
        };
      }
    }
  };

  const applyPreset = (p: ThemePreset) => {
    setPreset(p);
    localStorage.setItem("themePreset", p);
    const settings = getPresetTheme(p);
    applyTheme(settings);
  };

  // Fetch theme and preset once on mount
  useEffect(() => {
    // Fetch public theme from admin profile
    (async () => {
      try {
        const res = await api.get("/settings/public-profile");
        const data: any = res.data || {};
        const t = (data.theme || {}) as Partial<ThemeSettings> & {
          preset?: ThemePreset;
        };
        const p: ThemePreset = t.preset || "custom";
        setPreset(p);
        localStorage.setItem("themePreset", p);
        if (p !== "custom") {
          const settings = getPresetTheme(p);
          applyTheme(settings);
        } else {
          const settings: ThemeSettings = {
            primary: t.primary || "#4F46E5",
            secondary: t.secondary || "#9333EA",
            headingH1: t.headingH1 || "#111827",
            headingH2: t.headingH2 || "#1F2937",
            textBody: t.textBody || "#374151",
            primaryHover: t.primaryHover || "#4338CA",
            accent: t.accent || "#10B981",
            buttonBg: t.buttonBg || t.primary || "#4F46E5",
            buttonText: t.buttonText || "#FFFFFF",
            buttonHoverBg: t.buttonHoverBg || t.primaryHover || "#4338CA",
            cardBg: t.cardBg || "#FFFFFF",
            cardBorder: t.cardBorder || "#E5E7EB",
            sidebarBg: t.sidebarBg || "#FFFFFF",
            sidebarText: t.sidebarText || "#374151",
            sidebarActiveBg: t.sidebarActiveBg || "#E0E7FF",
            sidebarActiveText: t.sidebarActiveText || t.primary || "#4F46E5",
            sidebarHoverBg: t.sidebarHoverBg || "#F3F4F6",
            sidebarHoverText: t.sidebarHoverText || t.primary || "#4F46E5",
          };
          applyTheme(settings);
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  // Reapply preset when preset changes
  useEffect(() => {
    if (preset !== "custom") {
      const s = getPresetTheme(preset);
      applyTheme(s);
    }
  }, [preset]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        applyTheme,
        preset,
        setPreset,
        applyPreset,
      }}
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
