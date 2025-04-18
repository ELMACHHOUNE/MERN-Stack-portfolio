import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAdminProfile } from "../context/AdminProfileContext";
import { useAuth } from "../context/AuthContext";
import { Plus, Trash2 } from "lucide-react";

interface Value {
  icon: string;
  title: string;
  description: string;
}

const AboutSettings: React.FC = () => {
  const { adminProfile, updateAdminProfile } = useAdminProfile();
  const { token } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Draft state for form data
  const [draftData, setDraftData] = useState({
    profileImage: "",
    interests: [] as string[],
    values: [] as Value[],
    formData: {
      name: "",
      title: "",
      location: "",
      bio: "",
    },
  });

  const [newInterest, setNewInterest] = useState("");

  // Initialize or update draft data when adminProfile changes
  useEffect(() => {
    if (adminProfile) {
      console.log("Admin profile changed, updating draft data:", adminProfile);
      const newDraftData = {
        profileImage: adminProfile.profileImage || "",
        interests: Array.isArray(adminProfile.interests)
          ? [...adminProfile.interests]
          : [],
        values: Array.isArray(adminProfile.values)
          ? adminProfile.values.map((v) => ({ ...v }))
          : [],
        formData: {
          name: adminProfile.name || "",
          title: adminProfile.title || "",
          location: adminProfile.location || "",
          bio: adminProfile.bio || "",
        },
      };
      console.log("Setting new draft data:", newDraftData);
      setDraftData(newDraftData);
    }
  }, [adminProfile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDraftData((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: value,
      },
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/settings/profile-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload image");
      }

      const data = await response.json();
      setDraftData((prev) => ({
        ...prev,
        profileImage: data.profileImage,
      }));
      await updateAdminProfile({ profileImage: data.profileImage });
      toast.success("Profile image updated successfully");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleAboutUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Prepare update data from draft
      const updateData = {
        ...draftData.formData,
        interests: draftData.interests,
        values: draftData.values,
        profileImage: draftData.profileImage,
      };

      await updateAdminProfile(updateData);
      toast.success("About page content updated successfully");
    } catch (error) {
      console.error("About page update error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update about page content"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddValue = () => {
    const newValue = {
      icon: "https://cdn-icons-png.flaticon.com/512/1785/1785210.png",
      title: "New Value",
      description: "Description for the new value",
    };
    setDraftData((prev) => ({
      ...prev,
      values: [...prev.values, newValue],
    }));
  };

  const handleRemoveValue = (index: number) => {
    setDraftData((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
  };

  const handleAddInterest = () => {
    if (
      newInterest.trim() &&
      !draftData.interests.includes(newInterest.trim())
    ) {
      setDraftData((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }));
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setDraftData((prev) => ({
      ...prev,
      interests: prev.interests.filter(
        (interest) => interest !== interestToRemove
      ),
    }));
  };

  const handleValueChange = (
    index: number,
    field: keyof Value,
    value: string
  ) => {
    setDraftData((prev) => ({
      ...prev,
      values: prev.values.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      ),
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        About Page Settings
      </h2>

      <form onSubmit={handleAboutUpdate} className="space-y-6">
        {/* Basic Profile Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Basic Profile
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Profile Image
              </label>
              <div className="mt-1 flex items-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden">
                  {draftData.profileImage ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL.replace(
                        /\/?api\/?$/,
                        ""
                      )}/settings/profile-image/${draftData.profileImage
                        .split("/")
                        .pop()}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400">
                        No image
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="block w-full text-sm text-gray-500 dark:text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      dark:file:bg-blue-900 dark:file:text-blue-300"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={draftData.formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={draftData.formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={draftData.formData.location}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Bio
              </label>
              <textarea
                name="bio"
                id="bio"
                rows={4}
                value={draftData.formData.bio}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Values
            </h3>
            <button
              type="button"
              onClick={handleAddValue}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Value
            </button>
          </div>
          <div className="space-y-4">
            {draftData.values.map((value, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Value {index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveValue(index)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Icon URL
                    </label>
                    <input
                      type="url"
                      value={value.icon}
                      onChange={(e) =>
                        handleValueChange(index, "icon", e.target.value)
                      }
                      placeholder="Enter icon URL (e.g., https://example.com/icon.png)"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    {value.icon && (
                      <div className="mt-2">
                        <img
                          src={value.icon}
                          alt={`Preview for ${value.title}`}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.src =
                              "https://via.placeholder.com/32?text=Error";
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Title
                    </label>
                    <input
                      type="text"
                      value={value.title}
                      onChange={(e) =>
                        handleValueChange(index, "title", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      value={value.description}
                      onChange={(e) =>
                        handleValueChange(index, "description", e.target.value)
                      }
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interests Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Interests
          </h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add new interest"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddInterest}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {draftData.interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutSettings;
