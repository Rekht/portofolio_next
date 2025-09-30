// app/education/page.tsx - Clean and Consistent Education Page
"use client";

import React, {
  useState,
  useRef,
  useMemo,
  useLayoutEffect,
  Suspense,
  lazy,
  useCallback,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Custom hooks
import useScrollDetection from "../../hooks/useScrollDetection";
import useActiveSection from "../../hooks/useActiveSection";

// Utils
import {
  smoothScrollToSection,
  createCommonAnimations,
  PageLoader,
  SectionLoader,
} from "../../utils/pageUtils";

// Components
import Navigation from "../../components/Navigation";
import EducationCard from "./components/EducationCard";
import DarkVeil from "../../components/background/DarkVeil";

// Data
import educationData from "../../data/education.json";

// Lazy components
const AchievementSection = lazy(
  () => import("@/app/education/components/AchievementSection")
);
const CertificationSection = lazy(
  () => import("@/app/education/components/CertificationSection")
);
const OrganizationsSection = lazy(
  () => import("@/app/education/components/OrganizationCard")
);

// Types
interface Education {
  id: number;
  degree: string;
  institution: string;
  period: string;
  description: string;
  gpa?: string;
}

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function EducationPage() {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  // Memoized data
  const memoizedEducation = useMemo(() => educationData as Education[], []);

  // Hooks - certification section after achievements
  const { scrolled } = useScrollDetection(10);
  const { activeSection, handleNavClick } = useActiveSection([
    "education",
    "organization",
    "achievement",
    "certification",
  ]);

  // Navigation handler
  const handleSmoothNavClick = useCallback(
    (sectionId: string) => {
      if (
        sectionId === "education" ||
        sectionId === "organization" ||
        sectionId === "achievement" ||
        sectionId === "certification"
      ) {
        handleNavClick(sectionId);
        smoothScrollToSection(sectionId);
      }
    },
    [handleNavClick]
  );

  // GSAP Animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const animations = createCommonAnimations(gsap, ScrollTrigger);

      // Page fade-in
      gsap.fromTo(
        ".education-page-content",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        }
      );

      // Section fade-in
      animations.fadeInSections();

      // Cards animation
      animations.animateCards(".education-card");
      animations.animateCards(".organization-card");
      animations.animateCards(".achievement-item");
      animations.animateCards(".certification-item");

      // Header background animation
      animations.animateHeader(headerRef);
    }, mainContainerRef);

    setIsLoaded(true);
    return () => ctx.revert();
  }, []);

  // Show loading screen
  if (!isLoaded) {
    return <PageLoader message="Loading education page..." />;
  }

  return (
    <div
      className="font-sans min-h-screen bg-black text-white relative"
      ref={mainContainerRef}
    >
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <DarkVeil />
      </div>

      {/* Navigation */}
      <div
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
      >
        <Navigation
          scrolled={scrolled}
          activePage="education"
          handleNavClick={handleSmoothNavClick}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 education-page-content">
        {/* Spacer for fixed navigation */}
        <div className="h-20"></div>

        {/* Content Container */}
        <div className="w-full px-section">
          {/* Hero Section */}
          <section className="py-16 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
              Education & Achievements
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Academic background, organizational experiences, achievements, and
              certifications that shaped my professional growth.
            </p>
          </section>

          {/* Education Section */}
          <section className="py-16" id="education">
            <h2 className="text-3xl font-bold mb-8 text-center">Education</h2>
            <div className="grid gap-6 max-w-4xl mx-auto">
              {memoizedEducation.map((edu) => (
                <div key={edu.id} className="education-card">
                  <EducationCard education={edu} />
                </div>
              ))}
            </div>
          </section>

          {/* Organization Section */}
          <section className="py-16" id="organization">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Organizations
            </h2>
            <Suspense fallback={<SectionLoader />}>
              <OrganizationsSection />
            </Suspense>
          </section>

          {/* Achievement Section */}
          <section className="py-16" id="achievement">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Achievements
            </h2>
            <Suspense fallback={<SectionLoader />}>
              <AchievementSection />
            </Suspense>
          </section>

          {/* Certification Section - After achievements */}
          <section className="py-16" id="certification">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Certifications
            </h2>
            <Suspense fallback={<SectionLoader />}>
              <CertificationSection />
            </Suspense>
          </section>
        </div>
      </main>
    </div>
  );
}
