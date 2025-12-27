import React, { useRef, useEffect, useState } from "react";
import certificationsData from "../../../data/certifications.json";
import GlassCard from "@/components/ui/GlassCard";

// Define types for our certification data
interface Certification {
  id: number; // Changed from string to number based on your JSON
  title: string;
  issuer: string;
  date: string;
  image: string;
  url: string;
  isEnglish?: boolean; // Made optional based on your JSON structure
}

// Type assertion - since your JSON is an array directly
const certifications = certificationsData as Certification[];

const CertificationSection: React.FC = () => {
  const certSectionRef = useRef<HTMLDivElement>(null);
  const certContainerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [hoveredCard, setHoveredCard] = useState<number | null>(null); // Changed to number
  const [showCertificate, setShowCertificate] = useState(false);
  const [currentCertificateUrl, setCurrentCertificateUrl] = useState("");

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowCertificate(false);
      }
    };

    if (showCertificate) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCertificate]);

  // Original scroll effects
  useEffect(() => {
    const certContainer = certContainerRef.current;

    const handleScroll = () => {
      if (certSectionRef.current && certContainerRef.current) {
        const certSection = certSectionRef.current;
        const certContainer = certContainerRef.current;
        const certSectionRect = certSection.getBoundingClientRect();

        if (
          certSectionRect.top < window.innerHeight &&
          certSectionRect.bottom > 0
        ) {
          const relativeScrollPos =
            (window.innerHeight - certSectionRect.top) /
            (window.innerHeight + certSectionRect.height);
          const scrollWidth =
            certContainer.scrollWidth - certContainer.clientWidth;
          const scrollAmount = Math.max(
            0,
            Math.min(scrollWidth, scrollWidth * relativeScrollPos)
          );

          certContainer.scrollTo({
            left: scrollAmount,
            behavior: "auto",
          });
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const container = certContainerRef.current;
      if (!container) return;

      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollBy({
          left: e.deltaY,
          behavior: "smooth",
        });
      }
    };

    if (certContainer) {
      window.addEventListener("scroll", handleScroll);
      certContainer.addEventListener("wheel", handleWheel as EventListener, {
        passive: false,
      });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (certContainer) {
        certContainer.removeEventListener(
          "wheel",
          handleWheel as EventListener
        );
      }
    };
  }, []);

  const scrollLeft = () => {
    if (certContainerRef.current) {
      certContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (certContainerRef.current) {
      certContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  const handleCertificateClick = (cert: Certification) => {
    if (cert.isEnglish) {
      // For TOEFL certificate (isEnglish: true), show the popup modal
      setCurrentCertificateUrl(cert.url);
      setShowCertificate(true);
    } else {
      // For all other certificates, open the link directly
      window.open(cert.url, "_blank");
    }
  };

  return (
    <div ref={certSectionRef} className="py-12">
      <GlassCard accentColor="blue" noAnimation>
        <h2 className="text-4xl font-bold mb-4 text-white text-center">
          Certifications
        </h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>

        <div className="relative -mx-8">
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800 bg-opacity-60 rounded-full p-2 cursor-pointer hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 shadow-md"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <svg
              className="w-5 h-5 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800 bg-opacity-60 rounded-full p-2 cursor-pointer hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 shadow-md"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <svg
              className="w-5 h-5 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div
            ref={certContainerRef}
            className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory py-4 px-2"
            style={{ scrollBehavior: "smooth" }}
          >
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className={`flex-shrink-0 w-80 mx-4 snap-center overflow-hidden shadow-xl transform transition-all duration-300 cert-card ${
                  hoveredCard === cert.id ? "scale-102" : ""
                }`}
                onMouseEnter={() => setHoveredCard(cert.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  borderRadius: "24px",
                  background: cert.isEnglish
                    ? "linear-gradient(145deg, #1e3a8a, #1e40af)"
                    : "linear-gradient(145deg, #1f2937, #111827)",
                  boxShadow: cert.isEnglish
                    ? "0 10px 20px -5px rgba(59, 130, 246, 0.5), 0 5px 10px -5px rgba(59, 130, 246, 0.3)"
                    : hoveredCard === cert.id
                    ? "0 10px 20px -5px rgba(0, 0, 0, 0.3), 0 5px 10px -5px rgba(0, 0, 0, 0.2), 0 0 10px rgba(59, 130, 246, 0.3)"
                    : "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  border: cert.isEnglish
                    ? "2px solid rgba(59, 130, 246, 0.5)"
                    : "none",
                }}
              >
                <div className="flex flex-col h-full">
                  <div
                    className="bg-gray-800 relative overflow-hidden"
                    style={{
                      borderTopLeftRadius: "24px",
                      borderTopRightRadius: "24px",
                    }}
                  >
                    <div className="p-4 flex justify-center items-start">
                      {!imageErrors[cert.id] && (
                        <img
                          src={cert.image}
                          alt={cert.title}
                          className="w-full h-44 object-contain object-top rounded-xl shadow-md transition-opacity duration-300 ease-in-out"
                          onError={(e) => {
                            console.error(
                              `Error loading image for ${cert.title}:`,
                              cert.image
                            );
                            setImageErrors((prev) => ({
                              ...prev,
                              [cert.id]: true,
                            }));
                          }}
                        />
                      )}

                      {imageErrors[cert.id] && (
                        <div className="w-full h-44 flex items-center justify-center text-gray-500">
                          <svg
                            className="w-16 h-16"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className="p-6 flex-grow flex flex-col bg-gray-800 cert-content"
                    style={{
                      borderBottomLeftRadius: "24px",
                      borderBottomRightRadius: "24px",
                    }}
                  >
                    <h3
                      className={`text-lg font-bold mb-2 line-clamp-2 ${
                        cert.isEnglish ? "text-blue-300" : "text-white"
                      }`}
                    >
                      {cert.title}
                    </h3>
                    <div className="flex items-center mb-2">
                      <span
                        className={`font-medium ${
                          cert.isEnglish ? "text-blue-300" : "text-blue-400"
                        }`}
                      >
                        {cert.issuer}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm mb-4">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{cert.date}</span>
                    </div>
                    <div className="mt-auto">
                      <button
                        onClick={() => handleCertificateClick(cert)}
                        className={`inline-flex items-center px-4 py-2 transition-colors duration-300 text-sm font-medium ${
                          cert.isEnglish
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                        style={{
                          borderRadius: "16px",
                          boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        }}
                      >
                        <span>View Certificate</span>
                        <svg
                          className="w-4 h-4 ml-2"
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
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Certificate Popup Modal - Only shown for TOEFL certificate */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 transition-opacity duration-300 animate-fadeIn">
          <div
            ref={modalRef}
            className="bg-gray-900 rounded-lg w-full h-full max-w-7xl max-h-screen flex flex-col transform transition-all duration-300 scale-95 animate-scaleIn"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">
                Certificate Preview
              </h3>
              <button
                onClick={() => setShowCertificate(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              <iframe
                src={currentCertificateUrl}
                className="w-full h-full"
                title="Certificate"
              />
            </div>

            <div className="px-6 py-4 border-t border-gray-700 flex justify-between items-center">
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = currentCertificateUrl;
                  link.download = "Certificate.pdf";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
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
                Download Certificate
              </button>

              <button
                onClick={() => window.open(currentCertificateUrl, "_blank")}
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
      )}
    </div>
  );
};

export default CertificationSection;
