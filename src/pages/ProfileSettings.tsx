import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { toast } from "react-hot-toast";
import { API_URL } from "../config";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Github,
  Linkedin,
  Twitter,
  Camera,
  X,
  Save,
  Key,
  Hash,
  Globe,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";

interface FormData {
  name: string;
  email: string;
  title: string;
  location: string;
  bio: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  interests: string[];
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
  };
}

const ProfileSettings: React.FC = () => {
  const { t } = useLanguage();
  const { user, token, setUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [newInterest, setNewInterest] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || "",
    email: user?.email || "",
    title: user?.title || "",
    location: user?.location || "",
    bio: user?.bio || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    interests: user?.interests || [],
    socialLinks: {
      github: user?.socialLinks?.github || "",
      linkedin: user?.socialLinks?.linkedin || "",
      twitter: user?.socialLinks?.twitter || "",
    },
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        title: user.title || "",
        location: user.location || "",
        bio: user.bio || "",
        interests: user.interests || [],
        socialLinks: {
          github: user.socialLinks?.github || "",
          linkedin: user.socialLinks?.linkedin || "",
          twitter: user.socialLinks?.twitter || "",
        },
      }));
      setProfileImage(user.profileImage || "");
    }
  }, [user]);

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
        throw new Error(error.message || t("settings.image.error"));
      }

      const data = await response.json();
      setProfileImage(data.profileImage);
      toast.success(t("settings.image.success"));
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(
        error instanceof Error ? error.message : t("settings.image.error")
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      toast.error(t("settings.password.mismatch"));
      return;
    }

    try {
      const endpoint = user?.isAdmin
        ? `${API_URL}/api/settings/admin-profile`
        : `${API_URL}/api/settings/profile`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          title: formData.title,
          location: formData.location,
          bio: formData.bio,
          interests: formData.interests,
          socialLinks: formData.socialLinks,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t("settings.profile.error"));
      }

      const data = await response.json();
      toast.success(data.message || t("settings.profile.success"));

      // Reset password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      // Update user state with new data
      if (data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(
        error instanceof Error ? error.message : t("settings.profile.error")
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("socialLinks.")) {
      const social = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [social]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }));
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1121]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <User className="w-6 h-6 text-blue-600 dark:text-[#4F46E5]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("settings.profile.title")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("settings.profile.description")}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column - Profile Image */}
          <div className="md:col-span-4">
            <div className="bg-gray-50 dark:bg-[#1B2333] rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-40 h-40 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                    {profileImage ? (
                      <img
                        src={`${API_URL}${profileImage}`}
                        alt={t("settings.profile.imageAlt")}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <User className="w-20 h-20 text-gray-400 dark:text-gray-600" />
                      </div>
                    )}
                    <label
                      htmlFor="profileImage"
                      className="absolute bottom-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700 shadow-sm"
                    >
                      <Camera className="w-5 h-5 text-gray-600 dark:text-gray-400" />
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
                </div>
                <div className="mt-4 text-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {formData.name}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    {formData.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 bg-gray-50 dark:bg-[#1B2333] rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                {t("settings.profile.socialLinks")}
              </h3>
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Github className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="socialLinks.github"
                    value={formData.socialLinks.github}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#4F46E5] focus:border-transparent text-sm"
                    placeholder="github.com/username"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Linkedin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="socialLinks.linkedin"
                    value={formData.socialLinks.linkedin}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#4F46E5] focus:border-transparent text-sm"
                    placeholder="linkedin.com/in/username"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Twitter className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="socialLinks.twitter"
                    value={formData.socialLinks.twitter}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#4F46E5] focus:border-transparent text-sm"
                    placeholder="twitter.com/username"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="md:col-span-8">
            <div className="bg-gray-50 dark:bg-[#1B2333] rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="flex items-center gap-2 text-base font-medium text-gray-900 dark:text-white mb-6">
                <User className="w-5 h-5 text-blue-600 dark:text-[#4F46E5]" />
                {t("settings.profile.basicInfo")}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#4F46E5] focus:border-transparent text-sm"
                      placeholder={t("settings.profile.namePlaceholder")}
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#4F46E5] focus:border-transparent text-sm"
                      placeholder={t("settings.profile.emailPlaceholder")}
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Briefcase className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#4F46E5] focus:border-transparent text-sm"
                      placeholder={t("settings.profile.titlePlaceholder")}
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#4F46E5] focus:border-transparent text-sm"
                      placeholder={t("settings.profile.locationPlaceholder")}
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#4F46E5] focus:border-transparent text-sm resize-none"
                    placeholder={t("settings.profile.bioPlaceholder")}
                  />
                </div>

                {/* Interests */}
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-base font-medium text-gray-900 dark:text-white">
                    <Hash className="w-5 h-5 text-blue-600 dark:text-[#4F46E5]" />
                    {t("settings.profile.interests")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(interest)}
                          className="ml-1.5 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#4F46E5] focus:border-transparent text-sm"
                      placeholder={t("settings.profile.interestPlaceholder")}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddInterest())
                      }
                    />
                    <button
                      type="button"
                      onClick={handleAddInterest}
                      className="px-4 py-2 bg-blue-600 dark:bg-[#4F46E5] hover:bg-blue-700 dark:hover:bg-[#4338CA] text-white rounded-lg transition-colors text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Password Change */}
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-base font-medium text-gray-900 dark:text-white">
                    <Key className="w-5 h-5 text-blue-600 dark:text-[#4F46E5]" />
                    {t("settings.profile.changePassword")}
                  </h3>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-10 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#4F46E5] focus:border-transparent text-sm"
                      placeholder={t("settings.profile.currentPassword")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-10 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#4F46E5] focus:border-transparent text-sm"
                      placeholder={t("settings.profile.newPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-10 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#4F46E5] focus:border-transparent text-sm"
                      placeholder={t("settings.profile.confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 dark:bg-[#4F46E5] hover:bg-blue-700 dark:hover:bg-[#4338CA] text-white rounded-lg transition-colors text-sm flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {t("settings.profile.save")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
