import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Edit } from "lucide-react";

interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
  icon: string;
  order: number;
}

const SkillCategories = ["Frontend", "Backend", "Database", "DevOps", "Other"];

const SkillsManager: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Frontend",
    level: 5,
    icon: "",
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/skills`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch skills");
      const data = await response.json();
      setSkills(data);
    } catch (error) {
      toast.error("Failed to fetch skills");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const skillData = {
        ...formData,
        order: isEditing ? currentSkill?.order : skills.length,
      };

      const url = isEditing
        ? `${API_URL}/api/skills/${currentSkill?._id}`
        : `${API_URL}/api/skills`;
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(skillData),
      });

      if (!response.ok) throw new Error("Failed to save skill");

      toast.success(
        isEditing ? "Skill updated successfully" : "Skill added successfully"
      );
      resetForm();
      fetchSkills();
    } catch (error) {
      toast.error("Failed to save skill");
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
      category: skill.category,
      level: skill.level,
      icon: skill.icon,
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "Frontend",
      level: 5,
      icon: "",
    });
    setCurrentSkill(null);
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

      <form onSubmit={handleSubmit} className="space-y-4">
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
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            required
          >
            {SkillCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Icon URL
          </label>
          <div className="mt-1 space-y-4">
            <div className="flex rounded-md shadow-sm">
              <input
                type="text"
                id="icon"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                placeholder="Enter icon URL"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                required
              />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <p>Suggested icon libraries:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <a
                    href="https://devicon.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Devicon
                  </a>{" "}
                  - Example URL:
                  https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg
                </li>
                <li>
                  <a
                    href="https://simpleicons.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Simple Icons
                  </a>{" "}
                  - Example URL: https://cdn.simpleicons.org/react
                </li>
                <li>
                  <a
                    href="https://icons8.com/icons/set/development"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Icons8
                  </a>{" "}
                  - Free development icons (requires attribution)
                </li>
              </ul>
            </div>
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
        </div>

        <div>
          <label
            htmlFor="level"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Proficiency Level (1-10)
          </label>
          <input
            type="number"
            id="level"
            min="1"
            max="10"
            value={formData.level}
            onChange={(e) => {
              const value =
                e.target.value === "" ? 1 : parseInt(e.target.value);
              setFormData({ ...formData, level: value });
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            required
          />
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

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Skills List
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SkillCategories.map((category) => (
            <div key={category} className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {category}
              </h4>
              <div className="space-y-2">
                {skills
                  .filter((skill) => skill.category === category)
                  .map((skill) => (
                    <div
                      key={skill._id}
                      className="bg-white dark:bg-gray-800 shadow rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {skill.icon && (
                              <img
                                src={skill.icon}
                                alt={skill.name}
                                className="h-6 w-6"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            )}
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                              {skill.name}
                            </h5>
                            <div className="mt-1">
                              <div className="flex items-center">
                                {[...Array(10)].map((_, index) => (
                                  <div
                                    key={index}
                                    className={`h-2 w-2 rounded-full mr-1 ${
                                      index < skill.level
                                        ? "bg-blue-500"
                                        : "bg-gray-200 dark:bg-gray-700"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(skill)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(skill._id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsManager;
