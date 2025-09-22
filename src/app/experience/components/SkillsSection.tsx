// components/SkillsSection.tsx
import React from "react";
import skillsData from "@/data/skills.json";

// Type definitions
interface Technology {
  [key: string]: string;
}

interface SkillCategory {
  title: string;
  color: string;
  technologies: string[];
}

interface SkillsData {
  skills: {
    [key: string]: SkillCategory;
  };
}

// Color mapping untuk Tailwind CSS
const colorMap = {
  blue: {
    bg: "bg-blue-500/20",
    text: "text-blue-300",
    border: "border-blue-500/30",
    heading: "text-blue-400",
  },
  red: {
    bg: "bg-red-500/20",
    text: "text-red-300",
    border: "border-red-500/30",
    heading: "text-red-400",
  },
  yellow: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-300",
    border: "border-yellow-500/30",
    heading: "text-yellow-400",
  },
  green: {
    bg: "bg-green-500/20",
    text: "text-green-300",
    border: "border-green-500/30",
    heading: "text-green-400",
  },
  purple: {
    bg: "bg-purple-500/20",
    text: "text-purple-300",
    border: "border-purple-500/30",
    heading: "text-purple-400",
  },
  indigo: {
    bg: "bg-indigo-500/20",
    text: "text-indigo-300",
    border: "border-indigo-500/30",
    heading: "text-indigo-400",
  },
  emerald: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-300",
    border: "border-emerald-500/30",
    heading: "text-emerald-400",
  },
};

const SkillsSection: React.FC = () => {
  const { skills } = skillsData as SkillsData;

  return (
    <section className="py-16 skills-section">
      <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-2xl p-12 border border-gray-700/50">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Skills & Technologies
        </h2>
        <p className="text-gray-300 text-center mb-8 text-lg">
          Technologies and skills I've developed throughout my career and
          projects
        </p>

        {/* Skill categories */}
        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(skills).map(([key, category]) => {
            const colors =
              colorMap[category.color as keyof typeof colorMap] ||
              colorMap.blue;

            return (
              <div
                key={key}
                className={`text-center ${
                  key === "geospatial" ? "md:col-start-2" : ""
                }`}
              >
                <h3 className={`text-xl font-semibold ${colors.heading} mb-4`}>
                  {category.title}
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {category.technologies.map((tech) => (
                    <span
                      key={tech}
                      className={`${colors.bg} ${colors.text} px-3 py-1 rounded-full text-sm border ${colors.border}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
