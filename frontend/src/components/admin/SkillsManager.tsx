import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Edit, Wrench, X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface Skill {
  _id: string;
  name: string;
  category: string | Category;
  level: number;
  icon: string;
  order: number;
  isActive: boolean;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
}

interface FormData {
  name: string;
  category: string;
  level: number;
  icon: string;
  order: number;
  isActive: boolean;
}

const SkillsManager: React.FC = () => {
  const { t } = useLanguage();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "",
    level: 5,
    icon: "",
    order: 0,
    isActive: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imageSource, setImageSource] = useState<"url" | "file">("url");

  const fetchSkills = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error(t("common.error"));
        return;
      }
      console.log(
        "Fetching skills with token:",
        token.substring(0, 10) + "...",
      );
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/skills/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
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
  }, [t]);
  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error(t("common.error"));
        return;
      }
      console.log(
        "Fetching categories with token:",
        token.substring(0, 10) + "...",
      );
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/categories/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
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
  }, [t]);

  useEffect(() => {
    fetchSkills();
    fetchCategories();
  }, [fetchSkills, fetchCategories]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);

      // Update form data with the file name
      setFormData((prev) => ({
        ...prev,
        icon: file.name,
      }));
    }
  };

  const handleIconUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      icon: e.target.value,
    }));
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleImageSourceChange = (source: "url" | "file") => {
    setImageSource(source);
    if (source === "url") {
      setSelectedFile(null);
      setPreviewUrl("");
    } else {
      setFormData((prev) => ({
        ...prev,
        icon: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (
        !formData.name ||
        !formData.category ||
        !formData.level ||
        formData.order === undefined ||
        (!formData.icon && !selectedFile)
      ) {
        toast.error(t("skills.management.errors.requiredFields"));
        return;
      }

      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      // Add file if selected
      if (selectedFile) {
        formDataToSend.append("icon", selectedFile);
        formDataToSend.append("iconSource", "file");
      } else if (formData.icon) {
        formDataToSend.append("icon", formData.icon);
        formDataToSend.append("iconSource", "url");
      }

      // Add all required fields with proper validation
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("category", formData.category);
      formDataToSend.append("level", formData.level.toString());
      formDataToSend.append("order", formData.order.toString());
      formDataToSend.append("isActive", formData.isActive.toString());

      const url = isEditing
        ? `${import.meta.env.VITE_API_URL}/skills/${currentSkill?._id}`
        : `${import.meta.env.VITE_API_URL}/skills`;
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || t("skills.management.errors.saveFailed"),
        );
      }

      const savedSkill = await response.json();

      toast.success(
        isEditing
          ? t("skills.management.actions.updateSuccess")
          : t("skills.management.actions.addSuccess"),
      );

      // Update the form data with the saved skill's icon path
      if (savedSkill.icon) {
        setFormData((prev) => ({
          ...prev,
          icon: savedSkill.icon,
        }));
        // If it's a file upload, update the preview URL
        if (savedSkill.icon.startsWith("/uploads/")) {
          setPreviewUrl(`${import.meta.env.VITE_API_URL}${savedSkill.icon}`);
        }
      }

      resetForm();
      fetchSkills();
    } catch (error: any) {
      console.error("Error saving skill:", error);
      toast.error(error.message || t("skills.management.errors.saveFailed"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("skills.management.confirmDelete"))) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/skills/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error(t("common.error"));

      toast.success(t("skills.management.deleteSuccess"));
      fetchSkills();
    } catch {
      toast.error(t("common.error"));
    }
  };

  const handleEdit = (skill: Skill) => {
    setCurrentSkill(skill);
    setFormData({
      name: skill.name || "",
      category:
        typeof skill.category === "string"
          ? skill.category
          : skill.category._id,
      level: skill.level || 5,
      icon: skill.icon || "",
      order: skill.order || 0,
      isActive: skill.isActive ?? true,
    });
    setIsEditing(true);
    setImageSource(skill.icon?.startsWith("/uploads/") ? "file" : "url");
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
    setSelectedFile(null);
    setPreviewUrl("");
    setImageSource("url");
    setCurrentSkill(null);
    setIsEditing(false);
  };

  const getIconUrl = (iconPath: string) => {
    if (!iconPath) return "/placeholder-icon.png";
    if (iconPath.startsWith("http")) return iconPath;
    if (iconPath.startsWith("/uploads/")) {
      return `${import.meta.env.VITE_API_URL.replace(
        /\/?api\/?$/,
        "",
      )}${iconPath}`;
    }
    return iconPath;
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
            <h2 className="text-2xl font-bold text-heading-1">
              {t("skills.management.title")}
            </h2>
            <p className="text-sm text-body-var">
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
      <div className="card card-hover p-6">
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
                className="input"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="label">{t("skills.management.category")}</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="input"
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
              <label className="label">
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
                className="input"
                required
              />
            </div>

            {/* Icon */}
            <div>
              <label className="label">{t("skills.management.icon")}</label>

              {/* Image Source Toggle */}
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => handleImageSourceChange("url")}
                  className={`btn ${
                    imageSource === "url" ? "btn-brand" : "btn-outline"
                  }`}
                >
                  {t("skills.management.form.iconUrl")}
                </button>
                <button
                  type="button"
                  onClick={() => handleImageSourceChange("file")}
                  className={`btn ${
                    imageSource === "file" ? "btn-brand" : "btn-outline"
                  }`}
                >
                  {t("skills.management.form.uploadIcon")}
                </button>
              </div>

              {/* Icon Input Fields */}
              <div className="space-y-4">
                {imageSource === "url" ? (
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={handleIconUrlChange}
                    placeholder={t("skills.management.form.iconUrlPlaceholder")}
                    className="input"
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="input"
                  />
                )}

                {/* Icon Preview */}
                {(previewUrl || formData.icon) && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-body-var mb-2">
                      {t("skills.management.form.iconPreview")}
                    </h4>
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={previewUrl || getIconUrl(formData.icon)}
                        alt="Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.error("Icon load error:", e);
                          const target = e.target as HTMLImageElement;
                          target.src = "/assets/placeholder-icon.png";
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-outline flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                {t("common.cancel")}
              </button>
            )}
            <button
              type="submit"
              className="btn btn-brand flex items-center gap-2"
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
          const categorySkills = skills.filter((skill) => {
            if (!skill.category) return false;
            if (typeof skill.category === "string") {
              return skill.category === category._id;
            }
            return (skill.category as Category)._id === category._id;
          });
          if (categorySkills.length === 0) return null;

          return (
            <div key={category._id} className="card card-hover p-6">
              <div className="flex items-center gap-3 mb-6">
                {category.icon && (
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <img
                      src={getIconUrl(category.icon)}
                      alt={category.name}
                      className="w-5 h-5"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/uploads/placeholder-icon.png";
                      }}
                    />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-heading-1">
                  {category.name}
                </h3>
              </div>

              <div className="space-y-4">
                {categorySkills.map((skill) => (
                  <div
                    key={skill._id}
                    className="group bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white dark:bg-gray-600 rounded-lg">
                        <img
                          src={getIconUrl(skill.icon)}
                          alt={skill.name}
                          className="w-6 h-6 object-contain"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/assets/placeholder-icon.png";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-heading-1 truncate">
                            {skill.name}
                          </h4>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(skill)}
                              className="p-1 text-body-var hover-text-brand rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                              title={t("common.edit")}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(skill._id)}
                              className="p-1 text-body-var hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
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
                            <span className="text-xs font-medium text-body-var min-w-[2rem] text-right">
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
            <p className="text-body-var">{t("skills.management.noSkills")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsManager;
