import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Edit, Folder } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/Card";
import Button from "../ui/Button";

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("categories.management.title")}
          </h2>
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Plus className="w-5 h-5" />}
            onClick={resetForm}
          >
            {t("categories.management.addCategory")}
          </Button>
        </div>

        {/* Add/Edit Category Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {isEditing
                ? t("categories.management.editCategory")
                : t("categories.management.addCategory")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="categoryName" className="label">
                    {t("categories.management.form.title")}
                  </label>
                  <input
                    type="text"
                    id="categoryName"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input"
                    placeholder={t(
                      "categories.management.form.namePlaceholder"
                    )}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="categoryIcon" className="label">
                    {t("categories.management.form.iconUrl")}
                  </label>
                  <input
                    type="url"
                    id="categoryIcon"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="input"
                    placeholder={t(
                      "categories.management.form.iconUrlPlaceholder"
                    )}
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="categoryDescription" className="label">
                  {t("categories.management.form.description")}
                </label>
                <textarea
                  id="categoryDescription"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="input resize-none"
                  placeholder={t(
                    "categories.management.form.descriptionPlaceholder"
                  )}
                  required
                />
              </div>
              <CardFooter>
                {isEditing && (
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    className="mr-4"
                  >
                    {t("common.cancel")}
                  </Button>
                )}
                <Button
                  variant="primary"
                  type="submit"
                  leftIcon={<Plus className="w-5 h-5" />}
                >
                  {isEditing
                    ? t("categories.management.editCategory")
                    : t("categories.management.addCategory")}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>

        {/* Categories List */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {t("categories.management.categoryList")}
          </h3>
          {categories.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <Folder className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  {t("categories.management.noCategories")}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card key={category._id} hover>
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                          {category.icon ? (
                            <img
                              src={category.icon}
                              alt={`${category.name} icon`}
                              className="w-6 h-6 object-contain"
                              loading="lazy"
                            />
                          ) : (
                            <Folder className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {category.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {category.description}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(category)}
                          className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          <Edit className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category._id)}
                          className="text-gray-400 hover:text-error-600 dark:hover:text-error-400"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
