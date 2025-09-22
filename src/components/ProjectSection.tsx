// components/ProjectSection.tsx - Komponen section proyek utama
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "./ProjectCard";
import ProjectDetailModal from "./ProjectDetailModal";
import ProjectFilterScroller from "./ProjectFilterScroller";
import projectsData from "../data/projects.json";

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
  const [visibleProjects, setVisibleProjects] = useState<
    Record<number, boolean>
  >({});
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

  // Handle perubahan filter dengan caching
  const handleFilterClick = useCallback(
    (filter: string) => {
      if (filter === activeFilter) return;

      setIsAnimating(true);

      // Mulai animasi fade out
      const updatedVisibility: Record<number, boolean> = {};
      Object.keys(visibleProjects).forEach((id) => {
        updatedVisibility[parseInt(id)] = false;
      });
      setVisibleProjects(updatedVisibility);

      // Tunggu animasi fade out selesai
      setTimeout(() => {
        setActiveFilter(filter);
        // Filter akan diupdate di useEffect berikutnya
      }, 300);
    },
    [activeFilter, visibleProjects]
  );

  // Update proyek yang ditampilkan saat filter berubah - sekarang dengan caching
  useEffect(() => {
    // Cek jika sudah ada filter ini di cache
    if (projectsCache[activeFilter] && projectsCache[activeFilter].loaded) {
      const cachedProjects = projectsCache[activeFilter].projects;
      const projectsToShow = showMoreProjects
        ? cachedProjects
        : cachedProjects.slice(0, 6);

      setProjectsToDisplay(projectsToShow);

      // Siapkan animasi fade in untuk proyek yang di-cache
      const newVisibility: Record<number, boolean> = {};
      projectsToShow.forEach((project) => {
        newVisibility[project.id] = false;
      });

      setVisibleProjects(newVisibility);

      // Mulai animasi fade-in
      setTimeout(() => {
        const updatedVisibility: Record<number, boolean> = {};
        projectsToShow.forEach((project) => {
          updatedVisibility[project.id] = true;
        });
        setVisibleProjects(updatedVisibility);
        setIsAnimating(false);

        // Refresh ScrollTrigger setelah proyek dimuat
        if (ScrollTrigger) {
          ScrollTrigger.refresh();
        }
      }, 50);
    } else {
      // Jika belum di-cache, fetch dan cache proyeknya
      const filtered = getFilteredProjects();
      const projectsToShow = showMoreProjects ? filtered : filtered.slice(0, 6);

      // Update cache dengan hasil filter baru
      setProjectsCache((prevCache) => ({
        ...prevCache,
        [activeFilter]: { projects: filtered, loaded: true },
      }));

      setProjectsToDisplay(projectsToShow);

      // Siapkan animasi fade in untuk proyek baru
      const newVisibility: Record<number, boolean> = {};
      projectsToShow.forEach((project) => {
        newVisibility[project.id] = false;
      });

      setVisibleProjects(newVisibility);

      // Delay untuk memastikan DOM sudah diupdate sebelum mulai fade in
      setTimeout(() => {
        const updatedVisibility: Record<number, boolean> = {};
        projectsToShow.forEach((project) => {
          updatedVisibility[project.id] = true;
        });
        setVisibleProjects(updatedVisibility);
        setIsAnimating(false);

        // Refresh ScrollTrigger setelah proyek dimuat
        if (ScrollTrigger) {
          ScrollTrigger.refresh();
        }
      }, 50);
    }
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

      {/* Grid Proyek dengan animasi dan penanganan state kosong */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px] mt-4">
        {isAnimating ? (
          // Tampilkan loading spinner selama animasi
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : projectsToDisplay.length > 0 ? (
          // Tampilkan proyek jika tersedia
          projectsToDisplay.map((project) =>
            project?.title && project?.image && project?.description ? (
              <div key={project.id} className="project-card-container">
                <ProjectCard
                  project={project}
                  isVisible={visibleProjects[project.id] ?? false}
                  onClick={(project) => setSelectedProject(project)}
                />
              </div>
            ) : null
          )
        ) : (
          // Tampilkan pesan jika tidak ada proyek yang cocok dengan filter
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-gray-400">
            Tidak ada proyek yang cocok dengan filter "{activeFilter}"
          </div>
        )}
      </div>

      {/* Tambahkan tombol Show More/Less jika proyek melebihi 6 */}
      {!isAnimating && getFilteredProjects().length > 6 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowMoreProjects(!showMoreProjects)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 transition-colors"
            disabled={isAnimating}
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
          </button>
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
