import React, { useState, useRef, useEffect, useMemo } from "react";
import achievementsData from "../data/achievements.json";

// Define types for our achievement data
interface Achievement {
  id: number;
  title: string;
  organization: string;
  year: string;
  description: string;
  certificate?: string;
  documentationImage?: string;
  hasImage?: boolean;
  certificateImage?: string;
}

const AchievementSection: React.FC = () => {
  // Memoize achievements data to prevent unnecessary re-renders
  const memoizedAchievements = useMemo(
    () => achievementsData as Achievement[],
    []
  );

  // State for certificate modal
  const [selectedCertificate, setSelectedCertificate] =
    useState<Achievement | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setShowCertificateModal(false);
      setSelectedCertificate(null);
    }
  };

  // Effect for modal event listener
  useEffect(() => {
    if (showCertificateModal) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showCertificateModal]);

  // Handle certificate click
  const handleCertificateClick = (achievement: Achievement) => {
    setSelectedCertificate(achievement);
    setShowCertificateModal(true);
  };

  // Handle download certificate
  const handleDownloadCertificate = () => {
    if (selectedCertificate && selectedCertificate.certificate) {
      const link = document.createElement("a");
      link.href = selectedCertificate.certificate;
      link.download = `${selectedCertificate.title
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}_certificate.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle open certificate in new tab
  const handleOpenCertificateInNewTab = () => {
    if (selectedCertificate && selectedCertificate.certificate) {
      window.open(selectedCertificate.certificate, "_blank");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Achievements</h2>
      {memoizedAchievements.map((achievement) => (
        <div
          key={achievement.id}
          className="group bg-gray-900 rounded-lg p-6 mb-6 border-l-4 border-yellow-500 hover:bg-gray-800 transition-all duration-300 relative overflow-hidden"
        >
          {/* Background Image dengan Auto Crop & Zoom */}
          {achievement.documentationImage && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-1/3 h-full overflow-hidden">
                <img
                  src={achievement.documentationImage}
                  alt={`Documentation for ${achievement.title}`}
                  className="w-full h-full transition-all duration-300 group-hover:brightness-110 group-hover:scale-105"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                    minWidth: "100%",
                    minHeight: "100%",
                    width: "100%",
                    height: "100%",
                    transform: "scale(1.1)", // Auto zoom untuk memastikan tidak ada gap
                  }}
                  onError={(e) => {
                    console.log(
                      `Failed to load image: ${achievement.documentationImage}`
                    );
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                  onLoad={() => {
                    console.log(
                      `Successfully loaded image: ${achievement.documentationImage}`
                    );
                  }}
                />
                {/* Smooth fade overlay - gradual transition dari kiri ke kanan */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to right, #111827 0%, rgba(17, 24, 39, 0.95) 15%, rgba(17, 24, 39, 0.8) 30%, rgba(17, 24, 39, 0.6) 45%, rgba(17, 24, 39, 0.3) 65%, rgba(17, 24, 39, 0.1) 80%, transparent 100%)",
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Content dengan z-index lebih tinggi */}
          <div className="relative z-10 flex items-start">
            {/* Ikon Medali */}
            <div className="flex-shrink-0 mr-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Content Container dengan max-width untuk menghindari overlap */}
            <div className="flex-1 max-w-[70%] pr-4">
              <h3 className="text-xl font-semibold text-white mb-2">
                {achievement.title}
              </h3>
              <p className="text-gray-400 mb-2">
                {achievement.organization} • {achievement.year}
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                {achievement.description}
              </p>

              {/* Certificate Button */}
              {achievement.certificate && (
                <button
                  onClick={() => handleCertificateClick(achievement)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  View Certificate
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Certificate Modal */}
      {showCertificateModal && selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 transition-opacity duration-300 animate-fadeIn">
          <div
            ref={modalRef}
            className="bg-gray-900 rounded-lg w-full h-full max-w-7xl max-h-screen flex flex-col transform transition-all duration-300 scale-95 animate-scaleIn"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Certificate of Achievement
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  {selectedCertificate.title}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCertificateModal(false);
                  setSelectedCertificate(null);
                }}
                className="text-gray-400 hover:text-white text-2xl transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Certificate Content */}
            <div className="flex-1 overflow-hidden p-6">
              <div className="h-full flex items-center justify-center">
                {selectedCertificate.hasImage &&
                selectedCertificate.certificateImage ? (
                  // Show image if available
                  <img
                    src={selectedCertificate.certificateImage}
                    alt={`Certificate for ${selectedCertificate.title}`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                ) : (
                  // Show PDF if no image
                  <iframe
                    src={selectedCertificate.certificate}
                    className="w-full h-full border-0 rounded-lg"
                    title={`Certificate for ${selectedCertificate.title}`}
                  />
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-700 flex justify-between items-center">
              <div className="text-sm text-gray-400">
                <p>{selectedCertificate.organization}</p>
                <p>{selectedCertificate.year}</p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleDownloadCertificate}
                  className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-full flex items-center hover:scale-105 transition-all shadow-lg text-sm"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download
                </button>

                <button
                  onClick={handleOpenCertificateInNewTab}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center hover:bg-blue-700 transition text-sm"
                >
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Open in New Tab
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementSection;
