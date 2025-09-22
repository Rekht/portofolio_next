// components/ProjectDetailModal.tsx - Komponen modal detail proyek
import React, { useEffect, useRef } from "react";
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

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle klik di luar modal untuk menutupnya
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    // Mencegah scrolling saat modal terbuka
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  // Keluar jika tidak ada proyek yang diberikan
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 overflow-y-auto">
      <div
        ref={modalRef}
        className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 animate-scaleIn overflow-hidden"
      >
        {/* Header dengan gambar dan tombol tutup */}
        <div className="relative">
          <Image
            src={project.image}
            alt={project.title}
            width={800}
            height={400}
            className="w-full h-56 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-75 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
          </button>
        </div>

        {/* Konten */}
        <div
          className="p-6 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 224px)" }}
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags &&
              project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-600 bg-opacity-20 text-blue-400 text-xs px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
          </div>

          <h2 className="text-2xl font-bold mb-4">{project.title}</h2>

          {/* Deskripsi utama */}
          <div className="text-gray-300 mb-6 whitespace-pre-line">
            {project.detailedDescription || project.description}
          </div>

          {/* Section fitur */}
          {project.features && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">
                Fitur Utama
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                {project.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer dengan link */}
        <div className="px-6 py-4 border-t border-gray-800 flex justify-between">
          <div className="flex space-x-4">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Lihat Source Code
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
