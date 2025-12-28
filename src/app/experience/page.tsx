// app/experience/page.tsx - Clean and Consistent Experience Page
"use client";

import React, {
  useLayoutEffect,
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
import DarkVeil from "../../components/background/DarkVeil";
import SkillsSection from "./components/SkillsSection";

// Data
import experienceData from "../../data/experience.json";
import projectsData from "../../data/projects.json";

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

  // Memoized data
  const memoizedExperience = useMemo(() => experienceData as Experience[], []);
  const projectCount = useMemo(() => projectsData.length, []);

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
    [handleNavClick]
  );

  // GSAP Animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const animations = createCommonAnimations(gsap, ScrollTrigger);

      // Hero section animation
      animations.animateHero();

      // Experience cards animation
      const experienceCards = gsap.utils.toArray(
        ".experience-card"
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
          }
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
        }
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
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <DarkVeil />
      </div>

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
                  <div className="text-3xl font-bold text-primary mb-2">
                    ≤ {new Date().getFullYear() - 2024}
                  </div>
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

            <div className="max-w-4xl mx-auto">
              {memoizedExperience.map((exp, index) => (
                <div key={exp.id} className="relative">
                  {/* Timeline line */}
                  {index < memoizedExperience.length - 1 && (
                    <div className="absolute left-4 top-32 w-0.5 h-24 bg-gradient-to-b from-blue-500 to-purple-500 z-10"></div>
                  )}

                  {/* Timeline dot */}
                  <div className="absolute left-2 top-8 w-4 h-4 bg-primary rounded-full border-4 border-background z-20"></div>

                  {/* Experience card with margin for timeline */}
                  <div className="ml-12">
                    <ExperienceCard experience={exp} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Project Section */}
          <section className="py-16" id="project">
            <Suspense fallback={<SectionLoader />}>
              <ProjectSection />
            </Suspense>
          </section>

          {/* Skills Summary */}
          <section className="py-16">
            <SkillsSection />
          </section>
        </div>
      </main>
    </div>
  );
}
