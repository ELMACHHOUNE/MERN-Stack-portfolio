import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAdminProfile } from "../context/AdminProfileContext";
import { API_URL } from "../config";
import { User, Code, Server, Database, Wrench } from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  profileImage: string | null;
  title?: string;
  location?: string;
  bio?: string;
}

// Default profile data for fallback
const defaultProfileData: ProfileData = {
  name: "Your Name",
  email: "",
  profileImage: null,
  title: "Software Engineer",
  location: "Your Location",
  bio: `I am a passionate software engineer with expertise in building modern web applications. 
  With a strong foundation in both frontend and backend development, I create efficient and 
  scalable solutions that solve real problems.`,
};

const About: React.FC = () => {
  const { adminProfile, loading } = useAdminProfile();
  const [imageError, setImageError] = useState(false);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.error("Image load error:", {
      src: e.currentTarget.src,
      error: e,
    });
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  const getProfileImageUrl = () => {
    if (!adminProfile?.profileImage) {
      return null;
    }

    const imageUrl = `${API_URL}${adminProfile.profileImage}`;
    return imageUrl;
  };

  const getFallbackAvatarUrl = () => {
    const name = adminProfile?.name || "User";
    const url = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random&size=128`;
    return url;
  };

  const personalInfo = {
    name: adminProfile?.name || defaultProfileData.name,
    title: adminProfile?.title || defaultProfileData.title,
    location: adminProfile?.location || defaultProfileData.location,
    bio: adminProfile?.bio || defaultProfileData.bio,
    interests: [
      "Web Development",
      "Cloud Computing",
      "Machine Learning",
      "Open Source",
    ],
    values: [
      {
        icon: User,
        title: "Clean Code",
        description:
          "Writing maintainable and efficient code that follows best practices.",
      },
      {
        icon: Code,
        title: "Problem Solving",
        description:
          "Finding innovative solutions to complex technical challenges.",
      },
      {
        icon: Server,
        title: "User Experience",
        description:
          "Creating intuitive and accessible applications that users love.",
      },
      {
        icon: Database,
        title: "Continuous Learning",
        description:
          "Staying updated with the latest technologies and industry trends.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-blue-600 shadow-lg">
            {loading ? (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : adminProfile?.profileImage && !imageError ? (
              <img
                src={getProfileImageUrl() || ""}
                alt={adminProfile.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            ) : (
              <img
                src={getFallbackAvatarUrl()}
                alt={adminProfile?.name || "User"}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {personalInfo.name}
          </h1>
          <p className="text-xl text-blue-600 dark:text-blue-400 mb-2">
            {personalInfo.title}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {personalInfo.location}
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            {personalInfo.bio}
          </p>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            My Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {personalInfo.values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <value.icon className="h-8 w-8 text-blue-500 dark:text-blue-400 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {value.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Interests Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Interests
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {personalInfo.interests.map((interest) => (
              <motion.span
                key={interest}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
              >
                {interest}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
