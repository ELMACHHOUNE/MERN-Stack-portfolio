import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useAdminProfile } from "../context/AdminProfileContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
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
  Mail,
  MessageCircle,
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
  gmail: string;
  whatsapp: string;
}

const AdminSettings: React.FC = () => {
  const { t } = useLanguage();
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
    gmail: adminProfile?.socialLinks?.gmail || "",
    whatsapp: adminProfile?.socialLinks?.whatsapp || "",
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
        throw new Error(error.message || t("settings.image.error"));
      }

      const data = await response.json();
      setProfileImage(data.profileImage);
      await updateAdminProfile({ profileImage: data.profileImage });
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
      toast.success(t("settings.profile.success"));
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(
        error instanceof Error ? error.message : t("settings.profile.error")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1F2937] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/80 dark:bg-[#131B2C]/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
              {t("settings.profile.title")}
            </h2>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-8">
            <div className="bg-white/50 dark:bg-[#1B2333]/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                {t("settings.profile.title")}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-gray-200 dark:border-gray-700 shadow-xl">
                      {profileImage ? (
                        <img
                          src={`${API_URL}${profileImage}`}
                          alt={t("settings.profile.imageAlt")}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 flex items-center justify-center">
                          <User className="w-16 h-16 text-blue-500 dark:text-blue-400" />
                        </div>
                      )}
                    </div>
                    <label
                      htmlFor="profileImage"
                      className="absolute bottom-0 right-0 bg-white dark:bg-[#1B2333] p-2 rounded-lg shadow-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#242E42] transition-colors border border-gray-200 dark:border-gray-700"
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
                    {t("settings.profile.description")}
                  </p>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      {
                        id: "name",
                        label: t("settings.profile.fullName"),
                        type: "text",
                        placeholder: t("settings.profile.namePlaceholder"),
                        value: adminProfile?.name || "",
                      },
                      {
                        id: "email",
                        label: t("settings.profile.email"),
                        type: "email",
                        placeholder: t("settings.profile.emailPlaceholder"),
                        value: adminProfile?.email || "",
                      },
                      {
                        id: "title",
                        label: t("about.subtitle"),
                        type: "text",
                        placeholder: t("home.defaultProfile.title"),
                        value: adminProfile?.title || "",
                      },
                      {
                        id: "location",
                        label: t("about.location"),
                        type: "text",
                        placeholder: t("home.defaultProfile.location"),
                        value: adminProfile?.location || "",
                      },
                    ].map((field) => (
                      <div key={field.id}>
                        <label
                          htmlFor={field.id}
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          id={field.id}
                          name={field.id}
                          defaultValue={field.value}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder={field.placeholder}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      {t("about.bio")}
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      defaultValue={adminProfile?.bio}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder={t("home.defaultProfile.bio")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-[#1B2333]/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                {t("about.socialLinks.title")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    id: "gmail",
                    icon: Mail,
                    label: t("about.socialLinks.gmail"),
                  },
                  {
                    id: "whatsapp",
                    icon: MessageCircle,
                    label: t("about.socialLinks.whatsapp"),
                  },
                  {
                    id: "github",
                    icon: Github,
                    label: t("about.socialLinks.github"),
                  },
                  {
                    id: "linkedin",
                    icon: Linkedin,
                    label: t("about.socialLinks.linkedin"),
                  },
                  {
                    id: "twitter",
                    icon: Twitter,
                    label: t("about.socialLinks.twitter"),
                  },
                  {
                    id: "facebook",
                    icon: Facebook,
                    label: t("about.socialLinks.facebook"),
                  },
                  {
                    id: "instagram",
                    icon: Instagram,
                    label: t("about.socialLinks.instagram"),
                  },
                  {
                    id: "youtube",
                    icon: Youtube,
                    label: t("about.socialLinks.youtube"),
                  },
                  {
                    id: "behance",
                    icon: (props: any) => (
                      <svg viewBox="0 0 24 24" {...props} fill="currentColor">
                        <path d="M22 7h-7V2H9v5H2v15h20V7zM9 13.47c0 .43-.15.77-.46 1.03-.31.25-.75.38-1.32.38H5.94V12h1.31c.54 0 .96.12 1.27.37.3.25.46.58.46.99l.02.11zm6.31.03c0 .42-.14.76-.41 1.05-.28.28-.65.42-1.12.42-.48 0-.87-.15-1.16-.45-.29-.31-.44-.7-.44-1.18 0-.47.15-.85.46-1.15.31-.31.71-.46 1.21-.46.46 0 .83.14 1.09.42.27.28.4.63.4 1.06l-.03.29zm-6.31-3.93c0 .42-.15.75-.45 1-.3.25-.72.37-1.27.37H5.94V8.43h1.31c.54 0 .97.13 1.28.38.31.25.46.59.46 1l.02.11zm6.31-.08c0 .36-.11.66-.34.89-.23.23-.55.34-.96.34-.42 0-.75-.12-1-.37-.25-.25-.38-.57-.38-.97 0-.41.13-.74.4-1 .27-.26.62-.39 1.05-.39.41 0 .74.12.99.36.24.24.36.55.36.92l-.12.22z" />
                      </svg>
                    ),
                    label: t("about.socialLinks.behance"),
                  },
                ].map((platform) => (
                  <div key={platform.id}>
                    <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <platform.icon className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                      {platform.label}
                    </label>
                    <input
                      type="url"
                      value={
                        socialLinks[platform.id as keyof typeof socialLinks]
                      }
                      onChange={(e) =>
                        handleSocialLinkChange(
                          platform.id as keyof SocialLinks,
                          e.target.value
                        )
                      }
                      placeholder={
                        platform.id === "gmail"
                          ? "mailto:your.email@gmail.com"
                          : platform.id === "whatsapp"
                          ? "https://wa.me/1234567890"
                          : `https://${platform.id}.com/yourusername`
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-[#1B2333]/50 dark:to-[#1B2333]/30 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-800/50">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                    {t("about.coreValues")}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {t("about.coreValues")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddValue}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105 transform"
                >
                  <Plus className="w-5 h-5" />
                  {t("common.add")}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="group relative bg-gradient-to-br from-white to-white/80 dark:from-[#1E2A3B] dark:to-[#1E2A3B]/80 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-500/50 hover:-translate-y-1 transform"
                  >
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleRemoveValue(index)}
                        className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors hover:scale-110 transform"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 flex items-center justify-center shadow-inner border border-blue-500/20 dark:border-blue-400/20">
                          {value.icon ? (
                            <img
                              src={value.icon}
                              alt="Value icon"
                              className="w-6 h-6 object-contain"
                            />
                          ) : (
                            <Code className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        {[
                          {
                            id: "title",
                            label: t("about.coreValues"),
                            type: "text",
                            placeholder: t("about.coreValues"),
                          },
                          {
                            id: "icon",
                            label: t("skills.management.icon"),
                            type: "url",
                            placeholder: t("skills.management.icon"),
                          },
                        ].map((field) => (
                          <div key={field.id}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {field.label}
                            </label>
                            <input
                              type={field.type}
                              value={value[field.id as keyof typeof value]}
                              onChange={(e) =>
                                handleValueChange(
                                  index,
                                  field.id as keyof Value,
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#242E42] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm hover:border-blue-500/50"
                              placeholder={field.placeholder}
                            />
                          </div>
                        ))}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t("about.bio")}
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
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#242E42] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm resize-none hover:border-blue-500/50"
                            placeholder={t("about.bio")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-[#1B2333]/50 dark:to-[#1B2333]/30 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-800/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                    {t("about.interests")}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {t("about.interests")}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder={t("about.interests")}
                    className="w-full sm:w-64 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E2A3B] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-500/50"
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 hover:scale-105 transform"
                  >
                    <Plus className="w-5 h-5" />
                    {t("common.add")}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {interests.map((interest, index) => (
                  <div
                    key={index}
                    className="group relative bg-gradient-to-br from-white to-white/80 dark:from-[#1E2A3B] dark:to-[#1E2A3B]/80 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-500/50 hover:-translate-y-1 transform"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 dark:text-gray-200 font-medium">
                        {interest}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(interest)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 hover:scale-110 transform"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {interests.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 flex items-center justify-center border border-blue-500/20 dark:border-blue-400/20">
                    <Plus className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t("about.interests")}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                {t("settings.profile.saveChanges")}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
