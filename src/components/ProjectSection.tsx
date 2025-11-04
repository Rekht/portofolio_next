// components/ProjectSection.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FocusCards } from "@/components/ui/focus-cards";
import projectsData from "@/data/projects.json";

const ProjectSection: React.FC = () => {
  const router = useRouter();

  // Ambil 3 proyek pertama
  const projects = projectsData.slice(0, 3).map((project) => ({
    title: project.title,
    src: project.image_thumb || project.image,
  }));

  return (
    <div className="w-full relative">
      {/* Tombol View All di kiri atas */}
      <button
        onClick={() => router.push("/experience")}
        className="absolute top-0 left-0 mt-2 ml-4 z-20 px-5 py-2 border border-white/50 text-white text-sm rounded-full 
                   bg-transparent backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/10"
      >
        View All Projects
      </button>

      {/* Header Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          Projects
        </h2>
      </div>

      {/* Focus Cards */}
      <div className="relative w-full">
        <FocusCards cards={projects} />
      </div>
    </div>
  );
};

export default ProjectSection;
