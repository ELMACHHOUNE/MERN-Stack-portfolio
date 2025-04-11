import React, { useState, useEffect } from "react";
import { CardSpotlight } from "./ui/card-spotlight";
import { API_URL } from "../config";

interface Skill {
  _id: string;
  name: string;
  level: number;
  icon: string;
  category: string | { _id: string; name: string };
  isActive: boolean;
}

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        console.log("Fetching skills from:", `${API_URL}/api/skills`);
        const response = await fetch(`${API_URL}/api/skills`);
        if (!response.ok) {
          throw new Error(`Failed to fetch skills: ${response.status}`);
        }
        const data = await response.json();
        console.log("Received skills data:", data);
        setSkills(data);
      } catch (error) {
        console.error("Error fetching skills:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch skills"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const getSkillsByCategory = (categoryName: string) => {
    const filteredSkills = skills.filter((skill) => {
      const skillCategory =
        typeof skill.category === "string"
          ? skill.category
          : skill.category?.name;
      const matches =
        skillCategory?.toLowerCase() === categoryName.toLowerCase() &&
        skill.isActive;
      return matches;
    });
    console.log(`Skills for category ${categoryName}:`, filteredSkills);
    return filteredSkills;
  };

  if (loading) {
    return <div>Loading skills...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const categories = ["Frontend", "Backend", "Tools & Others"] as const;

  return (
    <section id="skills" className="min-h-screen py-24 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Skills & Expertise
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <CardSpotlight key={category} className="h-full">
              <h3 className="text-xl font-bold text-white mb-4">{category}</h3>
              <div className="space-y-4">
                {getSkillsByCategory(category).map((skill) => {
                  const imageSrc = skill.icon.includes("http")
                    ? skill.icon
                    : `${API_URL}/uploads/skills/${skill.icon}`;
                  console.log(`Image path for ${skill.name}:`, {
                    originalIcon: skill.icon,
                    constructedPath: imageSrc,
                  });
                  return (
                    <div key={skill._id} className="group">
                      <div className="flex items-center gap-3 text-sm text-gray-300 mb-1">
                        {skill.icon && (
                          <div className="w-6 h-6 flex-shrink-0">
                            <img
                              src={imageSrc}
                              alt={skill.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                console.error(
                                  "Failed to load image for skill:",
                                  {
                                    skillName: skill.name,
                                    icon: skill.icon,
                                    attemptedPath: imageSrc,
                                  }
                                );
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder-icon.png";
                              }}
                            />
                          </div>
                        )}
                        <span className="flex-1">{skill.name}</span>
                        <span>{skill.level * 10}%</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${skill.level * 10}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardSpotlight>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
