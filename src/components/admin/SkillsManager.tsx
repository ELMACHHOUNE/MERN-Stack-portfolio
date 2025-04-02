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

      // Validate level
      if (formData.level < 1 || formData.level > 10) {
        toast.error("Skill level must be between 1 and 10");
        return;
      }

      const skillData = {
        ...formData,
        order: isEditing ? currentSkill?.order : skills.length,
        level: Number(formData.level), // Ensure level is a number
      };

      const url = isEditing
        ? `${API_URL}/api/skills/${currentSkill?._id}`
        : `${API_URL}/api/skills`;
      const method = isEditing ? "PATCH" : "POST";

      console.log("Submitting skill data:", skillData);

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
    setFormData({
      name: skill.name,
      category: skill.category?._id || "",
      level: skill.level,
      icon: skill.icon,
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Skills
        </h2>
        <button
          onClick={resetForm}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Skill
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
            Skill Name
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
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
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
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                Icon preview
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
            {isEditing ? "Update Skill" : "Add Skill"}
          </button>
        </div>
      </form>

      {/* Skills List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        {categories.map((category) => {
          const categorySkills = skills.filter(
            (skill) => skill.category && skill.category._id === category._id
          );
          if (categorySkills.length === 0) return null;

          return (
            <div key={category._id} className="mb-8 last:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                {category.icon && (
                  <img
                    src={category.icon}
                    alt={category.name}
                    className="h-6 w-6"
                  />
                )}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {category.name}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill) => (
                  <div
                    key={skill._id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {skill.icon && (
                        <img
                          src={skill.icon}
                          alt={skill.name}
                          className="h-6 w-6"
                        />
                      )}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {skill.name}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${(skill.level / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {skill.level}/10
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="p-1 text-gray-400 hover:text-blue-500 focus:outline-none"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill._id)}
                        className="p-1 text-gray-400 hover:text-red-500 focus:outline-none"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
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
