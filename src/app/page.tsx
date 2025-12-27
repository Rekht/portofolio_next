"use client";

import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { useRouter } from "next/navigation";

// Custom hooks
import useScrollDetection from "@/hooks/useScrollDetection";
import useActiveSection from "@/hooks/useActiveSection";

// Utils
import {
  smoothScrollToSection,
  PageLoader,
  SectionLoader,
} from "@/utils/pageUtils";

// Components
import Navigation from "@/components/Navigation";
import CvModal from "@/app/about/components/CvModal";
import ProfileSection from "@/components/ProfileSection";
import DarkVeil from "@/components/background/DarkVeil";
import HeroSection from "@/components/HeroSection";

// Data
import aboutData from "@/data/about.json";

// Types
interface About {
  description: string;
}

// Lazy components
const ContactSection = lazy(() => import("@/components/ContactSection"));
const ExperiencePreview = lazy(
  () => import("@/components/home/ExperiencePreview")
);
const EducationPreview = lazy(
  () => import("@/components/home/EducationPreview")
);
const SkillsPreview = lazy(() => import("@/components/home/SkillsPreview"));

export default function HomePage() {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [isLoaded, setIsLoaded] = useState(true); // langsung true karena tidak ada loading GSAP
  const [showCVModal, setShowCVModal] = useState<boolean>(false);

  // Memoized data
  const memoizedAbout = useMemo(() => aboutData as About, []);

  // Hooks
  const { scrolled } = useScrollDetection(10);
  const { activeSection, handleNavClick } = useActiveSection([
    "about",
    "certification",
    "projects",
    "contact",
  ]);

  // Handler scroll ke section
  const handleScrollDown = useCallback(() => {
    const section = document.getElementById("about");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Handler navigasi
  const handleSmoothNavClick = useCallback(
    (sectionId: string) => {
      handleNavClick(sectionId);
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    },
    [handleNavClick]
  );

  // CV Modal
  const handleShowCVModal = useCallback(() => setShowCVModal(true), []);
  const handleCloseCVModal = useCallback(() => setShowCVModal(false), []);

  // Render loading jika belum siap
  if (!isLoaded) {
    return <PageLoader message="Memuat halaman beranda..." />;
  }

  return (
    <div
      ref={mainContainerRef}
      className="font-sans min-h-screen text-white relative"
    >
      {/* Background transparan */}
      <div className="fixed inset-0 -z-10">
        <DarkVeil />
      </div>

      {/* Navigation */}
      <div
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
      >
        <Navigation
          scrolled={scrolled}
          activePage="home"
          handleNavClick={handleSmoothNavClick}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="h-20"></div>

        {/* Hero Section - fullscreen */}
        <HeroSection />

        {/* Profile Section */}
        <div className="w-full px-section">
          <ProfileSection
            onShowCVModal={handleShowCVModal}
            onScrollDown={handleScrollDown}
          />

          {/* Experience Preview Section */}
          <section className="py-16" id="experience-preview">
            <Suspense fallback={<SectionLoader />}>
              <ExperiencePreview />
            </Suspense>
          </section>

          {/* Education Preview Section */}
          <section className="py-16" id="education-preview">
            <Suspense fallback={<SectionLoader />}>
              <EducationPreview />
            </Suspense>
          </section>

          {/* Skills Preview Section */}
          <section className="py-16" id="skills-preview">
            <Suspense fallback={<SectionLoader />}>
              <SkillsPreview />
            </Suspense>
          </section>

          {/* Contact Section */}
          <section className="py-24" id="contact">
            <Suspense fallback={<SectionLoader />}>
              <ContactSection />
            </Suspense>
          </section>
        </div>
      </main>

      {/* CV Modal */}
      <CvModal isOpen={showCVModal} onClose={handleCloseCVModal} />
    </div>
  );
}
