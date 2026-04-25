// app/experience/page.tsx - Clean and Consistent Experience Page
"use client";

import React, {
  useEffect,
  useRef,
  useMemo,
  lazy,
  Suspense,
  useState,
  useCallback,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
import ExperienceCard from "./components/ExperienceCard";
// DarkVeil moved to layout.tsx — single instance for all pages
import SkillsSection from "./components/SkillsSection";

// Data
import experienceDataFallback from "../../data/experience.json";
import projectsDataFallback from "../../data/projects.json";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { fetchExperience, fetchProjects } from "@/lib/data";

// Lazy components
const ProjectSection = lazy(() => import("./components/ProjectSection"));

// Types
interface Experience {
  id: number;
  company: string;
  position: string;
  duration: string;
  location?: string;
  description: string | string[];
  technologies?: string[];
  images?: string[];
}

// Helper to parse period string for sorting
function parseDateFromPeriod(period: string): Date {
  if (!period) return new Date(0);
  const parts = period.split('-').map(s => s.trim());
  const dateStr = parts[parts.length - 1]; // End date
  if (dateStr.toLowerCase() === 'present' || dateStr.toLowerCase() === 'sekarang') {
    return new Date();
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date(0) : parsed;
}

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function ExperiencePage() {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Custom hooks
  const { scrolled } = useScrollDetection(10);
  const { activeSection, handleNavClick } = useActiveSection([
    "experience",
    "project",
  ]);

  // Memoized & Sorted data
  const experienceData = useSupabaseData(fetchExperience, experienceDataFallback as Experience[]);
  const projectsData = useSupabaseData(fetchProjects, projectsDataFallback);
  const memoizedExperience = useMemo(() => {
    return [...(experienceData as Experience[])].sort((a, b) => {
      const dateA = parseDateFromPeriod(a.duration);
      const dateB = parseDateFromPeriod(b.duration);
      return dateB.getTime() - dateA.getTime();
    });
  }, [experienceData]);
  const projectCount = useMemo(() => projectsData.length, [projectsData]);

  // Navigation handler - for sections within the same page
  const handleSmoothNavClick = useCallback(
    (sectionId: string) => {
      // Navigation component already handles redirect to other pages
      // Only handle section scrolling for this page
      if (sectionId === "experience" || sectionId === "project") {
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

      // Hero section animation
      animations.animateHero();

      // Experience cards animation
      const experienceCards = gsap.utils.toArray(
        ".experience-card",
      ) as Element[];
      experienceCards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            delay: index * 0.1,
          },
        );
      });

      // Project cards animation
      animations.animateCards(".project-card-container");

      // Skills section animation
      gsap.fromTo(
        ".skills-section",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".skills-section",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, mainContainerRef);

    setIsLoaded(true);
    return () => ctx.revert();
  }, []);

  // Show loading screen
  if (!isLoaded) {
    return <PageLoader message="Loading experience page..." />;
  }

  return (
    <div
      className="font-sans min-h-screen bg-background text-foreground relative"
      ref={mainContainerRef}
    >
      {/* Background moved to layout.tsx */}

      {/* Navigation */}
      <Navigation
        scrolled={scrolled}
        activePage="experience"
        handleNavClick={handleSmoothNavClick}
      />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Spacer for fixed navigation */}
        <div className="h-20"></div>

        {/* Content Container */}
        <div className="w-full px-section">
          {/* Hero Section */}
          <section className="py-16 text-center">
            <div className="hero-content">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-400 to-blue-500 bg-clip-text text-transparent">
                Experience & Projects
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
                A comprehensive overview of my professional journey, work
                experience, and creative projects.
              </p>

              {/* Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="text-3xl font-bold text-primary mb-2">
                    Freelance
                  </div>
                  <div className="text-muted-foreground">Work Experience</div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="text-3xl font-bold text-primary mb-2">1+</div>
                  <div className="text-muted-foreground">
                    Years of Experience
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {projectCount}
                  </div>
                  <div className="text-muted-foreground">
                    Independent Projects
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Work Experience Section */}
          <section className="py-16" id="experience">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4 text-center">
                Work Experience
              </h2>
              <p className="text-muted-foreground text-lg text-center">
                A chronological overview of my professional journey
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {memoizedExperience.map((exp, index) => (
                <ExperienceCard key={exp.id} experience={exp} index={index} />
              ))}
            </div>
          </section>

          {/* Project Section */}
          <Suspense fallback={<SectionLoader />}>
            <ProjectSection />
          </Suspense>

          {/* Skills Summary */}
          <section className="py-16">
            <SkillsSection />
          </section>
        </div>
      </main>
    </div>
  );
}
