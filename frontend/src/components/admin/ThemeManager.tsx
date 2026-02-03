import React, { useEffect, useState } from "react";
import { useAdminProfile } from "../../context/AdminProfileContext";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "react-hot-toast";

type ThemePreset = "girls" | "boys" | "professional";

const ThemeManager: React.FC = () => {
  const { adminProfile, updateAdminProfile, isLoading } = useAdminProfile();
  const { preset, setPreset, applyPreset } = useTheme();
  const [selectedPreset, setSelectedPreset] = useState<ThemePreset>(
    preset === "custom" ? "professional" : (preset as ThemePreset),
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if ((adminProfile as any)?.theme) {
      const p = (adminProfile as any).theme?.preset as
        | ThemePreset
        | "custom"
        | undefined;
      const effectivePreset: ThemePreset =
        p && p !== "custom" ? p : "professional";
      setSelectedPreset(effectivePreset);
      setPreset(effectivePreset);
      applyPreset(effectivePreset);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminProfile]);

  const saveTheme = async () => {
    try {
      setSaving(true);
      const updated = await updateAdminProfile({
        theme: { preset: selectedPreset },
      });
      toast.success("Theme saved");
      if ((updated as any)?.theme?.preset) {
        applyPreset((updated as any).theme.preset as ThemePreset);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save theme");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Theme Settings
        </h2>
        {isLoading ? (
          <div className="card flex items-center gap-3 p-4">
            <span
              className="inline-block h-5 w-5 rounded-full animate-spin"
              aria-hidden="true"
              style={{
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: "var(--brand-primary)",
                borderTopColor: "transparent",
              }}
            />
            <span className="text-body-var">Loading theme…</span>
          </div>
        ) : (
          <div>
            <label className="label">Theme Preset</label>
            <select
              className="input w-full max-w-xs"
              value={selectedPreset}
              onChange={(e) => {
                const p = e.target.value as ThemePreset;
                setSelectedPreset(p);
                applyPreset(p);
              }}
            >
              <option value="girls">Girls</option>
              <option value="boys">Boys</option>
              <option value="professional">Professional</option>
            </select>
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
    </div>
  );
};

export default ThemeManager;
