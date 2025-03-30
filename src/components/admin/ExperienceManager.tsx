import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Edit } from "lucide-react";

interface Experience {
  _id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  technologies: string[];
}

const ExperienceManager: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(
    null
  );
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    technologies: "",
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await fetch(`${API_URL}/api/experience/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch experiences");
      }
      const data = await response.json();
      setExperiences(data || []);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch experiences"
      );
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const experienceData = {
        ...formData,
        technologies: formData.technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean),
        ...(formData.current && { endDate: undefined }),
      };

      const url = isEditing
        ? `${API_URL}/api/experience/${currentExperience?._id}`
        : `${API_URL}/api/experience`;
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(experienceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save experience");
      }

      toast.success(
        isEditing
          ? "Experience updated successfully"
          : "Experience added successfully"
      );
      resetForm();
      fetchExperiences();
    } catch (error) {
      console.error("Error saving experience:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save experience"
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this experience?"))
      return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await fetch(`${API_URL}/api/experience/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete experience");
      }

      toast.success("Experience deleted successfully");
      fetchExperiences();
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete experience"
      );
    }
  };

  const handleEdit = (experience: Experience) => {
    setCurrentExperience(experience);
    setFormData({
      company: experience.company,
      position: experience.position,
      startDate: experience.startDate,
      endDate: experience.endDate,
      current: experience.current,
      description: experience.description,
      technologies: experience.technologies?.join(", ") || "",
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      technologies: "",
    });
    setCurrentExperience(null);
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
          Work Experience
        </h2>
        <button
          onClick={resetForm}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Experience
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Company
          </label>
          <input
            type="text"
            id="company"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="position"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Position
          </label>
          <input
            type="text"
            id="position"
            value={formData.position}
            onChange={(e) =>
              setFormData({ ...formData, position: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              required
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              required
              disabled={formData.current}
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="current"
            checked={formData.current}
            onChange={(e) =>
              setFormData({ ...formData, current: e.target.checked })
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600"
          />
          <label
            htmlFor="current"
            className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
          >
            Current Position
          </label>
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
            htmlFor="technologies"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Technologies (comma-separated)
          </label>
          <input
            type="text"
            id="technologies"
            value={formData.technologies}
            onChange={(e) =>
              setFormData({ ...formData, technologies: e.target.value })
            }
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
            {isEditing ? "Update Experience" : "Add Experience"}
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Experience List
        </h3>
        <div className="space-y-4">
          {experiences && experiences.length > 0 ? (
            experiences.map((experience) => (
              <div
                key={experience._id}
                className="bg-white dark:bg-gray-800 shadow rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {experience.position}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {experience.company}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(experience.startDate).toLocaleDateString()} -{" "}
                      {experience.current
                        ? "Present"
                        : new Date(experience.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(experience)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(experience._id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {experience.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {experience.technologies &&
                    experience.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {tech}
                      </span>
                    ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No experiences found. Add your first experience to get started.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceManager;
