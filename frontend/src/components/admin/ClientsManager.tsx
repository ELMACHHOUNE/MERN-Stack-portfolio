import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Plus,
  Trash2,
  Edit,
  Globe,
  Image,
  Link as LinkIcon,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";


interface ClientItem {
  _id?: string;
  name: string;
  logo: string;
  website?: string;
  order?: number;
  isActive: boolean;
}

const ClientsManager: React.FC = () => {
  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("data:")
    ) {
      return url;
    }
    if (url.startsWith("/uploads")) {
      const base = import.meta.env.VITE_API_URL;
      const root = base.replace(/\/api\/?$/, "");
      return `${root}${url}`;
    }
    return url;
  };
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentClient, setCurrentClient] = useState<ClientItem | null>(null);
  const [logoSource, setLogoSource] = useState<"url" | "file">("url");
  const [formData, setFormData] = useState<{
    name: string;
    website: string;
    logo: string;
    file?: File | null;
  }>({
    name: "",
    website: "",
    logo: "",
    file: null,
  });

  const fetchClients = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/clients/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch clients");
      const data = await response.json();
      setClients(data);
    } catch {
      toast.error("Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const resetForm = () => {
    setIsEditing(false);
    setCurrentClient(null);
    setLogoSource("url");
    setFormData({ name: "", website: "", logo: "", file: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const form = new FormData();
      form.append("name", formData.name);
      form.append("website", formData.website);
      form.append("logoSource", logoSource);
      if (logoSource === "url") {
        form.append("logo", formData.logo);
      } else if (formData.file) {
        form.append("image", formData.file);
      }

      const url = isEditing
        ? `${import.meta.env.VITE_API_URL}/clients/${currentClient?._id}`
        : `${import.meta.env.VITE_API_URL}/clients`;
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!response.ok) throw new Error("Failed to save client");
      toast.success(
        isEditing ? "Client updated successfully" : "Client added successfully",
      );
      resetForm();
      fetchClients();
    } catch {
      toast.error("Failed to save client");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/clients/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) throw new Error("Failed to delete client");
      toast.success("Client deleted successfully");
      fetchClients();
    } catch {
      toast.error("Failed to delete client");
    }
  };

  const handleEdit = (client: ClientItem) => {
    setIsEditing(true);
    setCurrentClient(client);
    setLogoSource(client.logo?.startsWith("http") ? "url" : "file");
    setFormData({
      name: client.name,
      website: client.website || "",
      logo: client.logo || "",
      file: null,
    });
  };

  const toggleActive = async (client: ClientItem) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/clients/${client._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isActive: !client.isActive,
            logoSource: "url",
            logo: client.logo,
            name: client.name,
            website: client.website || "",
          }),
        },
      );
      if (!response.ok) throw new Error("Failed to update client");
      fetchClients();
    } catch {
      toast.error("Failed to update client");
    }
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
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Globe className="w-6 h-6 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-heading-1">Clients</h2>
            <p className="text-sm text-body-var">
              Manage client logos displayed on Home
            </p>
          </div>
        </div>
        <button
          onClick={() => resetForm()}
          className="btn btn-brand flex items-center gap-2 shadow-sm hover:shadow"
        >
          <Plus className="w-5 h-5" /> Add Client
        </button>
      </div>

      {/* Form */}
      <div className="card card-hover p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Client Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="input"
                placeholder="e.g. Acme Corp"
                required
              />
            </div>
            <div>
              <label className="label">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                className="input"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div>
            <label className="label">Logo Source</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setLogoSource("url")}
                className={`btn ${logoSource === "url" ? "btn-brand" : "btn-outline"}`}
              >
                <LinkIcon className="w-4 h-4 inline mr-1" /> URL
              </button>
              <button
                type="button"
                onClick={() => setLogoSource("file")}
                className={`btn ${logoSource === "file" ? "btn-brand" : "btn-outline"}`}
              >
                <Image className="w-4 h-4 inline mr-1" /> Upload
              </button>
            </div>
          </div>

          {logoSource === "url" ? (
            <div>
              <label className="label">Logo URL</label>
              <input
                type="url"
                value={formData.logo}
                onChange={(e) =>
                  setFormData({ ...formData, logo: e.target.value })
                }
                className="input"
                placeholder="https://example.com/logo.png"
              />
            </div>
          ) : (
            <div>
              <label className="label">Upload Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    file: e.target.files?.[0] || null,
                  })
                }
                className="w-full"
              />
            </div>
          )}

          <div className="flex justify-end gap-4">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-outline"
              >
                Cancel
              </button>
            )}
            <button type="submit" className="btn btn-brand">
              {isEditing ? (
                <>
                  <Edit className="w-4 h-4 inline mr-1" /> Save
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 inline mr-1" /> Add Client
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Clients List */}
      <div className="space-y-6">
        {clients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-body-var">No clients found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <div key={client._id} className="card card-hover p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {client.logo ? (
                      <img
                        src={getImageUrl(client.logo)}
                        alt={client.name}
                        className="max-h-16 object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <Image className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-heading-1 truncate">
                        {client.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(client)}
                          className="p-1 text-body-var hover-text-brand"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(String(client._id))}
                          className="p-1 text-body-var hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {client.website && (
                      <a
                        href={client.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-brand"
                      >
                        {client.website}
                      </a>
                    )}
                    <div className="mt-3">
                      <button
                        onClick={() => toggleActive(client)}
                        className="flex items-center gap-1 text-sm text-body-var"
                      >
                        {client.isActive ? (
                          <>
                            <ToggleRight className="w-4 h-4" /> Active
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4" /> Inactive
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsManager;
