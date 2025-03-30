import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";

interface SocialLink {
  href: string;
  icon: React.ReactNode;
  label: string;
}

interface AdminProfile {
  name: string;
  email: string;
  profileImage: string | null;
}

const Hero: React.FC = () => {
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      console.log("Starting profile fetch...");
      const token = localStorage.getItem("token");
      console.log("Token available:", !!token);

      try {
        const response = await fetch(
          "http://localhost:5000/api/settings/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Profile response status:", response.status);

        if (response.ok) {
          const profileData = await response.json();
          console.log("Profile Data:", {
            name: profileData.name,
            email: profileData.email,
            hasImage: !!profileData.profileImage,
            imagePath: profileData.profileImage,
          });
          setAdminProfile(profileData);
        } else {
          const errorText = await response.text();
          console.error("Failed to fetch profile:", {
            status: response.status,
            error: errorText,
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
        console.log("Profile fetch completed");
      }
    };

    fetchProfile();
  }, []);

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
    console.log("Image loaded successfully");
    setImageError(false);
  };

  const getProfileImageUrl = () => {
    if (!adminProfile?.profileImage) {
      console.log("No profile image available");
      return null;
    }

    const imageUrl = `http://localhost:5000/uploads/profiles/${adminProfile.profileImage}`;
    console.log("Profile image URL:", imageUrl);
    return imageUrl;
  };

  const getFallbackAvatarUrl = () => {
    const name = adminProfile?.name || "User";
    const url = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random`;
    console.log("Fallback avatar URL:", url);
    return url;
  };

  const socialLinks: SocialLink[] = [
    {
      href: "https://github.com/yourusername",
      icon: <Github className="h-6 w-6" />,
      label: "GitHub",
    },
    {
      href: "https://linkedin.com/in/yourusername",
      icon: <Linkedin className="h-6 w-6" />,
      label: "LinkedIn",
    },
    {
      href: "https://twitter.com/yourusername",
      icon: <Mail className="h-6 w-6" />,
      label: "Twitter",
    },
  ];

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-gray-900 to-blue-900"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-blue-400 shadow-lg">
            {adminProfile?.profileImage ? (
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
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Hi, I'm{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {adminProfile?.name || "Your Name"}
          </span>
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl md:text-4xl font-semibold mb-8 text-gray-200"
        >
          Full Stack Developer
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg md:text-xl mb-12 text-gray-300 max-w-2xl mx-auto"
        >
          I create beautiful and functional web applications using modern
          technologies.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-center space-x-6"
        >
          {socialLinks.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors duration-300"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              aria-label={link.label}
            >
              {link.icon}
            </motion.a>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12"
        >
          <motion.a
            href="#about"
            className="inline-flex items-center text-gray-300 hover:text-white transition-colors duration-300"
            whileHover={{ y: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-2">Scroll Down</span>
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
