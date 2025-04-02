import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Edit, Briefcase } from "lucide-react";

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
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
          Work Experience
        </h2>
        <button
          onClick={resetForm}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105 transform"
        >
          <Plus className="w-5 h-5" />
          Add Experience
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-white/50 to-white/30 dark:from-[#1B2333]/50 dark:to-[#1B2333]/30 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-800/50 space-y-6"
      >
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-500/50"
            required
          />
        </div>

        <div>
          <label
            htmlFor="position"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-500/50"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-500/50"
              required
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-500/50"
              disabled={formData.current}
              required={!formData.current}
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
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-[#1E2A3B] dark:checked:bg-blue-500"
          />
          <label
            htmlFor="current"
            className="ml-2 text-sm text-gray-700 dark:text-gray-300"
          >
            Current Position
          </label>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-500/50 resize-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="technologies"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-500/50"
            placeholder="React, Node.js, MongoDB, etc."
            required
          />
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
            {isEditing ? "Update Experience" : "Add Experience"}
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Experience List
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences && experiences.length > 0 ? (
            experiences.map((experience) => (
              <div
                key={experience._id}
                className="group relative bg-gradient-to-br from-white to-white/80 dark:from-[#1E2A3B] dark:to-[#1E2A3B]/80 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-500/50 hover:-translate-y-1 transform"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                  <button
                    onClick={() => handleEdit(experience)}
                    className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors hover:scale-110 transform inline-flex"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(experience._id)}
                    className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors hover:scale-110 transform inline-flex"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 flex items-center justify-center shadow-inner border border-blue-500/20 dark:border-blue-400/20">
                      <Briefcase className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {experience.position}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {experience.company}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(experience.startDate).toLocaleDateString()} -{" "}
                      {experience.current
                        ? "Present"
                        : new Date(experience.endDate).toLocaleDateString()}
                    </p>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      {experience.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {experience.technologies &&
                        experience.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          >
                            {tech}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 flex items-center justify-center border border-blue-500/20 dark:border-blue-400/20">
                <Briefcase className="w-8 h-8 text-blue-500 dark:text-blue-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                No experiences found. Add your first experience to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceManager;
