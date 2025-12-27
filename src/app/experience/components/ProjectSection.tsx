// components/ProjectSection.tsx - Komponen section proyek utama
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "./ProjectCard";
import ProjectDetailModal from "./ProjectDetailModal";
import ProjectFilterScroller from "./ProjectFilterScroller";
import projectsData from "../../../data/projects.json";

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

interface ProjectCache {
  projects: Project[];
  loaded: boolean;
}

const ProjectSection: React.FC = () => {
  // State untuk mengelola proyek dan animasi
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [projectsToDisplay, setProjectsToDisplay] = useState<Project[]>([]);
  const [showMoreProjects, setShowMoreProjects] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Cache untuk menyimpan proyek yang sudah dimuat berdasarkan filter
  const [projectsCache, setProjectsCache] = useState<
    Record<string, ProjectCache>
  >({
    All: { projects: [], loaded: false },
  });

  // Filter proyek berdasarkan filter aktif
  const getFilteredProjects = useCallback((): Project[] => {
    const projects = projectsData as Project[];
    if (activeFilter === "All") {
      return projects;
    }
    return projects.filter(
      (project) => project.tags && project.tags.includes(activeFilter)
    );
  }, [activeFilter]);

  // Handle perubahan filter dengan smooth transition
  const handleFilterClick = useCallback(
    (filter: string) => {
      if (filter === activeFilter || isAnimating) return;
      setIsAnimating(true);
      setActiveFilter(filter);
    },
    [activeFilter, isAnimating]
  );

  // Update proyek yang ditampilkan saat filter berubah
  useEffect(() => {
    let filtered: Project[];

    // Cek jika sudah ada filter ini di cache
    if (projectsCache[activeFilter] && projectsCache[activeFilter].loaded) {
      filtered = projectsCache[activeFilter].projects;
    } else {
      // Jika belum di-cache, fetch dan cache proyeknya
      filtered = getFilteredProjects();

      // Update cache dengan hasil filter baru
      setProjectsCache((prevCache) => ({
        ...prevCache,
        [activeFilter]: { projects: filtered, loaded: true },
      }));
    }

    const projectsToShow = showMoreProjects ? filtered : filtered.slice(0, 6);
    setProjectsToDisplay(projectsToShow);

    // Reset animating state after a short delay
    setTimeout(() => {
      setIsAnimating(false);
      // Refresh ScrollTrigger setelah proyek dimuat
      if (ScrollTrigger) {
        ScrollTrigger.refresh();
      }
    }, 100);
  }, [activeFilter, showMoreProjects, getFilteredProjects, projectsCache]);

  // Opsi filter yang tersedia
  const filterOptions = useMemo(
    () => [
      "All",
      "Python",
      "SQL",
      "Power BI",
      "Google Looker Studio",
      "AWS",
      "JavaScript",
      "Flutter",
    ],
    []
  );

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  // Animation variants for each card
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <section className="py-8" id="project">
      <h2 className="text-3xl font-bold mb-8">Project</h2>

      {/* Komponen filter scroller */}
      <ProjectFilterScroller
        filters={filterOptions}
        activeFilter={activeFilter}
        handleFilterClick={handleFilterClick}
        isAnimating={isAnimating}
      />

      {/* Grid Proyek dengan animasi smooth */}
      <div className="min-h-[400px] mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {projectsToDisplay.length > 0 ? (
              projectsToDisplay.map((project, index) =>
                project?.title && project?.image && project?.description ? (
                  <motion.div
                    key={project.id}
                    className="project-card-container"
                    variants={cardVariants}
                    layout
                    layoutId={`project-${project.id}`}
                  >
                    <ProjectCard
                      project={project}
                      isVisible={true}
                      onClick={(project) => setSelectedProject(project)}
                    />
                  </motion.div>
                ) : null
              )
            ) : (
              <motion.div
                className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-gray-400"
                variants={cardVariants}
              >
                Tidak ada proyek yang cocok dengan filter &quot;{activeFilter}
                &quot;
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Tambahkan tombol Show More/Less jika proyek melebihi 6 */}
      {!isAnimating && getFilteredProjects().length > 6 && (
        <div className="flex justify-center mt-8">
          <motion.button
            onClick={() => setShowMoreProjects(!showMoreProjects)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 transition-colors"
            disabled={isAnimating}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showMoreProjects ? (
              <>
                <span>Tampilkan Lebih Sedikit</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            ) : (
              <>
                <span>
                  Tampilkan Lebih Banyak ({getFilteredProjects().length - 6})
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            )}
          </motion.button>
        </div>
      )}

      {/* Modal Detail Proyek */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};

export default ProjectSection;
