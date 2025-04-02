import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Github,
  ExternalLink,
  FolderKanban,
} from "lucide-react";
import { API_URL } from "../../config";
import { toast } from "react-hot-toast";
import { useLanguage } from "../../context/LanguageContext";

interface Category {
  _id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  githubUrl: string;
  liveUrl: string;
  features: string[];
  category: string | { _id: string; name: string };
  order: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const ProjectManager: React.FC = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    image: "",
    githubUrl: "",
    liveUrl: "",
    features: "",
    category: "",
    order: 0,
    startDate: "",
    endDate: "",
    isActive: true,
  });

  useEffect(() => {
    fetchProjects();
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
      setCategories(data.filter((cat: Category) => cat.isActive));
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error(t("categories.management.errors.fetchFailed"));
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/projects/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok)
        throw new Error(t("projects.management.errors.fetchFailed"));
      const data = await response.json();
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error(t("projects.management.errors.fetchFailed"));
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const projectData = {
        ...formData,
        technologies: formData.technologies
          .split(",")
          .map((tech) => tech.trim()),
        features: formData.features.split(",").map((feature) => feature.trim()),
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        order: Number(formData.order),
      };

      const url = isEditing
        ? `${API_URL}/api/projects/${currentProject?._id}`
        : `${API_URL}/api/projects`;
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || t("projects.management.errors.saveFailed")
        );
      }

      toast.success(
        isEditing
          ? t("projects.management.actions.updateSuccess")
          : t("projects.management.actions.addSuccess")
      );
      resetForm();
      fetchProjects();
    } catch (error: any) {
      console.error("Error saving project:", error);
      toast.error(error.message || t("projects.management.errors.saveFailed"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("projects.management.actions.confirmDelete"))) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error(t("projects.management.errors.deleteFailed"));

      toast.success(t("projects.management.actions.deleteSuccess"));
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error(t("projects.management.errors.deleteFailed"));
    }
  };

  const handleEdit = (project: Project) => {
    setCurrentProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(", "),
      image: project.image,
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      features: project.features.join(", "),
      category:
        typeof project.category === "string"
          ? project.category
          : project.category._id,
      order: project.order,
      startDate: project.startDate.split("T")[0],
      endDate: project.endDate.split("T")[0],
      isActive: project.isActive,
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      technologies: "",
      image: "",
      githubUrl: "",
      liveUrl: "",
      features: "",
      category: "",
      order: 0,
      startDate: "",
      endDate: "",
      isActive: true,
    });
    setCurrentProject(null);
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
          {t("projects.management.title")}
        </h2>
        <button
          onClick={resetForm}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105 transform"
        >
          <Plus className="w-5 h-5" />
          {t("projects.management.addProject")}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-white/50 to-white/30 dark:from-[#1B2333]/50 dark:to-[#1B2333]/30 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-800/50 space-y-6"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t("projects.management.form.title")}
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-500/50"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t("projects.management.form.description")}
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
            {t("projects.management.form.technologies")}
          </label>
          <input
            type="text"
            id="technologies"
            value={formData.technologies}
            onChange={(e) =>
              setFormData({ ...formData, technologies: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-500/50"
            placeholder={t("projects.management.form.technologiesPlaceholder")}
            required
          />
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t("projects.management.form.imageUrl")}
          </label>
          <input
            type="text"
            id="image"
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-500/50"
            required
          />
        </div>

        <div>
          <label
            htmlFor="features"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t("projects.management.form.features")}
          </label>
          <input
            type="text"
            id="features"
            value={formData.features}
            onChange={(e) =>
              setFormData({ ...formData, features: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-500/50"
            placeholder={t("projects.management.form.featuresPlaceholder")}
            required
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t("projects.management.form.category")}
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-500/50"
            required
          >
            <option value="">
              {t("projects.management.form.selectCategory")}
            </option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="order"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t("projects.management.form.order")}
          </label>
          <input
            type="number"
            id="order"
            value={formData.order}
            onChange={(e) =>
              setFormData({ ...formData, order: Number(e.target.value) })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-500/50"
            min="0"
            required
          />
        </div>

        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t("projects.management.form.startDate")}
          </label>
          <input
            type="date"
            id="startDate"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-500/50"
            required
          />
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t("projects.management.form.endDate")}
          </label>
          <input
            type="date"
            id="endDate"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-500/50"
            required
          />
        </div>

        <div>
          <label
            htmlFor="githubUrl"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t("projects.management.form.githubUrl")}
          </label>
          <input
            type="url"
            id="githubUrl"
            value={formData.githubUrl}
            onChange={(e) =>
              setFormData({ ...formData, githubUrl: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-500/50"
            required
          />
        </div>

        <div>
          <label
            htmlFor="liveUrl"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t("projects.management.form.liveUrl")}
          </label>
          <input
            type="url"
            id="liveUrl"
            value={formData.liveUrl}
            onChange={(e) =>
              setFormData({ ...formData, liveUrl: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-500/50"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.checked })
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isActive"
            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
          >
            {t("projects.management.form.isActive")}
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium transition-all duration-200 hover:bg-blue-700"
          >
            {isEditing ? t("common.save") : t("projects.management.addProject")}
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {t("projects.management.projectList")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="group relative bg-gradient-to-br from-white to-white/80 dark:from-[#1E2A3B] dark:to-[#1E2A3B]/80 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-500/50 hover:-translate-y-1 transform"
            >
              <div className="absolute top-4 right-4 space-x-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors hover:scale-110 transform inline-flex"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors hover:scale-110 transform inline-flex"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div
                className="aspect-w-16 aspect-h-9 mb-4 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => handleEdit(project)}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {project.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors hover:scale-110 transform inline-flex"
                    title="Edit Project"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors hover:scale-110 transform inline-flex"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                  >
                    <Github className="w-4 h-4" />
                    {t("projects.management.actions.viewGitHub")}
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t("projects.management.actions.viewDemo")}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 flex items-center justify-center border border-blue-500/20 dark:border-blue-400/20">
              <FolderKanban className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              {t("projects.management.noProjects")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManager;
