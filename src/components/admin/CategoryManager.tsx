import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Edit, Folder } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/categories/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok)
        throw new Error(t("categories.management.errors.fetchFailed"));
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error(t("categories.management.errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const categoryData = {
        ...formData,
        order: isEditing ? currentCategory?.order : categories.length,
      };

      const url = isEditing
        ? `${API_URL}/api/categories/${currentCategory?._id}`
        : `${API_URL}/api/categories`;
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
          : t("categories.management.actions.addSuccess")
      );
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(t("categories.management.errors.saveFailed"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("categories.management.actions.confirmDelete")))
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error(t("categories.management.errors.deleteFailed"));

      toast.success(t("categories.management.actions.deleteSuccess"));
      fetchCategories();
    } catch (error) {
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

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the order property for each category
    const updatedCategories = items.map((category, index) => ({
      ...category,
      order: index,
    }));

    setCategories(updatedCategories);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/categories/admin/reorder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ categories: updatedCategories }),
      });

      if (!response.ok)
        throw new Error(t("categories.management.errors.reorderFailed"));
      toast.success(t("categories.management.actions.reorderSuccess"));
    } catch (error) {
      toast.error(t("categories.management.errors.reorderFailed"));
      fetchCategories(); // Revert to original order
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1F2937] py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/80 dark:bg-[#131B2C]/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
              {t("categories.management.title")}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {t("categories.management.addCategory")}
            </button>
          </div>

          <div className="space-y-8">
            {/* Add Category Form */}
            <div className="bg-white/50 dark:bg-[#1B2333]/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {isEditing
                  ? t("categories.management.editCategory")
                  : t("categories.management.addCategory")}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="categoryName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      {t("categories.management.form.title")}
                    </label>
                    <input
                      type="text"
                      id="categoryName"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder={t(
                        "categories.management.form.namePlaceholder"
                      )}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="categoryIcon"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      {t("categories.management.form.iconUrl")}
                    </label>
                    <input
                      type="url"
                      id="categoryIcon"
                      value={formData.icon}
                      onChange={(e) =>
                        setFormData({ ...formData, icon: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder={t(
                        "categories.management.form.iconUrlPlaceholder"
                      )}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="categoryDescription"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {t("categories.management.form.description")}
                  </label>
                  <textarea
                    id="categoryDescription"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder={t(
                      "categories.management.form.descriptionPlaceholder"
                    )}
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {t("common.cancel")}
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    {isEditing
                      ? t("categories.management.editCategory")
                      : t("categories.management.addCategory")}
                  </button>
                </div>
              </form>
            </div>

            {/* Categories List */}
            <div className="bg-white/50 dark:bg-[#1B2333]/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {t("categories.management.categoryList")}
              </h3>
              {categories.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 flex items-center justify-center">
                    <Folder className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t("categories.management.noCategories")}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className="group relative bg-white dark:bg-[#1E2A3B] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-500/50"
                    >
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleEdit(category)}
                          className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category._id)}
                          className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 flex items-center justify-center shadow-inner">
                            {category.icon ? (
                              <img
                                src={category.icon}
                                alt={`${category.name} icon`}
                                className="w-6 h-6 object-contain"
                              />
                            ) : (
                              <Folder className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                            )}
                          </div>
                        </div>

                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {category.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
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
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
