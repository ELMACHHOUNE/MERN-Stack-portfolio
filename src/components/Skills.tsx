import React, { useState, useEffect } from "react";
import { CardSpotlight } from "./ui/card-spotlight";

interface Skill {
  name: string;
  level: number;
  category: "Frontend" | "Backend" | "Tools & Others";
}

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/skills");
        if (!response.ok) {
          throw new Error(`Failed to fetch skills: ${response.status}`);
        }
        const data = await response.json();

        setSkills(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch skills"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const getSkillsByCategory = (category: string) => {
    const categorySkills = skills.filter(
      (skill) => skill.category.toLowerCase() === category.toLowerCase()
    );

    return categorySkills;
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
                {getSkillsByCategory(category).map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardSpotlight>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
