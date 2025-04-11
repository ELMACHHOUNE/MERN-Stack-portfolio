import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Github,
  ExternalLink,
  FolderKanban,
  Calendar,
  X,
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imageSource, setImageSource] = useState<"url" | "file">("url");

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);

      // Update form data with the file name
      setFormData((prev) => ({
        ...prev,
        image: file.name,
      }));
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.value,
    }));
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleImageSourceChange = (source: "url" | "file") => {
    setImageSource(source);
    if (source === "url") {
      setSelectedFile(null);
      setPreviewUrl("");
    } else {
      setFormData((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      // Add file if selected
      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
        formDataToSend.append("imageSource", "file");
      } else if (formData.image) {
        formDataToSend.append("imageSource", "url");
      }

      // Convert technologies and features from comma-separated strings to arrays
      const technologiesArray = formData.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0);

      const featuresArray = formData.features
        .split(",")
        .map((feature) => feature.trim())
        .filter((feature) => feature.length > 0);

      // Add other form data
      Object.keys(formData).forEach((key) => {
        if (key !== "image" || !selectedFile) {
          let value = formData[key as keyof typeof formData];
          if (key === "technologies") {
            value = JSON.stringify(technologiesArray);
          } else if (key === "features") {
            value = JSON.stringify(featuresArray);
          }
          formDataToSend.append(key, String(value));
        }
      });

      const url = isEditing
        ? `${API_URL}/api/projects/${currentProject?._id}`
        : `${API_URL}/api/projects`;
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || t("projects.management.errors.saveFailed")
        );
      }

      const savedProject = await response.json();

      toast.success(
        isEditing
          ? t("projects.management.actions.updateSuccess")
          : t("projects.management.actions.addSuccess")
      );

      // Update the form data with the saved project's image path
      if (savedProject.image) {
        setFormData((prev) => ({
          ...prev,
          image: savedProject.image,
        }));
        // If it's a file upload, update the preview URL
        if (savedProject.image.startsWith("/uploads/")) {
          setPreviewUrl(`${API_URL}${savedProject.image}`);
        }
      }

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
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : project.technologies,
      image: project.image,
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      features: Array.isArray(project.features)
        ? project.features.join(", ")
        : project.features,
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
    setImageSource(project.image.startsWith("/uploads/") ? "file" : "url");
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
    setSelectedFile(null);
    setPreviewUrl("");
    setImageSource("url");
    setCurrentProject(null);
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
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FolderKanban className="w-6 h-6 text-blue-500 dark:text-blue-400" />
          </div>
          {t("projects.management.title")}
        </h2>
        <button
          onClick={resetForm}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {t("projects.management.addProject")}
        </button>
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("projects.management.form.title")}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("projects.management.form.category")}
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("projects.management.form.description")}
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
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("projects.management.form.technologies")}
            </label>
            <input
              type="text"
              value={formData.technologies}
              onChange={(e) =>
                setFormData({ ...formData, technologies: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder={t(
                "projects.management.form.technologiesPlaceholder"
              )}
              required
            />
          </div>

          {/* Image */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("projects.management.form.image")}
            </label>

            {/* Image Source Toggle */}
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => handleImageSourceChange("url")}
                className={`px-4 py-2 rounded-lg ${
                  imageSource === "url"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {t("projects.management.form.imageUrl")}
              </button>
              <button
                type="button"
                onClick={() => handleImageSourceChange("file")}
                className={`px-4 py-2 rounded-lg ${
                  imageSource === "file"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {t("projects.management.form.uploadImage")}
              </button>
            </div>

            {/* Image Input Fields */}
            <div className="space-y-4">
              {imageSource === "url" ? (
                <input
                  type="text"
                  value={formData.image}
                  onChange={handleImageUrlChange}
                  placeholder={t(
                    "projects.management.form.imageUrlPlaceholder"
                  )}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              )}

              {/* Image Preview */}
              {(previewUrl || formData.image) && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("projects.management.form.imagePreview")}
                  </h4>
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <img
                      src={
                        previewUrl ||
                        (formData.image.startsWith("/uploads/")
                          ? `${API_URL}${formData.image}`
                          : formData.image)
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Image load error:", e);
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-image.jpg"; // Fallback image
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* GitHub URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("projects.management.form.githubUrl")}
            </label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) =>
                setFormData({ ...formData, githubUrl: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Live URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("projects.management.form.liveUrl")}
            </label>
            <input
              type="url"
              value={formData.liveUrl}
              onChange={(e) =>
                setFormData({ ...formData, liveUrl: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("projects.management.form.startDate")}
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
              {t("projects.management.form.endDate")}
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("projects.management.form.order")}
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: Number(e.target.value) })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              min="0"
              required
            />
          </div>

          {/* Is Active */}
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
              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
            >
              {t("projects.management.form.isActive")}
            </label>
          </div>

          {/* Features */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("projects.management.form.features")}
            </label>
            <input
              type="text"
              value={formData.features}
              onChange={(e) =>
                setFormData({ ...formData, features: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder={t("projects.management.form.featuresPlaceholder")}
              required
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("projects.management.form.featuresHelp")}
            </p>
          </div>
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
                {t("common.save")}
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                {t("projects.management.addProject")}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Project List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FolderKanban className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          </div>
          {t("projects.management.projectList")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="group bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                <img
                  src={
                    project.image.startsWith("/uploads/")
                      ? `${API_URL}${project.image}`
                      : project.image
                  }
                  alt={project.title}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    console.error("Project image load error:", {
                      src: (e.target as HTMLImageElement).src,
                      projectImage: project.image,
                    });
                    (e.target as HTMLImageElement).src =
                      "/placeholder-image.jpg";
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-1.5 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                    title={t("common.edit")}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="p-1.5 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                    title={t("common.delete")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {project.title}
              </h4>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(project.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
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
