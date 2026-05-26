"use client";

import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
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

// Lazy components
const AchievementSection = lazy(
  () => import("@/app/education/components/AchievementSection"),
);
const CertificationSection = lazy(
  () => import("@/app/education/components/CertificationSection"),
);
const OrganizationsSection = lazy(
  () => import("@/app/education/components/OrganizationCard"),
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

const MONTHS: Record<string, number> = {
  'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'mei': 4, 'jun': 5,
  'jul': 6, 'aug': 7, 'agt': 7, 'sep': 8, 'oct': 9, 'okt': 9, 'nov': 10, 'dec': 11, 'des': 11
};

// Helper to parse period string for sorting
function parseDateFromPeriod(period: string): Date {
  if (!period) return new Date(0);
  const parts = period.split('-').map(s => s.trim());
  const dateStr = parts[0]; // Sort by START DATE
  if (dateStr.toLowerCase() === 'present' || dateStr.toLowerCase() === 'sekarang') return new Date();
  
  const tokens = dateStr.toLowerCase().split(/\s+/);
  let year = 0; let month = 0;
  for (const token of tokens) {
    if (!isNaN(parseInt(token)) && token.length === 4) year = parseInt(token);
    else {
      for (const [key, val] of Object.entries(MONTHS)) {
        if (token.startsWith(key)) { month = val; break; }
      }
    }
  }
  if (year > 0) return new Date(year, month, 1);
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date(0) : parsed;
}

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface EducationClientProps {
  educationData: Education[];
  achievementsData: any[];
  certificationsData: any[];
  organizationsData: any[];
}

export default function EducationClient({
  educationData,
  achievementsData,
  certificationsData,
  organizationsData,
}: EducationClientProps) {
  const mainContainerRef = useRef<HTMLDivElement>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  // Memoized & Sorted data
  const memoizedEducation = useMemo(() => {
    return [...(educationData as Education[])].sort((a, b) => {
      const dateA = parseDateFromPeriod(a.period);
      const dateB = parseDateFromPeriod(b.period);
      return dateB.getTime() - dateA.getTime();
    });
  }, [educationData]);

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
    [handleNavClick],
  );

  // GSAP Animations - useEffect to avoid blocking paint
  useEffect(() => {
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
        },
      );

      // Section fade-in
      animations.fadeInSections();

      // Cards animation
      animations.animateCards(".education-card");
      animations.animateCards(".organization-card");
      animations.animateCards(".achievement-item");
      animations.animateCards(".certification-item");
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
      className="font-sans min-h-screen bg-background text-foreground relative"
      ref={mainContainerRef}
    >
      {/* Navigation */}
      <Navigation
        scrolled={scrolled}
        activePage="education"
        handleNavClick={handleSmoothNavClick}
      />

      {/* Main Content */}
      <main className="relative z-10 education-page-content">
        {/* Spacer for fixed navigation */}
        <div className="h-20"></div>

        {/* Content Container */}
        <div className="w-full px-section">
          {/* Hero Section */}
          <section className="py-16 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-accent-gradient-from to-accent-gradient-to bg-clip-text text-transparent">
              Education & Achievements
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Academic background, organizational experiences, achievements, and
              certifications that shaped my professional growth.
            </p>
          </section>

          {/* Education Section */}
          <section className="py-16" id="education">
            <h2 className="text-3xl font-bold mb-8 text-center">Education</h2>
            <div className="grid gap-6 max-w-6xl mx-auto w-full">
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
              <OrganizationsSection organizationsData={organizationsData} />
            </Suspense>
          </section>

          {/* Achievement Section */}
          <section className="py-16" id="achievement">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Achievements
            </h2>
            <Suspense fallback={<SectionLoader />}>
              <AchievementSection achievementsData={achievementsData} />
            </Suspense>
          </section>

          {/* Certification Section - After achievements */}
          <section className="py-16" id="certification">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Certifications
            </h2>
            <Suspense fallback={<SectionLoader />}>
              <CertificationSection certificationsData={certificationsData} />
            </Suspense>
          </section>
        </div>
      </main>
    </div>
  );
}
