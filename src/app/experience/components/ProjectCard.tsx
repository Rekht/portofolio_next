// ProjectCard.tsx - Cards yang MEMANJANG (tall/vertical)
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Project {
  id: number;
  title: string;
  image: string;
  description: string;
  detailedDescription?: string;
  features?: string[];
  tags?: string[];
  url?: string;
}

// Variants:
// - "large": Very tall (3 rows), image top + full description bottom
// - "medium": Medium tall (1-2 rows), image + title + short desc
// - "small": Compact tall, image top + title + short desc
type CardVariant = "large" | "medium" | "small";

interface ProjectCardProps {
  project: Project;
  isVisible: boolean;
  onClick: (project: Project) => void;
  variant?: CardVariant;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
  variant = "medium",
}) => {
  // LARGE card - spans 3 rows, image dominant with full description
  if (variant === "large") {
    return (
      <motion.div
        className="group w-full h-full cursor-pointer"
        onClick={() => onClick(project)}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="w-full h-full rounded-2xl overflow-hidden 
                        bg-slate-800/40 backdrop-blur-xl 
                        border border-white/10 hover:border-purple-500/30
                        flex flex-col transition-all duration-300"
        >
          {/* Image - takes ~60% of height */}
          <div className="relative flex-[3] min-h-0">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 35vw"
            />
          </div>

          {/* Text section - takes ~40% */}
          <div className="p-4 flex-[2] flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <p className="text-[10px] uppercase tracking-widest text-purple-400/80 font-semibold">
                Project:
              </p>
            </div>
            <h3 className="text-lg font-bold text-white leading-tight mb-2">
              {project.title}
            </h3>
            <p className="text-white/60 text-xs leading-relaxed line-clamp-4">
              {project.description}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // MEDIUM card - image top, title + short description below
  if (variant === "medium") {
    return (
      <motion.div
        className="group w-full h-full cursor-pointer"
        onClick={() => onClick(project)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.25 }}
      >
        <div
          className="w-full h-full rounded-xl overflow-hidden 
                        bg-slate-800/40 backdrop-blur-xl 
                        border border-white/10 hover:border-purple-500/30
                        flex flex-col transition-all duration-300"
        >
          {/* Image - top section */}
          <div className="relative flex-[2] min-h-0">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>

          {/* Text - bottom section */}
          <div className="p-3 flex-1 flex flex-col justify-center">
            <h3 className="text-sm font-bold text-white leading-tight mb-1">
              {project.title}
            </h3>
            <p className="text-white/50 text-xs leading-snug line-clamp-2">
              {project.description}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // SMALL card - compact, image + title + short description
  return (
    <motion.div
      className="group w-full h-full cursor-pointer"
      onClick={() => onClick(project)}
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="w-full h-full rounded-xl overflow-hidden 
                      bg-slate-800/40 backdrop-blur-xl 
                      border border-white/10 hover:border-purple-500/30
                      flex flex-col transition-all duration-300"
      >
        {/* Image - top, takes most space */}
        <div className="relative flex-[3] min-h-0">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 33vw, 20vw"
          />
        </div>

        {/* Text - bottom, compact */}
        <div className="p-2 flex-1 flex flex-col justify-center">
          <h3 className="text-xs font-bold text-white leading-tight mb-0.5">
            {project.title}
          </h3>
          <p className="text-white/50 text-[10px] leading-snug line-clamp-2">
            {project.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
