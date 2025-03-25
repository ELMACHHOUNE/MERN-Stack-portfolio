import React from "react";
import { CardSpotlight } from "./ui/card-spotlight";

interface Skill {
  name: string;
  level: number;
  category: "Frontend" | "Backend" | "Tools & Others";
}

const Skills: React.FC = () => {
  const skills: Skill[] = [
    // Frontend
    { name: "HTML5", level: 90, category: "Frontend" },
    { name: "CSS3", level: 85, category: "Frontend" },
    { name: "JavaScript", level: 80, category: "Frontend" },
    { name: "React", level: 85, category: "Frontend" },
    { name: "TypeScript", level: 75, category: "Frontend" },
    { name: "Tailwind CSS", level: 85, category: "Frontend" },

    // Backend
    { name: "Node.js", level: 80, category: "Backend" },
    { name: "Express", level: 75, category: "Backend" },
    { name: "MongoDB", level: 70, category: "Backend" },
    { name: "SQL", level: 78, category: "Backend" },
    { name: "REST APIs", level: 85, category: "Backend" },

    // Tools & Others
    { name: "Git", level: 85, category: "Tools & Others" },
    { name: "Docker", level: 65, category: "Tools & Others" },
    { name: "AWS", level: 60, category: "Tools & Others" },
    { name: "CI/CD", level: 75, category: "Tools & Others" },
  ];

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
                {skills
                  .filter((skill) => skill.category === category)
                  .map((skill) => (
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
