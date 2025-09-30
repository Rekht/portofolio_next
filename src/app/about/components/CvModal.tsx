// components/CvModal.tsx - Komponen modal CV
import React, { useRef, useEffect, useCallback } from "react";

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CvModal: React.FC<CvModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Tutup modal saat klik di luar
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    },
    [onClose]
  );

  // Effect untuk event listener modal
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, handleClickOutside]);

  // Handle download CV
  const handleDownloadCV = useCallback(() => {
    const link = document.createElement("a");
    link.href = "/assets/cv.pdf";
    link.download = "Restu_Anggoro_CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Handle buka CV di tab baru
  const handleOpenCVInNewTab = useCallback(() => {
    window.open("/assets/cv.pdf", "_blank");
  }, []);

  // Jangan render jika tidak terbuka
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 transition-opacity duration-300 animate-fadeIn">
      <div
        ref={modalRef}
        className="bg-gray-900 rounded-lg w-full h-full max-w-7xl max-h-screen flex flex-col transform transition-all duration-300 scale-95 animate-scaleIn"
      >
        {/* Header Modal */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">
            Curriculum Vitae Saya
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            &times;
          </button>
        </div>

        {/* PDF Viewer - hanya dimuat saat modal diaktifkan */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src="/assets/cv.pdf"
            className="w-full h-full"
            title="My Curriculum Vitae"
          />
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-4 border-t border-gray-700 flex justify-between items-center">
          <button
            onClick={handleDownloadCV}
            className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-full flex items-center hover:scale-105 transition-all shadow-lg"
          >
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              ></path>
            </svg>
            Download CV
          </button>

          <button
            onClick={handleOpenCVInNewTab}
            className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center hover:bg-blue-700 transition text-sm"
          >
            Open in New Tab
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CvModal;
