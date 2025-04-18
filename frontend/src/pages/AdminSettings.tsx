import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useAdminProfile } from "../context/AdminProfileContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { API_URL, ENDPOINTS } from "../utils/api";
import {
  User,
  Code,
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/Card";
import Button from "../components/ui/Button";

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
  const { token, setUser } = useAuth();
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

      const response = await fetch(ENDPOINTS.SETTINGS.PROFILE_IMAGE, {
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
      const newProfileImage = data.profileImage;

      // Update local state
      setProfileImage(newProfileImage);

      // Create a new profile object with all existing data
      const updatedProfile = {
        ...adminProfile,
        profileImage: newProfileImage,
      };

      // Update the admin profile context
      await updateAdminProfile(updatedProfile);

      // Update the auth context by fetching fresh user data
      const userResponse = await fetch(ENDPOINTS.AUTH.ME, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData); // This will update the user context with the new image
      }

      // Dispatch custom event with full image URL
      const fullImageUrl = `${API_URL.replace("/api", "")}${newProfileImage}`;
      window.dispatchEvent(
        new CustomEvent("profileImageUpdated", {
          detail: {
            profileImage: fullImageUrl,
            timestamp: Date.now(),
          },
        })
      );

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
      profileImage,
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("settings.profile.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-8">
              {/* Profile Image Section */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("settings.profile.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-gray-200 dark:border-gray-700 shadow-xl">
                        {profileImage ? (
                          <img
                            src={`${API_URL.replace(
                              "/api",
                              ""
                            )}${profileImage}`}
                            alt={t("settings.profile.imageAlt")}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                            <User className="w-16 h-16 text-primary-600 dark:text-primary-400" />
                          </div>
                        )}
                      </div>
                      <label
                        htmlFor="profileImage"
                        className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
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
                        <label htmlFor={field.id} className="label">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          id={field.id}
                          name={field.id}
                          defaultValue={field.value}
                          className="input"
                          placeholder={field.placeholder}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <label htmlFor="bio" className="label">
                      {t("about.bio")}
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      defaultValue={adminProfile?.bio}
                      className="input resize-none"
                      placeholder={t("home.defaultProfile.bio")}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Social Links Section */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("about.socialLinks.title")}</CardTitle>
                </CardHeader>
                <CardContent>
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
                    ].map((platform) => (
                      <div key={platform.id}>
                        <label className="flex items-center label">
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
                          className="input"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Core Values Section */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{t("about.coreValues")}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {t("about.coreValues")}
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      leftIcon={<Plus className="w-5 h-5" />}
                      onClick={handleAddValue}
                    >
                      {t("common.add")}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {values.map((value, index) => (
                      <Card key={index} hover>
                        <CardContent>
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                {value.icon ? (
                                  <img
                                    src={value.icon}
                                    alt="Value icon"
                                    className="w-6 h-6 object-contain"
                                  />
                                ) : (
                                  <Code className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                )}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="space-y-4">
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
                                    <label className="label">
                                      {field.label}
                                    </label>
                                    <input
                                      type={field.type}
                                      value={
                                        value[field.id as keyof typeof value]
                                      }
                                      onChange={(e) =>
                                        handleValueChange(
                                          index,
                                          field.id as keyof Value,
                                          e.target.value
                                        )
                                      }
                                      className="input"
                                      placeholder={field.placeholder}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveValue(index)}
                              className="text-gray-400 hover:text-error-600 dark:hover:text-error-400"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Interests Section */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle>{t("about.interests")}</CardTitle>
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
                        className="input w-full sm:w-64"
                      />
                      <Button
                        variant="primary"
                        leftIcon={<Plus className="w-5 h-5" />}
                        onClick={handleAddInterest}
                      >
                        {t("common.add")}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full"
                      >
                        <span>{interest}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveInterest(interest)}
                          className="text-primary-600 dark:text-primary-400 hover:text-error-600 dark:hover:text-error-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <CardFooter>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-full sm:w-auto"
                >
                  {t("settings.profile.saveChanges")}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
