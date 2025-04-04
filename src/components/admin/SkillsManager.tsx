import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import { toast } from "react-hot-toast";
import {
  Plus,
  Trash2,
  Edit,
  Wrench,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

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
  const { t } = useLanguage();
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
        toast.error(t("common.error"));
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
        throw new Error(errorData.message || t("common.error"));
      }
      const data = await response.json();
      console.log("Received skills data:", data);
      setSkills(data);
    } catch (error) {
      console.error("Skills fetch error:", error);
      toast.error(error instanceof Error ? error.message : t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error(t("common.error"));
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
        throw new Error(errorData.message || t("common.error"));
      }
      const data = await response.json();
      console.log("Received categories data:", data);
      setCategories(data);
    } catch (error) {
      console.error("Categories fetch error:", error);
      toast.error(error instanceof Error ? error.message : t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error(t("common.error"));
        return;
      }

      if (!formData.name || !formData.category || !formData.icon) {
        toast.error(t("common.error"));
        return;
      }

      if (formData.level < 1 || formData.level > 10) {
        toast.error(t("skills.validation.levelRange"));
        return;
      }

      const skillData = {
        ...formData,
        order: isEditing ? currentSkill?.order : skills.length,
        level: Number(formData.level),
        icon: formData.icon.startsWith("http")
          ? formData.icon
          : `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${formData.name.toLowerCase()}/${formData.name.toLowerCase()}-original.svg`,
      };

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
        throw new Error(errorData.message || t("common.error"));
      }

      toast.success(
        isEditing
          ? t("skills.management.updateSuccess")
          : t("skills.management.addSuccess")
      );
      resetForm();
      fetchSkills();
    } catch (error) {
      console.error("Error saving skill:", error);
      toast.error(error instanceof Error ? error.message : t("common.error"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("skills.management.confirmDelete"))) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/skills/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(t("common.error"));

      toast.success(t("skills.management.deleteSuccess"));
      fetchSkills();
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const handleEdit = (skill: Skill) => {
    setCurrentSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category?._id || "",
      level: skill.level,
      icon: skill.icon.startsWith("http")
        ? skill.icon
        : `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${skill.name.toLowerCase()}/${skill.name.toLowerCase()}-original.svg`,
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
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      order: 0,
      isActive: true,
    });
    setIsEditing(false);
    setCurrentSkill(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Wrench className="w-6 h-6 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {t("skills.management.title")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("skills.management.subtitle", { count: skills.length })}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm hover:shadow"
        >
          <Plus className="w-5 h-5" />
          {t("skills.management.addSkill")}
        </button>
      </div>

      {/* Form Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("skills.management.name")}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("skills.management.category")}
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              >
                <option value="">
                  {t("skills.management.selectSkillsCategory")}
                </option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("skills.management.level")} (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("skills.management.icon")}
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                required
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t("skills.management.iconPlaceholder")}
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                {t("common.cancel")}
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <Edit className="w-4 h-4" />
                  {t("common.save")}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {t("skills.management.addSkill")}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Skills List */}
      <div className="space-y-6">
        {categories.map((category) => {
          const categorySkills = skills.filter(
            (skill) => skill.category && skill.category._id === category._id
          );
          if (categorySkills.length === 0) return null;

          return (
            <div
              key={category._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-6">
                {category.icon && (
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="w-5 h-5"
                      loading="lazy"
                    />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {category.name}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill) => (
                  <div
                    key={skill._id}
                    className="group bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      {skill.icon && (
                        <div className="p-2 bg-white dark:bg-gray-600 rounded-lg">
                          <img
                            src={skill.icon}
                            alt={skill.name}
                            className="w-6 h-6"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {skill.name}
                          </h4>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(skill)}
                              className="p-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                              title={t("common.edit")}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(skill._id)}
                              className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                              title={t("common.delete")}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                                style={{
                                  width: `${(skill.level / 10) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[2rem] text-right">
                              {skill.level}/10
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {skills.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Wrench className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              {t("skills.management.noSkills")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsManager;
