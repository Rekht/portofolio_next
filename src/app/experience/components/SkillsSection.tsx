// components/SkillsSection.tsx
import React from "react";
import skillsDataFallback from "@/data/skills.json";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { fetchSkills } from "@/lib/data";
import GlassCard from "@/components/ui/GlassCard";

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

// Simplified color mapping for uniform theme
const themeColors = {
  bg: "bg-primary/10 hover:bg-primary/20 transition-colors",
  text: "text-primary",
  border: "border-primary/20 hover:border-primary/40",
  heading: "text-foreground", // Make headings normal text color
};

const SkillsSection: React.FC = () => {
  const skillsData = useSupabaseData(fetchSkills, skillsDataFallback as SkillsData);
  const { skills } = skillsData as SkillsData;

  return (
    <section className="py-16 skills-section">
      <GlassCard accentColor="purple" noAnimation>
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-accent-gradient-from to-accent-gradient-to bg-clip-text text-transparent">
          Skills & Technologies
        </h2>
        <p className="text-muted-foreground text-center mb-8 text-lg">
          Technologies and skills I've developed throughout my career and
          projects
        </p>

        {/* Skill categories */}
        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(skills).map(([key, category]) => {
            const colors = themeColors;

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
                <div className="flex flex-wrap justify-center gap-3">
                  {(() => {
                    let displayTechs = [...category.technologies];
                    if (category.title === "Backend" && !displayTechs.includes("PostgreSQL")) {
                      displayTechs.push("PostgreSQL");
                    }
                    if (category.title === "AI & Machine Learning" && !displayTechs.includes("LangChain")) {
                      displayTechs.push("LangChain");
                    }
                    displayTechs = displayTechs.map(t => t === "Google Looker" ? "Data Studio" : t);

                    return displayTechs.map((tech) => {
                      const Icon = iconMap[tech];
                      return (
                        <div key={tech} className="relative group inline-block">
                          <div
                            className={`
                              p-3 rounded-2xl cursor-default flex items-center justify-center
                              ${colors.bg} ${colors.text} ${colors.border}
                              border transition-all duration-300 text-3xl shadow-sm hover:scale-110 hover:rotate-6
                            `}
                          >
                            {Icon ? <Icon /> : <span className="text-sm font-medium px-2">{tech}</span>}
                          </div>
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-foreground text-background text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20 shadow-xl">
                            {tech}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-foreground"></div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </section>
  );
};

export default SkillsSection;
