// components/ProjectDetailModal.tsx - Premium Modal with Glassmorphism
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onWheel={(e) => e.stopPropagation()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop with blur */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Modal container */}
      <motion.div
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col 
                       bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95
                       backdrop-blur-xl rounded-3xl border border-white/10 
                       shadow-2xl shadow-purple-500/10 overflow-hidden"
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
      >
        {/* Header with image */}
        <div className="relative h-64 md:h-72 flex-shrink-0 overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

          {/* Close button */}
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 p-3 bg-black/40 backdrop-blur-sm rounded-full 
                           text-white/80 hover:text-white hover:bg-black/60 
                           border border-white/10 transition-all duration-200"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>

          {/* Title overlay on image */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-white mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {project.title}
            </motion.h2>

            {/* Tags */}
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {project.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 
                                 backdrop-blur-sm text-white text-xs font-medium rounded-full
                                 border border-white/20"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scrollable content */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain scroll-smooth custom-scrollbar"
          style={{ scrollBehavior: "smooth" }}
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="p-6 md:p-8 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <h3 className="text-lg font-semibold text-white/90 mb-3 flex items-center gap-2">
                <span
                  className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 
                                     flex items-center justify-center text-white text-sm"
                >
                  📝
                </span>
                About
              </h3>
              <p className="text-white/70 leading-relaxed whitespace-pre-line">
                {project.detailedDescription || project.description}
              </p>
            </motion.div>

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <h3 className="text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
                  <span
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 
                                       flex items-center justify-center text-white text-sm"
                  >
                    ✨
                  </span>
                  Key Features
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-xl 
                                     bg-white/5 border border-white/10 hover:bg-white/10 
                                     transition-colors duration-200"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                    >
                      <span
                        className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 
                                           flex items-center justify-center flex-shrink-0 mt-0.5"
                      >
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                      <span className="text-white/70 text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer with action buttons */}
        {project.url && (
          <motion.div
            className="flex-shrink-0 px-6 md:px-8 py-5 border-t border-white/10 
                           bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 
                             bg-gradient-to-r from-blue-600 to-purple-600 
                             text-white font-medium rounded-full
                             hover:from-blue-500 hover:to-purple-500 
                             shadow-lg shadow-purple-500/25 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              View Source Code
            </motion.a>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProjectDetailModal;
