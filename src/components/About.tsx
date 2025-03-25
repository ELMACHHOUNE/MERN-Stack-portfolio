import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Experience {
  _id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
  icon: string;
}

const About: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [experiencesResponse, skillsResponse] = await Promise.all([
          fetch("http://localhost:5000/api/experience"),
          fetch("http://localhost:5000/api/skills"),
        ]);

        if (experiencesResponse.ok) {
          const experiencesData = await experiencesResponse.json();
          setExperiences(experiencesData);
        }

        if (skillsResponse.ok) {
          const skillsData = await skillsResponse.json();
          setSkills(skillsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = ["Frontend", "Backend", "Database", "DevOps", "Other"];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12 relative">
          About Me
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600"></span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <p className="text-gray-600">
              I am a passionate full-stack developer with several years of
              experience in building web applications. I love creating beautiful
              and functional solutions that make a difference.
            </p>
            <p className="text-gray-600">
              My expertise includes front-end development with React and modern
              CSS frameworks, back-end development with Node.js, and database
              management. I am always eager to learn new technologies and
              improve my skills.
            </p>
            <div className="flex space-x-4">
              <a
                href="/path-to-your-resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
              >
                Download Resume
              </a>
              <a
                href="#contact"
                className="border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-300"
              >
                Contact Me
              </a>
            </div>
          </div>
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-gray-800">Experience</h3>
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              experiences.map((exp) => (
                <motion.div
                  key={exp._id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="border-l-4 border-blue-600 pl-4"
                >
                  <h4 className="text-xl font-medium text-gray-800">
                    {exp.title}
                  </h4>
                  <p className="text-blue-600">{exp.company}</p>
                  <p className="text-gray-500 text-sm mb-2">{exp.period}</p>
                  <p className="text-gray-600">{exp.description}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-semibold text-gray-800 text-center mb-8">
            Skills
          </h3>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const categorySkills = skills.filter(
                  (skill) => skill.category === category
                );
                if (categorySkills.length === 0) return null;

                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-50 p-6 rounded-lg shadow-sm"
                  >
                    <h4 className="text-lg font-medium text-gray-800 mb-4">
                      {category}
                    </h4>
                    <div className="space-y-4">
                      {categorySkills.map((skill) => (
                        <div
                          key={skill._id}
                          className="flex items-center space-x-3"
                        >
                          <img
                            src={skill.icon}
                            alt={skill.name}
                            className="w-6 h-6"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-gray-700">
                              {skill.name}
                            </p>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    i < skill.level
                                      ? "bg-blue-500"
                                      : "bg-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
