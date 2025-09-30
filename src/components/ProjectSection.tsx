// components/ProjectSection.tsx
"use client";

import React from "react";
import { FocusCards } from "@/components/ui/focus-cards";
import projectsData from "@/data/projects.json";

const ProjectSection: React.FC = () => {
  // Transform projects data to match FocusCards format - ambil 3 pertama saja
  const projects = projectsData.slice(0, 3).map((project) => ({
    title: project.title,
    src: project.image_thumb || project.image, // Use image_thumb if available, fallback to image
  }));

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          Projects
        </h2>
      </div>

      {/* Focus Cards */}
      <div className="w-full">
        <FocusCards cards={projects} />
      </div>
    </div>
  );
};

export default ProjectSection;
