import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  IconCode,
  IconBrain,
  IconHeart,
  IconRocket,
  IconArrowRight,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconChevronDown,
  IconTerminal2,
  IconDeviceLaptop,
  IconCloud,
  IconDatabase,
} from "@tabler/icons-react";

interface AdminProfile {
  name: string;
  email: string;
  profileImage: string | null;
  title?: string;
  location?: string;
  bio?: string;
}

const defaultProfile = {
  name: "Your Name",
  title: "Full Stack Developer",
  location: "Your Location",
  bio: `Passionate about creating elegant solutions to complex problems. Specializing in modern web technologies 
  and cloud architecture. Let's build something amazing together.`,
};

const Home: React.FC = () => {
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const [isVisible, setIsVisible] = useState(false);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);

  useEffect(() => {
    setIsVisible(true);
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/settings/admin-profile");
      if (response.ok) {
        const data = await response.json();
        setAdminProfile(data);
      } else {
        console.error("Failed to fetch admin profile");
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error);
    }
  };

  const technologies = [
    {
      name: "Frontend",
      icon: IconDeviceLaptop,
      items: ["React", "TypeScript", "Tailwind CSS"],
    },
    {
      name: "Backend",
      icon: IconTerminal2,
      items: ["Node.js", "Express", "MongoDB"],
    },
    { name: "Cloud", icon: IconCloud, items: ["AWS", "Docker", "CI/CD"] },
    {
      name: "Database",
      icon: IconDatabase,
      items: ["MongoDB", "PostgreSQL", "Redis"],
    },
  ];

  const personalInfo = {
    name: adminProfile?.name || defaultProfile.name,
    title: adminProfile?.title || defaultProfile.title,
    location: adminProfile?.location || defaultProfile.location,
    bio: adminProfile?.bio || defaultProfile.bio,
    values: [
      {
        icon: IconCode,
        title: "Clean Code",
        description:
          "Writing maintainable and efficient code that follows best practices.",
      },
      {
        icon: IconBrain,
        title: "Problem Solving",
        description:
          "Finding innovative solutions to complex technical challenges.",
      },
      {
        icon: IconHeart,
        title: "User Experience",
        description:
          "Creating intuitive and accessible applications that users love.",
      },
      {
        icon: IconRocket,
        title: "Innovation",
        description:
          "Pushing boundaries with cutting-edge technologies and approaches.",
      },
    ],
    socialLinks: [
      {
        icon: IconBrandGithub,
        url: "https://github.com/yourusername",
        label: "GitHub",
      },
      {
        icon: IconBrandLinkedin,
        url: "https://linkedin.com/in/yourusername",
        label: "LinkedIn",
      },
      {
        icon: IconBrandTwitter,
        url: "https://twitter.com/yourusername",
        label: "Twitter",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          style={{ opacity, y }}
          className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-4xl mx-auto text-center z-10"
        >
          <h1 className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-6">
            {personalInfo.name}
          </h1>
          <p className="text-3xl text-gray-700 dark:text-gray-300 mb-4">
            {personalInfo.title}
          </p>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            {personalInfo.bio}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              to="/projects"
              className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 transform hover:scale-105 transition-all"
            >
              View My Work
              <IconArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transform hover:scale-105 transition-all"
            >
              Get in Touch
            </Link>
          </div>
          <div className="flex justify-center gap-6">
            {personalInfo.socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label={link.label}
              >
                <link.icon className="h-8 w-8" />
              </motion.a>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <IconChevronDown className="h-8 w-8 text-gray-400 dark:text-gray-500 animate-bounce" />
        </motion.div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Technologies I Work With
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Modern tools for modern solutions
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <tech.icon className="h-12 w-12 text-blue-500 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {tech.name}
                </h3>
                <ul className="space-y-2">
                  {tech.items.map((item) => (
                    <li
                      key={item}
                      className="text-gray-600 dark:text-gray-300 flex items-center"
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              My Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Principles that guide my work
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {personalInfo.values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-6">
                  <value.icon className="h-10 w-10 text-blue-500 dark:text-blue-400 mr-4" />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {value.title}
                  </h3>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Next Project?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Let's collaborate and create something extraordinary together
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full text-blue-600 dark:text-blue-500 bg-white dark:bg-gray-100 hover:bg-blue-50 dark:hover:bg-gray-200 transform hover:scale-105 transition-all"
            >
              Let's Talk
              <IconArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
