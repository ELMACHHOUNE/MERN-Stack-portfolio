import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Edit, Briefcase, Calendar, X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

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
  const { t } = useLanguage();
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
        toast.error(t("experience.management.errors.authError"));
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/experience/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || t("experience.management.errors.fetchFailed")
        );
      }
      const data = await response.json();
      setExperiences(data || []);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : t("experience.management.errors.fetchFailed")
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
        toast.error(t("experience.management.errors.authError"));
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
        ? `${import.meta.env.VITE_API_URL}/experience/${
            currentExperience?._id
          }`
        : `${import.meta.env.VITE_API_URL}/experience`;
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
        throw new Error(
          errorData.message || t("experience.management.errors.saveFailed")
        );
      }

      toast.success(
        isEditing
          ? t("experience.management.actions.updateSuccess")
          : t("experience.management.actions.addSuccess")
      );
      resetForm();
      fetchExperiences();
    } catch (error) {
      console.error("Error saving experience:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : t("experience.management.errors.saveFailed")
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("experience.management.actions.confirmDelete")))
      return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error(t("experience.management.errors.authError"));
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/experience/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || t("experience.management.errors.deleteFailed")
        );
      }

      toast.success(t("experience.management.actions.deleteSuccess"));
      fetchExperiences();
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : t("experience.management.errors.deleteFailed")
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {t("experience.management.title")}
        </h2>
        <button
          onClick={resetForm}
          className="px-4 py-2 rounded-lg transition-colors bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {t("experience.management.addExperience")}
        </button>
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("experience.management.form.company")}
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("experience.management.form.position")}
            </label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("experience.management.form.startDate")}
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("experience.management.form.endDate")}
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              disabled={formData.current}
              required={!formData.current}
            />
          </div>
        </div>

        {/* Current Position Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="current"
            checked={formData.current}
            onChange={(e) =>
              setFormData({ ...formData, current: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label
            htmlFor="current"
            className="ml-2 text-sm text-gray-700 dark:text-gray-300"
          >
            {t("experience.management.form.current")}
          </label>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("experience.management.form.description")}
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
            required
          />
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("experience.management.form.technologies")}
          </label>
          <input
            type="text"
            value={formData.technologies}
            onChange={(e) =>
              setFormData({ ...formData, technologies: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder={t(
              "experience.management.form.technologiesPlaceholder"
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
                {t("experience.management.editExperience")}
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                {t("experience.management.addExperience")}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Experience List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
          {t("experience.management.experienceList")}
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {experiences && experiences.length > 0 ? (
            experiences.map((experience) => (
              <div
                key={experience._id}
                className="group relative bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button
                    onClick={() => handleEdit(experience)}
                    className="p-1 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                    title={t("common.edit")}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(experience._id)}
                    className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    title={t("common.delete")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {experience.position}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      {experience.company}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        {new Date(experience.startDate).toLocaleDateString()} -{" "}
                        {experience.current
                          ? t("experience.current")
                          : new Date(experience.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {experience.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {experience.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
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
              <div className="mx-auto w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                {t("experience.management.noExperiences")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceManager;
