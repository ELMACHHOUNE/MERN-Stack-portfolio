import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Edit, Folder, X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface Category {
  _id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
}

const CategoryManager: React.FC = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
  });

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/categories/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok)
        throw new Error(t("categories.management.errors.fetchFailed"));
      const data = await response.json();
      setCategories(data);
    } catch {
      toast.error(t("categories.management.errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const categoryData = {
        ...formData,
        order: isEditing ? currentCategory?.order : categories.length,
      };

      const url = isEditing
        ? `${import.meta.env.VITE_API_URL}/categories/${currentCategory?._id}`
        : `${import.meta.env.VITE_API_URL}/categories`;
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok)
        throw new Error(t("categories.management.errors.saveFailed"));

      toast.success(
        isEditing
          ? t("categories.management.actions.updateSuccess")
          : t("categories.management.actions.addSuccess"),
      );
      resetForm();
      fetchCategories();
    } catch {
      toast.error(t("categories.management.errors.saveFailed"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("categories.management.actions.confirmDelete")))
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/categories/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok)
        throw new Error(t("categories.management.errors.deleteFailed"));

      toast.success(t("categories.management.actions.deleteSuccess"));
      fetchCategories();
    } catch {
      toast.error(t("categories.management.errors.deleteFailed"));
    }
  };

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "",
    });
    setCurrentCategory(null);
    setIsEditing(false);
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
            <Folder className="w-6 h-6 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-heading-1">
              {t("categories.management.title")}
            </h2>
            <p className="text-sm text-body-var">
              {t("categories.management.categoryList", {
                count: categories.length,
              })}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(false)}
          className="btn btn-brand flex items-center gap-2 shadow-sm hover:shadow"
        >
          <Plus className="w-5 h-5" />
          {t("categories.management.addCategory")}
        </button>
      </div>

      {/* Form Section */}
      <div className="card card-hover p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="label">
                {t("categories.management.form.title")}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="input"
                placeholder={t("categories.management.form.namePlaceholder")}
                required
              />
            </div>

            {/* Icon */}
            <div>
              <label className="label">
                {t("categories.management.form.iconUrl")}
              </label>
              <input
                type="url"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                className="input"
                placeholder={t("categories.management.form.iconUrlPlaceholder")}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label">
              {t("categories.management.form.description")}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="input resize-none"
              placeholder={t(
                "categories.management.form.descriptionPlaceholder",
              )}
              required
            />
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
                  {t("categories.management.addCategory")}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Categories List */}
      <div className="space-y-6">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Folder className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-body-var">
              {t("categories.management.noCategories")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category._id} className="group card card-hover p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {category.icon ? (
                      <img
                        src={category.icon}
                        alt={`${category.name} icon`}
                        className="w-6 h-6 object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <Folder className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-heading-1 truncate">
                        {category.name}
                      </h4>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-1 text-body-var hover-text-brand rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                          title={t("common.edit")}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="p-1 text-body-var hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                          title={t("common.delete")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-body-var line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
