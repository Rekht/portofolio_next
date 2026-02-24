// components/ProjectSection.tsx - Fixed 1-2-3 Vertical Bento Grid
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard from "./ProjectCard";
import { useRouter } from "next/navigation";
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

type CardVariant = "large" | "medium" | "small";

export const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove non-word characters
    .trim()
    .replace(/\s+/g, "-"); // Replace spaces with dashes
};

const ProjectSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [projectsToDisplay, setProjectsToDisplay] = useState<Project[]>([]);
  const [showMoreProjects, setShowMoreProjects] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const router = useRouter();

  const [projectsCache, setProjectsCache] = useState<
    Record<string, ProjectCache>
  >({
    All: { projects: [], loaded: false },
  });

  // 1-2-3 VERTICAL Pattern (exactly like mockup):
  //
  // Row 1: [LARGE        ] [Medium Top  ] [Small 1]
  // Row 2: [LARGE        ] [Medium Bot  ] [Small 2]
  // Row 3: [LARGE (cont) ] [Med (cont)  ] [Small 3]
  //
  // Col 1: 1 card spanning 3 rows (LARGE)
  // Col 2: 2 cards - top spans 1 row, bottom spans 2 rows (asymmetric!)
  // Col 3: 3 cards - each spans 1 row

  const getCardConfig = (
    index: number,
  ): { variant: CardVariant; gridStyle: React.CSSProperties } => {
    switch (index) {
      case 0: // LARGE - Col 1, spans ALL 3 rows
        return {
          variant: "large",
          gridStyle: { gridColumn: "1 / 2", gridRow: "1 / 4" },
        };
      case 1: // Medium - Col 2, Row 1 only
        return {
          variant: "medium",
          gridStyle: { gridColumn: "2 / 3", gridRow: "1 / 2" },
        };
      case 2: // Medium TALL - Col 2, Rows 2-3 (spans 2 rows!)
        return {
          variant: "medium",
          gridStyle: { gridColumn: "2 / 3", gridRow: "2 / 4" },
        };
      case 3: // Small - Col 3, Row 1
        return {
          variant: "small",
          gridStyle: { gridColumn: "3 / 4", gridRow: "1 / 2" },
        };
      case 4: // Small - Col 3, Row 2
        return {
          variant: "small",
          gridStyle: { gridColumn: "3 / 4", gridRow: "2 / 3" },
        };
      case 5: // Small - Col 3, Row 3
        return {
          variant: "small",
          gridStyle: { gridColumn: "3 / 4", gridRow: "3 / 4" },
        };
      default:
        return {
          variant: "small",
          gridStyle: {},
        };
    }
  };

  const getFilteredProjects = useCallback((): Project[] => {
    const projects = projectsData as Project[];
    if (activeFilter === "All") {
      return projects;
    }
    return projects.filter(
      (project) => project.tags && project.tags.includes(activeFilter),
    );
  }, [activeFilter]);

  const handleFilterClick = useCallback(
    (filter: string) => {
      if (filter === activeFilter || isAnimating) return;
      setIsAnimating(true);
      setActiveFilter(filter);
    },
    [activeFilter, isAnimating],
  );

  useEffect(() => {
    let filtered: Project[];

    if (projectsCache[activeFilter] && projectsCache[activeFilter].loaded) {
      filtered = projectsCache[activeFilter].projects;
    } else {
      filtered = getFilteredProjects();
      setProjectsCache((prevCache) => ({
        ...prevCache,
        [activeFilter]: { projects: filtered, loaded: true },
      }));
    }

    // Main grid shows 6 cards
    const projectsToShow = showMoreProjects ? filtered : filtered.slice(0, 6);
    setProjectsToDisplay(projectsToShow);

    setTimeout(() => {
      setIsAnimating(false);
      if (ScrollTrigger) {
        ScrollTrigger.refresh();
      }
    }, 100);
  }, [activeFilter, showMoreProjects, getFilteredProjects, projectsCache]);

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
    [],
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 200, damping: 20 },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  const filteredProjects = getFilteredProjects();
  const mainGridProjects = projectsToDisplay.slice(0, 6);
  const extraProjects = showMoreProjects ? projectsToDisplay.slice(6) : [];

  return (
    <section className="py-16" id="project">
      {/* Section Header */}
      <div className="mb-12 text-center">
        <motion.h2
          className="text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Projects
        </motion.h2>
        <motion.p
          className="text-muted-foreground text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Explore my work across different technologies
        </motion.p>
      </div>

      {/* Filter Scroller */}
      <ProjectFilterScroller
        filters={filterOptions}
        activeFilter={activeFilter}
        handleFilterClick={handleFilterClick}
        isAnimating={isAnimating}
      />

      {/* 1-2-3 Vertical Bento Grid */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            className="grid gap-3"
            style={{
              gridTemplateColumns: "1.6fr 1.2fr 1fr",
              gridTemplateRows: "160px 160px 160px", // 3 equal rows = 480px total height
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {mainGridProjects.length > 0 ? (
              mainGridProjects.map((project, index) => {
                if (
                  !project?.title ||
                  !project?.image ||
                  !project?.description
                ) {
                  return null;
                }

                const { variant, gridStyle } = getCardConfig(index);

                return (
                  <motion.div
                    key={project.id}
                    className="w-full h-full"
                    style={gridStyle}
                    variants={cardVariants}
                    layout
                  >
                    <ProjectCard
                      project={project}
                      isVisible={true}
                      onClick={(project) =>
                        router.push(`/project/${createSlug(project.title)}`)
                      }
                      variant={variant}
                    />
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                className="col-span-3 flex flex-col items-center justify-center py-16"
                variants={cardVariants}
              >
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-lg text-white/60">
                  No projects found for &quot;{activeFilter}&quot;
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Extra Projects Grid - Simple Auto-fill */}
        <AnimatePresence>
          {extraProjects.length > 0 && (
            <motion.div
              className="grid grid-cols-3 gap-3 mt-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
                opacity: { duration: 0.3 },
              }}
            >
              {extraProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="h-[240px]"
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 18,
                    delay: index * 0.08,
                  }}
                  layout
                >
                  <ProjectCard
                    project={project}
                    isVisible={true}
                    onClick={(p) =>
                      router.push(`/project/${createSlug(p.title)}`)
                    }
                    variant="small"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Show More/Less Button */}
      {filteredProjects.length > 6 && (
        <div className="flex justify-center mt-8">
          <motion.button
            onClick={() => setShowMoreProjects(!showMoreProjects)}
            className="group flex items-center gap-2 px-6 py-3 
                       bg-gradient-to-r from-blue-600/20 to-purple-600/20 
                       text-foreground dark:text-white rounded-xl border border-border dark:border-white/15 
                       hover:border-foreground/30 dark:hover:border-white/30 hover:from-blue-600/30 hover:to-purple-600/30
                       backdrop-blur-md transition-all duration-300 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="font-medium">
              {showMoreProjects
                ? "Show Less"
                : `Show ${filteredProjects.length - 6} More`}
            </span>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              animate={{ rotate: showMoreProjects ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </motion.svg>
          </motion.button>
        </div>
      )}

      {/* Project Detail Modal Removed */}
    </section>
  );
};

export default ProjectSection;
