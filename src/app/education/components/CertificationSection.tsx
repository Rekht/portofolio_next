import React, { useRef, useEffect, useState, useCallback } from "react";
import { jsPDF } from "jspdf";
import GlassCard from "@/components/ui/GlassCard";

// Define types for our certification data
interface Certification {
  id: number;
  title: string;
  title_en: string;
  issuer: string;
  date: string;
  created_at: string;
  image: string;
  url: string;
  isEnglish?: boolean;
}

// Type assertion - since your JSON is an array directly
// (Removed static 'certifications' assignment to use hook inside component)

interface CertificationSectionProps {
  certificationsData: Certification[];
}

const CertificationSection: React.FC<CertificationSectionProps> = ({ certificationsData: certifications }) => {

  const certSectionRef = useRef<HTMLDivElement>(null);
  const certContainerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [currentCertificateUrl, setCurrentCertificateUrl] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Download all certificates as a single PDF
  const downloadAllCerts = useCallback(async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: "a4",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < certifications.length; i++) {
        const cert = certifications[i];
        setDownloadProgress(i + 1);

        try {
          // Fetch image and convert to base64 via canvas
          const img = new Image();
          img.crossOrigin = "anonymous";
          const imageData = await new Promise<string>((resolve, reject) => {
            img.onload = () => {
              const canvas = document.createElement("canvas");
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
              const ctx = canvas.getContext("2d")!;
              ctx.drawImage(img, 0, 0);
              resolve(canvas.toDataURL("image/jpeg", 0.85));
            };
            img.onerror = () =>
              reject(new Error(`Failed to load ${cert.title}`));
            img.src = cert.image;
          });

          // Add new page for all certs after the first
          if (i > 0) pdf.addPage();

          // Calculate dimensions to fit the image within the page (with padding)
          const padding = 40;
          const maxW = pageWidth - padding * 2;
          const maxH = pageHeight - padding * 2 - 30; // extra space for title
          const ratio = Math.min(
            maxW / img.naturalWidth,
            maxH / img.naturalHeight,
          );
          const imgW = img.naturalWidth * ratio;
          const imgH = img.naturalHeight * ratio;
          const x = (pageWidth - imgW) / 2;

          // Add title
          pdf.setFontSize(14);
          pdf.setFont("helvetica", "bold");
          pdf.text(
            `${cert.title_en} — ${cert.issuer}`,
            pageWidth / 2,
            padding,
            {
              align: "center",
            },
          );

          // Add clickable link below the title (pushed down more)
          const linkY = padding + 24; // Increased from 16 to 24
          pdf.setFontSize(12);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(59, 130, 246); // blue
          const linkText = "View Certificate";
          pdf.textWithLink(
            linkText,
            pageWidth / 2 - pdf.getTextWidth(linkText) / 2,
            linkY,
            {
              url: cert.url.startsWith("/")
                ? `https://restuanggorokasih-portofolio.vercel.app${cert.url}`
                : cert.url,
            },
          );
          pdf.setTextColor(0, 0, 0); // reset to black

          // Add image below link (adjust Y position to account for link and extra padding)
          const imageStartY = linkY + 24; // Increased from 16 to 24

          // Recalculate max height since we added the link
          const maxHWithLink = pageHeight - padding - imageStartY - 10;
          const ratioWithLink = Math.min(
            maxW / img.naturalWidth,
            maxHWithLink / img.naturalHeight,
          );
          const imgWFinal = img.naturalWidth * ratioWithLink;
          const imgHFinal = img.naturalHeight * ratioWithLink;
          const xFinal = (pageWidth - imgWFinal) / 2;

          pdf.addImage(
            imageData,
            "JPEG",
            xFinal,
            imageStartY,
            imgWFinal,
            imgHFinal,
          );
        } catch (imgErr) {
          // If a single image fails, add an error page instead of aborting
          if (i > 0) pdf.addPage();
          pdf.setFontSize(16);
          pdf.text(
            `Could not load: ${cert.title}`,
            pageWidth / 2,
            pageHeight / 2,
            { align: "center" },
          );
          console.error(imgErr);
        }
      }

      pdf.save("Restu_All_Certifications.pdf");
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Gagal membuat PDF. Silakan coba lagi.");
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  }, [isDownloading]);

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
            Math.min(scrollWidth, scrollWidth * relativeScrollPos),
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
          handleWheel as EventListener,
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
      <GlassCard accentColor="purple" noAnimation>
        <div className="relative -mx-8">
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-secondary bg-opacity-60 rounded-full p-2 cursor-pointer hover:bg-accent transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 shadow-md"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <svg
              className="w-5 h-5 text-muted-foreground"
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
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-secondary bg-opacity-60 rounded-full p-2 cursor-pointer hover:bg-accent transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 shadow-md"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <svg
              className="w-5 h-5 text-muted-foreground"
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
                className={`flex-shrink-0 w-80 mx-4 snap-center rounded-[24px] overflow-hidden shadow-xl transform transition-all duration-300 cert-card relative ${
                  hoveredCard === cert.id ? "scale-102" : ""
                } ${
                  cert.isEnglish
                    ? "bg-gradient-to-br from-primary/5 to-accent-gradient-to/5 border-[1.5px] border-primary/20"
                    : "bg-card/90 border border-border"
                }`}
                onMouseEnter={() => setHoveredCard(cert.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  boxShadow: cert.isEnglish
                    ? "0 10px 20px -5px var(--tw-shadow-color, rgba(0,0,0,0.1)), 0 5px 10px -5px var(--tw-shadow-color, rgba(0,0,0,0.1))"
                    : hoveredCard === cert.id
                      ? "0 10px 20px -5px rgba(0, 0, 0, 0.15), 0 5px 10px -5px rgba(0, 0, 0, 0.1), 0 0 10px rgba(0, 0, 0, 0.05)"
                      : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div className="flex flex-col h-full">
                  <div
                    className={`${cert.isEnglish ? "bg-transparent" : "bg-card/90 border-x border-t border-border"} relative overflow-hidden`}
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
                              cert.image,
                            );
                            setImageErrors((prev) => ({
                              ...prev,
                              [cert.id]: true,
                            }));
                          }}
                        />
                      )}

                      {imageErrors[cert.id] && (
                        <div className="w-full h-44 flex items-center justify-center text-muted-foreground">
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
                    className={`p-6 flex-grow flex flex-col cert-content ${cert.isEnglish ? "bg-transparent" : "bg-card/90 border-x border-b border-border"}`}
                    style={{
                      borderBottomLeftRadius: "24px",
                      borderBottomRightRadius: "24px",
                    }}
                  >
                    <h3
                      className={`text-lg font-bold mb-2 line-clamp-2 ${
                        cert.isEnglish
                          ? "text-primary-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {cert.title_en}
                    </h3>
                    <div className="flex items-center mb-2">
                      <span
                        className={`font-medium ${
                          cert.isEnglish
                            ? "text-primary"
                            : "text-primary"
                        }`}
                      >
                        {cert.issuer}
                      </span>
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm mb-1">
                      <svg
                        className="w-4 h-4 mr-1 flex-shrink-0"
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
                      <span>Valid: {cert.date}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground text-xs mb-4">
                      <svg
                        className="w-3.5 h-3.5 mr-1 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Issued: {cert.created_at}</span>
                    </div>
                    <div className="mt-auto">
                      <button
                        onClick={() => handleCertificateClick(cert)}
                        className={`inline-flex items-center px-4 py-2 transition-colors duration-300 text-sm font-medium ${
                          cert.isEnglish
                            ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                            : "bg-primary hover:bg-primary/90 text-primary-foreground"
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

        {/* Download All Button */}
        <div className="flex justify-center mt-6 px-4">
          <button
            onClick={downloadAllCerts}
            disabled={isDownloading}
            className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-accent-gradient-from to-accent-gradient-to hover:from-accent-gradient-from/90 hover:to-accent-gradient-to/90 text-white font-semibold rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-wait"
          >
            {isDownloading ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <span>
                  Generating PDF... ({downloadProgress}/{certifications.length})
                </span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-y-0.5"
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
                <span>Download All Certificates (PDF)</span>
              </>
            )}
          </button>
        </div>
      </GlassCard>

      {/* Certificate Popup Modal - Only shown for TOEFL certificate */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 transition-opacity duration-300 animate-fadeIn">
          <div
            ref={modalRef}
            className="bg-card rounded-lg w-full h-full max-w-7xl max-h-screen flex flex-col transform transition-all duration-300 scale-95 animate-scaleIn"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-border">
              <h3 className="text-xl font-semibold text-foreground">
                Certificate Preview
              </h3>
              <button
                onClick={() => setShowCertificate(false)}
                className="text-muted-foreground hover:text-foreground text-2xl"
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

            <div className="px-6 py-4 border-t border-border flex justify-between items-center">
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = currentCertificateUrl;
                  link.download = "Certificate.pdf";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-full flex items-center hover:scale-105 hover:bg-primary/90 transition-all shadow-lg"
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
                className="bg-primary text-primary-foreground px-4 py-2 rounded-full flex items-center hover:bg-primary/90 transition text-sm"
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
