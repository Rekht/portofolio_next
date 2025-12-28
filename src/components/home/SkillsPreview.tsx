// components/home/SkillsPreview.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import skillsData from "@/data/skills.json";

interface SkillCategory {
  title: string;
  color: string;
  technologies: string[];
}

// Map skill colors to GlassCard supported colors
const glassCardColorMap: Record<
  string,
  "purple" | "cyan" | "fuchsia" | "blue" | "green" | "orange"
> = {
  blue: "blue",
  red: "orange", // fallback
  yellow: "orange", // fallback
  green: "green",
  purple: "purple",
  indigo: "purple", // fallback
  emerald: "green", // fallback
};

const colorMap: Record<
  string,
  { bg: string; border: string; text: string; hover: string }
> = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-600 dark:text-blue-300",
    hover: "hover:bg-blue-500/20 hover:border-blue-500/50",
  },
  red: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-600 dark:text-red-300",
    hover: "hover:bg-red-500/20 hover:border-red-500/50",
  },
  yellow: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    text: "text-yellow-600 dark:text-yellow-300",
    hover: "hover:bg-yellow-500/20 hover:border-yellow-500/50",
  },
  green: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-600 dark:text-green-300",
    hover: "hover:bg-green-500/20 hover:border-green-500/50",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-600 dark:text-purple-300",
    hover: "hover:bg-purple-500/20 hover:border-purple-500/50",
  },
  indigo: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    text: "text-indigo-600 dark:text-indigo-300",
    hover: "hover:bg-indigo-500/20 hover:border-indigo-500/50",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-600 dark:text-emerald-300",
    hover: "hover:bg-emerald-500/20 hover:border-emerald-500/50",
  },
};

const SkillsPreview: React.FC = () => {
  const skills = skillsData.skills as Record<string, SkillCategory>;

  return (
    <div className="w-full relative">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Technical Skills
        </h2>
        <p className="text-muted-foreground">Technologies I work with</p>
      </div>

      {/* Skills by Category */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(skills).map(([key, category], categoryIndex) => {
          const colors = colorMap[category.color] || colorMap.blue;
          const glassColor = glassCardColorMap[category.color] || "purple";

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1, duration: 0.4 }}
            >
              <GlassCard
                accentColor={glassColor}
                noAnimation
                className="h-full hover:scale-[1.02] transition-transform"
              >
                {/* Category Header */}
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`w-3 h-3 rounded-full ${colors.bg} ${colors.border} border`}
                  />
                  <h3 className={`font-semibold ${colors.text}`}>
                    {category.title}
                  </h3>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {category.technologies.map((tech, index) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: categoryIndex * 0.1 + index * 0.03,
                        duration: 0.3,
                      }}
                      whileHover={{ scale: 1.05 }}
                      className={`
                        px-3 py-1.5 rounded-full text-xs font-medium cursor-default
                        ${colors.bg} ${colors.border} ${colors.text} ${colors.hover}
                        border transition-all duration-200
                      `}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillsPreview;
