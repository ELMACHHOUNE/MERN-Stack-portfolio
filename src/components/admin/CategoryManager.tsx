import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Edit } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface Category {
  _id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
}

const CategoryManager: React.FC = () => {
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
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to fetch categories");
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

      if (!response.ok) throw new Error("Failed to save category");

      toast.success(
        isEditing
          ? "Category updated successfully"
          : "Category added successfully"
      );
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error("Failed to save category");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete category");

      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
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

      if (!response.ok) throw new Error("Failed to reorder categories");
      toast.success("Categories reordered successfully");
    } catch (error) {
      toast.error("Failed to reorder categories");
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Categories
        </h2>
        <button
          onClick={resetForm}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Category
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Category Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="icon"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Icon URL
          </label>
          <input
            type="text"
            id="icon"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            placeholder="Enter icon URL (e.g., from devicons.dev)"
            required
          />
          {formData.icon && (
            <div className="mt-2 flex items-center space-x-2">
              <img
                src={formData.icon}
                alt="Icon preview"
                className="h-8 w-8"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  toast.error("Failed to load icon preview");
                }}
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Preview
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isEditing ? "Update Category" : "Add Category"}
          </button>
        </div>
      </form>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white p-6 border-b border-gray-200 dark:border-gray-700">
          Categories List
        </h3>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="categories">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="divide-y divide-gray-200 dark:divide-gray-700"
              >
                {categories.map((category, index) => (
                  <Draggable
                    key={category._id}
                    draggableId={category._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-6 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {category.icon && (
                              <img
                                src={category.icon}
                                alt={category.name}
                                className="h-8 w-8"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            )}
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                              {category.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {category.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(category._id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default CategoryManager;
