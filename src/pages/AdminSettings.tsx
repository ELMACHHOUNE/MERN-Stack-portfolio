import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useAdminProfile } from "../context/AdminProfileContext";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config";
import {
  User,
  Code,
  Server,
  Database,
  Plus,
  Trash2,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Camera,
} from "lucide-react";

interface Value {
  icon: string;
  title: string;
  description: string;
}

interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  youtube: string;
  behance: string;
}

const AdminSettings: React.FC = () => {
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
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    github: adminProfile?.socialLinks?.github || "",
    linkedin: adminProfile?.socialLinks?.linkedin || "",
    twitter: adminProfile?.socialLinks?.twitter || "",
    facebook: adminProfile?.socialLinks?.facebook || "",
    instagram: adminProfile?.socialLinks?.instagram || "",
    youtube: adminProfile?.socialLinks?.youtube || "",
    behance: adminProfile?.socialLinks?.behance || "",
  });
  const [values, setValues] = useState<Value[]>(
    adminProfile?.values || [
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
    ]
  );

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

  const handleSocialLinkChange = (
    platform: keyof SocialLinks,
    value: string
  ) => {
    setSocialLinks((prev) => ({
      ...prev,
      [platform]: value,
    }));
  };

  const handleAddValue = () => {
    setValues([
      ...values,
      {
        icon: "",
        title: "New Value",
        description: "Description for the new value",
      },
    ]);
  };

  const handleRemoveValue = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      title: formData.get("title") as string,
      location: formData.get("location") as string,
      bio: formData.get("bio") as string,
      interests,
      values,
      socialLinks,
    };

    try {
      await updateAdminProfile(data);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Admin Profile Settings
          </h2>

          <form onSubmit={handleProfileUpdate} className="space-y-6">
            {/* Basic Profile Section */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Basic Profile
              </h2>
              <div className="space-y-6">
                {/* Profile Image */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl">
                      {profileImage ? (
                        <img
                          src={`${API_URL}${profileImage}`}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 flex items-center justify-center">
                          <User className="w-16 h-16 text-white/90" />
                        </div>
                      )}
                    </div>
                    <label
                      htmlFor="profileImage"
                      className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-2 rounded-lg shadow-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Camera className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </label>
                    <input
                      type="file"
                      id="profileImage"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click the camera icon to update your profile picture
                  </p>
                </div>

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={adminProfile?.name}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                    placeholder="Your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={adminProfile?.email}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    defaultValue={adminProfile?.title}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                    placeholder="e.g. Full Stack Developer"
                  />
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    defaultValue={adminProfile?.location}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                    placeholder="e.g. New York, USA"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    defaultValue={adminProfile?.bio}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Write a brief description about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Social Media Links Section */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Social Media Links
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Github className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-300" />
                    GitHub
                  </label>
                  <input
                    type="url"
                    value={socialLinks.github}
                    onChange={(e) =>
                      handleSocialLinkChange("github", e.target.value)
                    }
                    placeholder="https://github.com/yourusername"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Linkedin className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-300" />
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={socialLinks.linkedin}
                    onChange={(e) =>
                      handleSocialLinkChange("linkedin", e.target.value)
                    }
                    placeholder="https://linkedin.com/in/yourusername"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Twitter className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-300" />
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={socialLinks.twitter}
                    onChange={(e) =>
                      handleSocialLinkChange("twitter", e.target.value)
                    }
                    placeholder="https://twitter.com/yourusername"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Facebook className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-300" />
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={socialLinks.facebook}
                    onChange={(e) =>
                      handleSocialLinkChange("facebook", e.target.value)
                    }
                    placeholder="https://facebook.com/yourusername"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Instagram className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-300" />
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={socialLinks.instagram}
                    onChange={(e) =>
                      handleSocialLinkChange("instagram", e.target.value)
                    }
                    placeholder="https://instagram.com/yourusername"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Youtube className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-300" />
                    YouTube
                  </label>
                  <input
                    type="url"
                    value={socialLinks.youtube}
                    onChange={(e) =>
                      handleSocialLinkChange("youtube", e.target.value)
                    }
                    placeholder="https://youtube.com/yourchannel"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-300"
                      fill="currentColor"
                    >
                      <path d="M22 7h-7V2H9v5H2v15h20V7zM9 13.47c0 .43-.15.77-.46 1.03-.31.25-.75.38-1.32.38H5.94V12h1.31c.54 0 .96.12 1.27.37.3.25.46.58.46.99l.02.11zm6.31.03c0 .42-.14.76-.41 1.05-.28.28-.65.42-1.12.42-.48 0-.87-.15-1.16-.45-.29-.31-.44-.7-.44-1.18 0-.47.15-.85.46-1.15.31-.31.71-.46 1.21-.46.46 0 .83.14 1.09.42.27.28.4.63.4 1.06l-.03.29zm-6.31-3.93c0 .42-.15.75-.45 1-.3.25-.72.37-1.27.37H5.94V8.43h1.31c.54 0 .97.13 1.28.38.31.25.46.59.46 1l.02.11zm6.31-.08c0 .36-.11.66-.34.89-.23.23-.55.34-.96.34-.42 0-.75-.12-1-.37-.25-.25-.38-.57-.38-.97 0-.41.13-.74.4-1 .27-.26.62-.39 1.05-.39.41 0 .74.12.99.36.24.24.36.55.36.92l-.12.22z" />
                    </svg>
                    Behance
                  </label>
                  <input
                    type="url"
                    value={socialLinks.behance}
                    onChange={(e) =>
                      handleSocialLinkChange("behance", e.target.value)
                    }
                    placeholder="https://behance.net/yourusername"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Core Values
                </h2>
                <button
                  type="button"
                  onClick={handleAddValue}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Value
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleRemoveValue(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center shadow-inner">
                          {value.icon ? (
                            <img
                              src={value.icon}
                              alt="Value icon"
                              className="w-6 h-6 object-contain"
                            />
                          ) : (
                            <Code className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={value.title}
                            onChange={(e) =>
                              handleValueChange(index, "title", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 text-sm"
                            placeholder="Enter value title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                          </label>
                          <textarea
                            value={value.description}
                            onChange={(e) =>
                              handleValueChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 text-sm resize-none"
                            placeholder="Enter value description"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Icon URL
                          </label>
                          <input
                            type="url"
                            value={value.icon}
                            onChange={(e) =>
                              handleValueChange(index, "icon", e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200 text-sm"
                            placeholder="Enter icon URL"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests Section */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Interests
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add new interest"
                    className="w-full sm:w-64 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Interest
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {interests.map((interest, index) => (
                  <div
                    key={index}
                    className="group relative bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-indigo-100 dark:border-indigo-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                        {interest}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(interest)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-indigo-400 hover:text-red-500 dark:text-indigo-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {interests.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    No interests added yet. Add your first interest above!
                  </p>
                </div>
              )}
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
      </div>
    </div>
  );
};

export default AdminSettings;
