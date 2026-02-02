import React, { useEffect, useState } from "react";
import { useAdminProfile } from "../../context/AdminProfileContext";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "react-hot-toast";

interface ThemeSettings {
  primary: string;
  secondary: string;
  headingH1: string;
  headingH2: string;
  textBody: string;
  primaryHover: string;
  accent?: string;
  buttonBg?: string;
  buttonText?: string;
  buttonHoverBg?: string;
  cardBg?: string;
  cardBorder?: string;
  sidebarBg: string;
  sidebarText: string;
  sidebarActiveBg: string;
  sidebarActiveText: string;
  sidebarHoverBg?: string;
  sidebarHoverText?: string;
}

const ThemeManager: React.FC = () => {
  const { adminProfile, updateAdminProfile, isLoading } = useAdminProfile();
  const { applyTheme } = useTheme();
  const [theme, setTheme] = useState<ThemeSettings>({
    primary: "#4F46E5",
    secondary: "#9333EA",
    headingH1: "#111827",
    headingH2: "#1F2937",
    textBody: "#374151",
    primaryHover: "#4338CA",
    accent: "#10B981",
    buttonBg: "#4F46E5",
    buttonText: "#FFFFFF",
    buttonHoverBg: "#4338CA",
    cardBg: "#FFFFFF",
    cardBorder: "#E5E7EB",
    sidebarBg: "#FFFFFF",
    sidebarText: "#374151",
    sidebarActiveBg: "#E0E7FF",
    sidebarActiveText: "#4F46E5",
    sidebarHoverBg: "#F3F4F6",
    sidebarHoverText: "#4F46E5",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if ((adminProfile as any)?.theme) {
      const t = (adminProfile as any).theme as Partial<ThemeSettings>;
      const next = {
        primary: t.primary || theme.primary,
        secondary: t.secondary || theme.secondary,
        headingH1: t.headingH1 || theme.headingH1,
        headingH2: t.headingH2 || theme.headingH2,
        textBody: t.textBody || theme.textBody,
        primaryHover: (t as any).primaryHover || theme.primaryHover,
        accent: (t as any).accent || theme.accent!,
        buttonBg: (t as any).buttonBg || theme.buttonBg!,
        buttonText: (t as any).buttonText || theme.buttonText!,
        buttonHoverBg: (t as any).buttonHoverBg || theme.buttonHoverBg!,
        cardBg: (t as any).cardBg || theme.cardBg!,
        cardBorder: (t as any).cardBorder || theme.cardBorder!,
        sidebarBg: (t as any).sidebarBg || theme.sidebarBg,
        sidebarText: (t as any).sidebarText || theme.sidebarText,
        sidebarActiveBg: (t as any).sidebarActiveBg || theme.sidebarActiveBg,
        sidebarActiveText:
          (t as any).sidebarActiveText || theme.sidebarActiveText,
        sidebarHoverBg: (t as any).sidebarHoverBg || theme.sidebarHoverBg!,
        sidebarHoverText:
          (t as any).sidebarHoverText || theme.sidebarHoverText!,
      };
      setTheme(next);
      applyTheme(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminProfile]);

  const handleChange = (key: keyof ThemeSettings, value: string) => {
    const next = { ...theme, [key]: value };
    setTheme(next);
    applyTheme(next);
  };

  const saveTheme = async () => {
    try {
      setSaving(true);
      const updated = await updateAdminProfile({ theme });
      toast.success("Theme saved");
      if ((updated as any)?.theme) {
        applyTheme((updated as any).theme as any);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save theme");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-[#1B2333] rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Theme Settings
        </h2>
        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Primary Color</label>
              <input
                type="color"
                value={theme.primary}
                onChange={(e) => handleChange("primary", e.target.value)}
                className="w-20 h-10 p-0 border rounded"
                aria-label="Primary color"
              />
            </div>
            <div>
              <label className="label">Secondary Color</label>
              <input
                type="color"
                value={theme.secondary}
                onChange={(e) => handleChange("secondary", e.target.value)}
                className="w-20 h-10 p-0 border rounded"
                aria-label="Secondary color"
              />
            </div>
            <div>
              <label className="label">Primary Hover</label>
              <input
                type="color"
                value={theme.primaryHover}
                onChange={(e) => handleChange("primaryHover", e.target.value)}
                className="w-20 h-10 p-0 border rounded"
                aria-label="Primary hover color"
              />
            </div>
            <div>
              <label className="label">Accent Color</label>
              <input
                type="color"
                value={theme.accent}
                onChange={(e) => handleChange("accent", e.target.value)}
                className="w-20 h-10 p-0 border rounded"
                aria-label="Accent color"
              />
            </div>
            <div>
              <label className="label">Heading H1 Color</label>
              <input
                type="color"
                value={theme.headingH1}
                onChange={(e) => handleChange("headingH1", e.target.value)}
                className="w-20 h-10 p-0 border rounded"
                aria-label="Heading H1 color"
              />
            </div>
            <div>
              <label className="label">Heading H2 Color</label>
              <input
                type="color"
                value={theme.headingH2}
                onChange={(e) => handleChange("headingH2", e.target.value)}
                className="w-20 h-10 p-0 border rounded"
                aria-label="Heading H2 color"
              />
            </div>
            <div>
              <label className="label">Body Text Color</label>
              <input
                type="color"
                value={theme.textBody}
                onChange={(e) => handleChange("textBody", e.target.value)}
                className="w-20 h-10 p-0 border rounded"
                aria-label="Body text color"
              />
            </div>
            <div>
              <label className="label">Button Background</label>
              <input
                type="color"
                value={theme.buttonBg}
                onChange={(e) => handleChange("buttonBg", e.target.value)}
                className="w-20 h-10 p-0 border rounded"
                aria-label="Button background color"
              />
            </div>
            <div>
              <label className="label">Button Text</label>
              <input
                type="color"
                value={theme.buttonText}
                onChange={(e) => handleChange("buttonText", e.target.value)}
                className="w-20 h-10 p-0 border rounded"
                aria-label="Button text color"
              />
            </div>
            <div>
              <label className="label">Button Hover Background</label>
              <input
                type="color"
                value={theme.buttonHoverBg}
                onChange={(e) => handleChange("buttonHoverBg", e.target.value)}
                className="w-20 h-10 p-0 border rounded"
                aria-label="Button hover background color"
              />
            </div>
            <div>
              <label className="label">Card Background</label>
              <input
                type="color"
                value={theme.cardBg}
                onChange={(e) => handleChange("cardBg", e.target.value)}
                className="w-20 h-10 p-0 border rounded"
                aria-label="Card background color"
              />
            </div>
            <div>
              <label className="label">Card Border</label>
              <input
                type="color"
                value={theme.cardBorder}
                onChange={(e) => handleChange("cardBorder", e.target.value)}
                className="w-20 h-10 p-0 border rounded"
                aria-label="Card border color"
              />
            </div>
            <div>
              <label className="label">Sidebar Background</label>
              <input
                type="color"
                value={theme.sidebarBg}
                onChange={(e) => handleChange("sidebarBg", e.target.value)}
                className="w-20 h-10 p-0 border rounded"
                aria-label="Sidebar background color"
              />
            </div>
            <div>
              <label className="label">Sidebar Text</label>
              <input
                type="color"
                value={theme.sidebarText}
                onChange={(e) => handleChange("sidebarText", e.target.value)}
                className="w-20 h-10 p-0 border rounded"
                aria-label="Sidebar text color"
              />
            </div>
            <div>
              <label className="label">Sidebar Active Background</label>
              <input
                type="color"
                value={theme.sidebarActiveBg}
                onChange={(e) =>
                  handleChange("sidebarActiveBg", e.target.value)
                }
                className="w-20 h-10 p-0 border rounded"
                aria-label="Sidebar active background color"
              />
            </div>
            <div>
              <label className="label">Sidebar Active Text</label>
              <input
                type="color"
                value={theme.sidebarActiveText}
                onChange={(e) =>
                  handleChange("sidebarActiveText", e.target.value)
                }
                className="w-20 h-10 p-0 border rounded"
                aria-label="Sidebar active text color"
              />
            </div>
            <div>
              <label className="label">Sidebar Hover Background</label>
              <input
                type="color"
                value={theme.sidebarHoverBg}
                onChange={(e) => handleChange("sidebarHoverBg", e.target.value)}
                className="w-20 h-10 p-0 border rounded"
                aria-label="Sidebar hover background color"
              />
            </div>
            <div>
              <label className="label">Sidebar Hover Text</label>
              <input
                type="color"
                value={theme.sidebarHoverText}
                onChange={(e) =>
                  handleChange("sidebarHoverText", e.target.value)
                }
                className="w-20 h-10 p-0 border rounded"
                aria-label="Sidebar hover text color"
              />
            </div>
          </div>
        )}
        <div className="mt-6">
          <button
            type="button"
            className="btn btn-primary"
            disabled={saving}
            onClick={saveTheme}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#232B3B] rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Preview
        </h3>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-heading-1">Heading H1</h1>
          <h2 className="text-2xl font-semibold text-heading-2">Heading H2</h2>
          <p className="text-body-var">
            This is a sample paragraph showing the body text color.
          </p>
          <div className="h-16 rounded brand-gradient" />
          <div className="mt-4">
            <button className="btn-brand px-4 py-2 rounded-lg">
              Primary Button
            </button>
          </div>
          <div
            className="mt-4 rounded-lg p-4"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--card-border)",
            }}
          >
            <p className="text-body-var">
              Card preview using card background and border variables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeManager;
