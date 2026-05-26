"use client";

import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";

// Custom hooks
import useScrollDetection from "@/hooks/useScrollDetection";
import useActiveSection from "@/hooks/useActiveSection";

// Utils
import { SectionLoader } from "@/utils/pageUtils";

// Components
import Navigation from "@/components/Navigation";
import CvModal from "@/app/about/components/CvModal";
import HeroSection from "@/components/HeroSection";

// Lazy components
const ContactSection = lazy(() => import("@/components/ContactSection"));
const ExperiencePreview = lazy(
  () => import("@/components/home/ExperiencePreview"),
);
const EducationPreview = lazy(
  () => import("@/components/home/EducationPreview"),
);
const SkillsPreview = lazy(() => import("@/components/home/SkillsPreview"));

// Types
interface About {
  description: string;
}

interface HomeClientProps {
  aboutData: About;
  experienceData: any[];
  projectsData: any[];
  educationData: any[];
  certificationsData: any[];
  achievementsData: any[];
  organizationsData: any[];
  skillsData: any;
}

export default function HomeClient({
  aboutData,
  experienceData,
  projectsData,
  educationData,
  certificationsData,
  achievementsData,
  organizationsData,
  skillsData,
}: HomeClientProps) {
  const mainContainerRef = useRef<HTMLDivElement>(null);

  const [showCVModal, setShowCVModal] = useState<boolean>(false);

  // Hooks
  const { scrolled } = useScrollDetection(10);
  const { activeSection, handleNavClick } = useActiveSection([
    "about",
    "certification",
    "projects",
    "contact",
  ]);

  // Handler navigasi
  const handleSmoothNavClick = useCallback(
    (sectionId: string) => {
      handleNavClick(sectionId);
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    },
    [handleNavClick],
  );

  // CV Modal
  const handleShowCVModal = useCallback(() => setShowCVModal(true), []);
  const handleCloseCVModal = useCallback(() => setShowCVModal(false), []);

  return (
    <div
      ref={mainContainerRef}
      className="font-sans min-h-screen text-foreground relative"
    >
      {/* Navigation */}
      <Navigation
        scrolled={scrolled}
        activePage="home"
        handleNavClick={handleSmoothNavClick}
      />

      {/* Main Content */}
      <main className="relative z-10">
        <div className="h-20"></div>

        {/* Unified Hero Section */}
        <HeroSection onShowCVModal={handleShowCVModal} />

        {/* Content Section */}
        <div className="w-full px-section">

          {/* Experience Preview Section */}
          <section className="py-16" id="experience-preview">
            <Suspense fallback={<SectionLoader />}>
              <ExperiencePreview experienceData={experienceData} projectsData={projectsData} />
            </Suspense>
          </section>

          {/* Education Preview Section */}
          <section className="py-16" id="education-preview">
            <Suspense fallback={<SectionLoader />}>
              <EducationPreview
                educationData={educationData}
                certificationsData={certificationsData}
                achievementsData={achievementsData}
                organizationsData={organizationsData}
              />
            </Suspense>
          </section>
          {/* Skills Preview Section */}
          <section className="py-16" id="skills-preview">
            <Suspense fallback={<SectionLoader />}>
              <SkillsPreview skillsData={skillsData} />
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
