// components/home/SkillsPreview.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import skillsDataFallback from "@/data/skills.json";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { fetchSkills } from "@/lib/data";

import { 
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiJavascript,
  SiScikitlearn, SiTensorflow, SiPytorch, SiKeras, SiHuggingface, SiPandas, SiNumpy, SiLangchain,
  SiNodedotjs, SiFlask, SiMysql, SiPostgresql,
  SiGit, SiDocker, 
  SiBlender, SiRobloxstudio, SiGoogleearthengine, SiQgis, SiGoogle
} from "react-icons/si";
import { FaAws } from "react-icons/fa";

const CustomDataStudioIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" {...props}>
    <circle cx="8" cy="16" r="3.5" />
    <circle cx="16" cy="8" r="3.5" />
    <line x1="10.5" y1="13.5" x2="13.5" y2="10.5" />
    <line x1="5.5" y1="13.5" x2="3.5" y2="11.5" />
    <line x1="18.5" y1="10.5" x2="20.5" y2="12.5" />
  </svg>
);

const CustomPowerBIIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em" {...props}>
    <rect x="14" y="2" width="6" height="20" rx="1" />
    <rect x="9" y="8" width="6" height="14" rx="1" />
    <rect x="4" y="14" width="6" height="8" rx="1" />
  </svg>
);

interface SkillCategory {
  title: string;
  color: string;
  technologies: string[];
}

const iconMap: Record<string, React.ElementType> = {
  "React": SiReact,
  "Next.js": SiNextdotjs,
  "TypeScript": SiTypescript,
  "Tailwind CSS": SiTailwindcss,
  "JavaScript": SiJavascript,
  "scikit-learn": SiScikitlearn,
  "TensorFlow": SiTensorflow,
  "PyTorch": SiPytorch,
  "Keras": SiKeras,
  "LangChain": SiLangchain,
  "Hugging Face": SiHuggingface,
  "pandas": SiPandas,
  "NumPy": SiNumpy,
  "Power BI": CustomPowerBIIcon,
  "Data Studio": CustomDataStudioIcon,
  "Node.js": SiNodedotjs,
  "Flask API": SiFlask,
  "MySQL": SiMysql,
  "PostgreSQL": SiPostgresql,
  "Git": SiGit,
  "Docker": SiDocker,
  "AWS": FaAws,
  "Blender": SiBlender,
  "Roblox Studio": SiRobloxstudio,
  "Google Earth Engine": SiGoogleearthengine,
  "QGIS": SiQgis,
};

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
  blue: { bg: "bg-primary/10", border: "border-primary/30", text: "text-primary", hover: "hover:bg-primary/20 hover:border-primary/50" },
  red: { bg: "bg-primary/10", border: "border-primary/30", text: "text-primary", hover: "hover:bg-primary/20 hover:border-primary/50" },
  yellow: { bg: "bg-primary/10", border: "border-primary/30", text: "text-primary", hover: "hover:bg-primary/20 hover:border-primary/50" },
  green: { bg: "bg-primary/10", border: "border-primary/30", text: "text-primary", hover: "hover:bg-primary/20 hover:border-primary/50" },
  purple: { bg: "bg-primary/10", border: "border-primary/30", text: "text-primary", hover: "hover:bg-primary/20 hover:border-primary/50" },
  indigo: { bg: "bg-primary/10", border: "border-primary/30", text: "text-primary", hover: "hover:bg-primary/20 hover:border-primary/50" },
  emerald: { bg: "bg-primary/10", border: "border-primary/30", text: "text-primary", hover: "hover:bg-primary/20 hover:border-primary/50" },
};

const SkillsPreview: React.FC = () => {
  const skillsData = useSupabaseData(fetchSkills, skillsDataFallback);
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
          // Unify the background glow to the primary theme color (mapped via 'purple' in GlassCard)
          const glassColor = "purple";

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
                <div className="flex flex-wrap gap-3">
                  {(() => {
                    // Inject missing skills & map old names
                    let displayTechs = [...category.technologies];
                    if (category.title === "Backend" && !displayTechs.includes("PostgreSQL")) {
                      displayTechs.push("PostgreSQL");
                    }
                    if (category.title === "AI & Machine Learning" && !displayTechs.includes("LangChain")) {
                      displayTechs.push("LangChain");
                    }
                    displayTechs = displayTechs.map(t => t === "Google Looker" ? "Data Studio" : t);
                    
                    return displayTechs.map((tech, index) => {
                      const Icon = iconMap[tech];
                      return (
                        <div key={tech} className="relative group inline-block">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              delay: categoryIndex * 0.1 + index * 0.03,
                              duration: 0.3,
                            }}
                            whileHover={{ scale: 1.15, rotate: 5 }}
                            className={`
                              p-3 rounded-2xl cursor-default flex items-center justify-center
                              ${colors.bg} ${colors.border} ${colors.text} ${colors.hover}
                              border transition-all duration-300 text-3xl shadow-sm
                            `}
                          >
                            {Icon ? <Icon /> : <span className="text-sm font-medium px-2">{tech}</span>}
                          </motion.div>
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-foreground text-background text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20 shadow-xl">
                            {tech}
                            {/* Triangle pointer */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-foreground"></div>
                          </div>
                        </div>
                      );
                    });
                  })()}
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
