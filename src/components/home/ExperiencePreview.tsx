// components/home/ExperiencePreview.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { FocusCards } from "@/components/ui/focus-cards";
import { usePageTransition } from "@/components/PageTransition";
import experienceData from "@/data/experience.json";
import projectsData from "@/data/projects.json";

interface Experience {
  id: number;
  company: string;
  position: string;
  duration: string;
  location?: string;
  technologies?: string[];
}

const ExperiencePreview: React.FC = () => {
  const { startTransition, isTransitioning } = usePageTransition();

  // Get first 2 experiences
  const experiences = (experienceData as Experience[]).slice(0, 2);

  // Get first 3 projects for FocusCards
  const projects = projectsData.slice(0, 3).map((project) => ({
    title: project.title,
    src: project.image_thumb || project.image,
  }));

  const handleViewAll = () => {
    if (isTransitioning) return;
    startTransition("/experience");
  };

  return (
    <div className="w-full relative">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Experience & Projects
          </h2>
          <p className="text-gray-400">My professional journey and work</p>
        </div>
        <motion.button
          onClick={handleViewAll}
          className="px-5 py-2.5 border border-white/30 text-white text-sm rounded-full 
                     bg-white/5 backdrop-blur-sm transition-all duration-300 
                     hover:border-white/60 hover:bg-white/10 flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View All
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.button>
      </div>

      {/* Timeline Experience Cards */}
      <div className="relative mb-12">
        {/* Timeline line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent" />

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="relative pl-10"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-6 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-4 border-black/50 z-10" />

              <GlassCard
                accentColor="blue"
                noAnimation
                className="hover:scale-[1.01] transition-transform"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {exp.position}
                    </h3>
                    <h4 className="text-blue-400 font-medium mb-2">
                      {exp.company}
                    </h4>
                    {exp.location && (
                      <p className="text-gray-400 text-sm flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {exp.location}
                      </p>
                    )}
                  </div>
                  <span className="inline-block bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium border border-blue-500/30 whitespace-nowrap">
                    {exp.duration}
                  </span>
                </div>

                {/* Technologies */}
                {exp.technologies && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {exp.technologies.slice(0, 5).map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs rounded-full bg-white/5 text-gray-300 border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                    {exp.technologies.length > 5 && (
                      <span className="px-3 py-1 text-xs rounded-full bg-white/5 text-gray-400">
                        +{exp.technologies.length - 5}
                      </span>
                    )}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          Featured Projects
        </h3>
        <FocusCards cards={projects} />
      </motion.div>
    </div>
  );
};

export default ExperiencePreview;
