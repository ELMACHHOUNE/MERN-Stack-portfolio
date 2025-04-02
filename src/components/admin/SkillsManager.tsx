import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Edit } from "lucide-react";

interface Skill {
  _id: string;
  name: string;
  category: Category | null;
  level: number;
  icon: string;
  order: number;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  icon: string;
}

const SkillsManager: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    level: 5,
    icon: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchSkills();
    fetchCategories();
  }, []);

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }
      console.log(
        "Fetching skills with token:",
        token.substring(0, 10) + "..."
      );
      const response = await fetch(`${API_URL}/api/skills/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Skills fetch error:", errorData);
        throw new Error(errorData.message || "Failed to fetch skills");
      }
      const data = await response.json();
      console.log("Received skills data:", data);
      setSkills(data);
    } catch (error) {
      console.error("Skills fetch error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch skills"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }
      console.log(
        "Fetching categories with token:",
        token.substring(0, 10) + "..."
      );
      const response = await fetch(`${API_URL}/api/categories/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Categories fetch error:", errorData);
        throw new Error(errorData.message || "Failed to fetch categories");
      }
      const data = await response.json();
      console.log("Received categories data:", data);
      setCategories(data);
    } catch (error) {
      console.error("Categories fetch error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch categories"
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper function to validate icon URL/data
  const validateIcon = (icon: string) => {
    // Check if it's a valid URL
    try {
      new URL(icon);
      return true;
    } catch (e) {
      // Check if it's a valid base64 image
      if (icon.startsWith("data:image/")) {
        return true;
      }
      // Check if it's a relative path from our backend
      if (icon.startsWith("skill-icons/")) {
        return true;
      }
      return false;
    }
  };

  // Helper function to get full icon URL
  const getFullIconUrl = (iconPath: string) => {
    if (!iconPath) return "";
    if (iconPath.startsWith("http")) return iconPath;
    if (iconPath.startsWith("data:image/")) return iconPath;
    // If it's a relative path (e.g., skill-icons/...)
    if (iconPath.includes("skill-icons/")) {
      // Extract just the relative path if the full URL is present
      const match = iconPath.match(/skill-icons\/.*$/);
      const relativePath = match ? match[0] : iconPath;
      return `${API_URL}/${relativePath}`;
    }
    return `${API_URL}/${iconPath}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      // Log form data for debugging
      console.log("Form data before validation:", formData);

      // Validate required fields
      if (!formData.name || !formData.category || !formData.icon) {
        console.log("Validation failed:", {
          name: formData.name,
          category: formData.category,
          icon: formData.icon,
        });
        toast.error("Please fill in all required fields");
        return;
      }

      // Validate icon URL/data
      if (!validateIcon(formData.icon)) {
        toast.error("Please enter a valid image URL or base64 data");
        return;
      }

      // Validate level
      if (formData.level < 1 || formData.level > 10) {
        toast.error("Skill level must be between 1 and 10");
        return;
      }

      // If the icon is a full URL from our backend, extract just the relative path
      const iconUrl = formData.icon.includes("skill-icons/")
        ? formData.icon.match(/skill-icons\/.*$/)?.[0] || formData.icon
        : formData.icon;

      const skillData = {
        ...formData,
        icon: iconUrl,
        order: isEditing ? currentSkill?.order : skills.length,
        level: Number(formData.level),
      };

      console.log("Submitting skill data:", skillData);

      const url = isEditing
        ? `${API_URL}/api/skills/${currentSkill?._id}`
        : `${API_URL}/api/skills`;
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(skillData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error response:", errorData);
        throw new Error(errorData.message || "Failed to save skill");
      }

      toast.success(
        isEditing ? "Skill updated successfully" : "Skill added successfully"
      );
      resetForm();
      fetchSkills();
    } catch (error) {
      console.error("Error saving skill:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save skill"
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/skills/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete skill");

      toast.success("Skill deleted successfully");
      fetchSkills();
    } catch (error) {
      toast.error("Failed to delete skill");
    }
  };

  const handleEdit = (skill: Skill) => {
    setCurrentSkill(skill);
    // For editing, we want to show the relative path if it's a backend-stored image
    const iconUrl = skill.icon.includes("skill-icons/")
      ? skill.icon.match(/skill-icons\/.*$/)?.[0] || skill.icon
      : skill.icon;

    setFormData({
      name: skill.name,
      category: skill.category?._id || "",
      level: skill.level,
      icon: iconUrl,
      order: skill.order,
      isActive: true,
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      level: 5,
      icon: "",
      order: 0,
      isActive: true,
    });
    setIsEditing(false);
    setCurrentSkill(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
          Skills
        </h2>
        <button
          onClick={resetForm}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105 transform"
        >
          <Plus className="w-5 h-5" />
          Add Skill
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-white/50 to-white/30 dark:from-[#1B2333]/50 dark:to-[#1B2333]/30 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-800/50 space-y-6"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Skill Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-500/50"
            required
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Category
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => {
              console.log("Selected category:", e.target.value);
              setFormData({ ...formData, category: e.target.value });
            }}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-500/50"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {categories.length === 0 && (
            <p className="mt-2 text-sm text-red-500">
              No categories available. Please create a category first.
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="level"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Skill Level (1-10)
          </label>
          <input
            type="number"
            id="level"
            min="1"
            max="10"
            value={formData.level}
            onChange={(e) =>
              setFormData({ ...formData, level: parseInt(e.target.value) })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-500/50"
            required
          />
        </div>

        <div>
          <label
            htmlFor="icon"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Icon URL
          </label>
          <input
            type="text"
            id="icon"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-500/50"
            placeholder="Enter icon URL (e.g., from devicons.dev)"
            required
          />
          {formData.icon && (
            <div className="mt-2 flex items-center space-x-2">
              <div className="w-8 h-8 relative">
                <img
                  src={getFullIconUrl(formData.icon)}
                  alt="Icon preview"
                  className="h-8 w-8 object-contain"
                  onError={(e) => {
                    console.error(
                      `Failed to load icon preview: ${formData.icon}`
                    );
                    e.currentTarget.style.display = "none";
                    toast.error(
                      "Failed to load icon preview. Please check the URL."
                    );
                  }}
                  onLoad={(e) => {
                    e.currentTarget.style.display = "block";
                  }}
                />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Icon preview
              </span>
            </div>
          )}
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Tips for icons:
            <br />
            1. For tech icons, use{" "}
            <a
              href="https://devicon.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
            >
              devicon.dev
            </a>
            <br />
            Example:
            https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg
            <br />
            2. For other icons, use direct image URLs (PNG, SVG, or JPEG)
            <br />
            3. Make sure the icon has a transparent or matching background
          </p>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1E2A3B] hover:bg-gray-50 dark:hover:bg-[#242E42] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105 transform"
          >
            {isEditing ? "Update Skill" : "Add Skill"}
          </button>
        </div>
      </form>

      {/* Skills List */}
      <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-[#1B2333]/50 dark:to-[#1B2333]/30 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-800/50">
        {categories.map((category) => {
          const categorySkills = skills.filter(
            (skill) => skill.category && skill.category._id === category._id
          );
          if (categorySkills.length === 0) return null;

          return (
            <div key={category._id} className="mb-8 last:mb-0">
              <div className="flex items-center space-x-3 mb-6">
                {category.icon && (
                  <img
                    src={getFullIconUrl(category.icon)}
                    alt={category.name}
                    className="h-8 w-8 object-contain"
                    onError={(e) => {
                      console.error(
                        `Failed to load category icon: ${category.name}`
                      );
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {category.name}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill) => (
                  <div
                    key={skill._id}
                    className="group relative bg-white dark:bg-[#1E2A3B] rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-500/50 hover:-translate-y-1 transform"
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors hover:scale-110 transform inline-flex"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill._id)}
                        className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors hover:scale-110 transform inline-flex"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-4">
                      {skill.icon && (
                        <div className="w-8 h-8 relative flex items-center justify-center">
                          <img
                            src={getFullIconUrl(skill.icon)}
                            alt={skill.name}
                            className="h-8 w-8 object-contain"
                            onError={(e) => {
                              console.error(
                                `Failed to load icon for skill: ${skill.name}`
                              );
                              e.currentTarget.style.display = "none";
                            }}
                            onLoad={(e) => {
                              e.currentTarget.style.display = "block";
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          {skill.name}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                              style={{ width: `${(skill.level / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[2.5rem] text-right">
                            {skill.level}/10
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillsManager;
