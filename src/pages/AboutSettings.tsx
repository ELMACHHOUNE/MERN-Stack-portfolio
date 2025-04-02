import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAdminProfile } from "../context/AdminProfileContext";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config";
import {
  User,
  Code,
  Server,
  Database,
  Wrench,
  Plus,
  Trash2,
} from "lucide-react";

interface Value {
  icon: string;
  title: string;
  description: string;
}

const AboutSettings: React.FC = () => {
  const { adminProfile, updateAdminProfile } = useAdminProfile();
  const { token } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(
    adminProfile?.profileImage || ""
  );
  const [interests, setInterests] = useState<string[]>(
    adminProfile?.interests || []
  );
  const [newInterest, setNewInterest] = useState("");
  const [values, setValues] = useState<Value[]>(adminProfile?.values || []);
  const [formData, setFormData] = useState({
    name: adminProfile?.name || "",
    title: adminProfile?.title || "",
    location: adminProfile?.location || "",
    bio: adminProfile?.bio || "",
  });

  useEffect(() => {
    if (adminProfile) {
      setFormData({
        name: adminProfile.name || "",
        title: adminProfile.title || "",
        location: adminProfile.location || "",
        bio: adminProfile.bio || "",
      });
      setInterests(adminProfile.interests || []);
      setValues(adminProfile.values || []);
    }
  }, [adminProfile]);

  const defaultValues = [
    {
      icon: "User",
      title: "Clean Code",
      description:
        "Writing maintainable and efficient code that follows best practices.",
    },
    {
      icon: "Code",
      title: "Problem Solving",
      description:
        "Finding innovative solutions to complex technical challenges.",
    },
    {
      icon: "Server",
      title: "User Experience",
      description:
        "Creating intuitive and accessible applications that users love.",
    },
    {
      icon: "Database",
      title: "Continuous Learning",
      description:
        "Staying updated with the latest technologies and industry trends.",
    },
  ];

  const defaultInterests = [
    "Web Development",
    "Software Architecture",
    "UI/UX Design",
    "Cloud Computing",
  ];

  // Initialize with defaults if no values exist
  useEffect(() => {
    if (
      adminProfile &&
      (!adminProfile.values || adminProfile.values.length === 0)
    ) {
      setValues(defaultValues);
    }
    if (
      adminProfile &&
      (!adminProfile.interests || adminProfile.interests.length === 0)
    ) {
      setInterests(defaultInterests);
    }
  }, [adminProfile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_URL}/api/settings/profile-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload image");
      }

      const data = await response.json();
      setProfileImage(data.profileImage);
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

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(interests.filter((interest) => interest !== interestToRemove));
  };

  const handleValueChange = (
    index: number,
    field: keyof Value,
    value: string
  ) => {
    const newValues = [...values];
    newValues[index] = { ...newValues[index], [field]: value };
    setValues(newValues);
  };

  const handleAddValue = () => {
    setValues([
      ...values,
      {
        icon: "User",
        title: "New Value",
        description: "Description for the new value",
      },
    ]);
  };

  const handleRemoveValue = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
  };

  const handleAboutUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      ...formData,
      interests: interests.length > 0 ? interests : defaultInterests,
      values: values.length > 0 ? values : defaultValues,
    };

    try {
      await updateAdminProfile(data);
      toast.success("About page content updated successfully");
    } catch (error) {
      console.error("About page update error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update about page content"
      );
    }
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
                  {profileImage ? (
                    <img
                      src={`${API_URL}${profileImage}`}
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
                value={formData.name}
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
                value={formData.title}
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
                value={formData.location}
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
                value={formData.bio}
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
            {values.map((value, index) => (
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Icon
                    </label>
                    <select
                      value={value.icon}
                      onChange={(e) =>
                        handleValueChange(index, "icon", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="User">User</option>
                      <option value="Code">Code</option>
                      <option value="Server">Server</option>
                      <option value="Database">Database</option>
                      <option value="Wrench">Wrench</option>
                    </select>
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
                    <input
                      type="text"
                      value={value.description}
                      onChange={(e) =>
                        handleValueChange(index, "description", e.target.value)
                      }
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
              {interests.map((interest) => (
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
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutSettings;
