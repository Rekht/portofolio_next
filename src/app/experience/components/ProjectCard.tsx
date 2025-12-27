// components/ProjectCard.tsx - Komponen kartu proyek
import React from "react";
import Image from "next/image";
import GlassCard from "@/components/ui/GlassCard";

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

interface ProjectCardProps {
  project: Project;
  isVisible: boolean;
  onClick: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isVisible,
  onClick,
}) => {
  // Fungsi untuk membatasi jumlah tag yang ditampilkan
  const renderTags = (tags: string[] | undefined) => {
    if (!tags || tags.length === 0) return null;

    // Tampilkan maksimal 3 tag saja
    const visibleTags = tags.slice(0, 3);

    return (
      <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
        {visibleTags.map((tag, i) => (
          <span
            key={i}
            className="bg-blue-500/20 text-blue-300 text-xs px-3 py-1 rounded-full truncate border border-blue-500/30"
          >
            {tag}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="text-gray-400 text-xs">+{tags.length - 3}</span>
        )}
      </div>
    );
  };

  return (
    <div
      className={`transition-all duration-300 transform hover:scale-105 cursor-pointer w-full h-96 flex flex-col ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={() => onClick(project)}
    >
      <GlassCard
        accentColor="blue"
        noAnimation
        noPadding
        className="h-full flex flex-col overflow-hidden"
      >
        <div className="w-full h-48 overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            width={400}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold mb-2 truncate">{project.title}</h3>
          <p className="text-gray-400 mb-4 line-clamp-2 overflow-hidden text-sm h-10">
            {project.description}
          </p>
          <div className="mb-4 h-8">{renderTags(project.tags)}</div>
          <div className="flex justify-between items-center mt-auto">
            <div className="flex space-x-3">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Kode
                  </span>
                </a>
              )}
            </div>
            <button
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                onClick(project);
              }}
            >
              Detail
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default ProjectCard;
