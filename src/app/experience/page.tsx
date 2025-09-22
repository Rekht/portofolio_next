// app/experience/page.tsx - Halaman Experience dengan Project Section
"use client";

import React, { useLayoutEffect, useRef, useMemo, lazy, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

// Import komponen yang dibutuhkan
import Navigation from "../../components/Navigation";
import ExperienceCard from "@/app/experience/components/ExperienceCard";
import DarkVeil from "@/components/background/DarkVeil";
import SkillsSection from "@/app/experience/components/SkillsSection";

// Import custom hooks
import useScrollDetection from "../../hooks/useScrollDetection";
import useActiveSection from "../../hooks/useActiveSection";

// Lazy load ProjectSection
const ProjectSection = lazy(() => import("../../components/ProjectSection"));

// Import data
import experienceData from "../../data/experience.json";
import projectsData from "../../data/projects.json";

// Definisi tipe data
interface Experience {
  id: number;
  company: string;
  position: string;
  duration: string;
  location?: string;
  description: string | string[];
}

// Registrasi plugin GSAP
gsap.registerPlugin(ScrollTrigger);

export default function ExperiencePage() {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Setup animasi untuk hero section
    gsap.fromTo(
      ".hero-content",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.2,
      }
    );

    // Setup animasi untuk experience cards
    const experienceCards = gsap.utils.toArray(".experience-card") as Element[];

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

    // Setup animasi untuk project cards (sama seperti di home)
    const projectCards = gsap.utils.toArray(
      ".project-card-container"
    ) as Element[];

    projectCards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          delay: index * 0.1,
        }
      );
    });

    // Setup animasi untuk skills section
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

    // Setup ScrollTrigger untuk header
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const header = headerRef.current;
        if (!header) return;

        if (self.progress > 0.05) {
          header.style.background = "rgba(0, 0, 0, 0.95)";
          header.style.backdropFilter = "blur(10px)";
        } else {
          header.style.background = "transparent";
          header.style.backdropFilter = "none";
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Custom hooks
  const { scrolled } = useScrollDetection(10);
  const { handleNavClick } = useActiveSection(["experience", "project"]);

  // Memoize data
  const memoizedExperience = useMemo(() => experienceData as Experience[], []);

  // Navigation handler
  const handleNavigation = (sectionId: string) => {
    if (sectionId === "home") {
      window.location.href = "/";
    } else if (sectionId === "experience") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (sectionId === "project") {
      const projectSection = document.getElementById("project");
      if (projectSection) {
        projectSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <div
      className="font-sans min-h-screen bg-black text-white relative"
      ref={mainContainerRef}
    >
      {/* Background DarkVeil */}
      <div className="absolute inset-0 z-0">
        <DarkVeil />
      </div>

      {/* Navigation Header */}
      <div
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
      >
        <Navigation
          scrolled={scrolled}
          activeSection="experience"
          handleNavClick={handleNavigation}
        />
      </div>

      {/* Spacer untuk mencegah konten tertutup navbar */}
      <div className="h-24"></div>

      {/* Main Content */}
      <div className="container mx-auto px-2 md:px-2 relative z-10">
        {/* Hero Section untuk Experience & Projects */}
        <section className="py-16 text-center">
          <div className="hero-content">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
              Experience & Projects
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A comprehensive overview of my professional journey, work
              experience, and creative projects.
            </p>

            {/* Statistics */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-12 text-center">
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/20">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  Freelance
                </div>
                <div className="text-gray-400">Work Experience</div>
              </div>

              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/20">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  ≤ {new Date().getFullYear() - 2024}
                </div>
                <div className="text-gray-400">Years Experience</div>
              </div>

              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/20">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {projectsData.length} {/* Menghitung jumlah project */}
                </div>
                <div className="text-gray-400"> Independent Projects</div>
              </div>
            </div>
          </div>
        </section>

        {/* Work Experience Section */}
        <section className="py-8" id="experience">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Work Experience</h2>
            <p className="text-gray-400 text-lg">
              Chronological overview of my professional journey
            </p>
          </div>

          {memoizedExperience.map((exp, index) => (
            <div key={exp.id} className="relative">
              {/* Timeline line */}
              {index < memoizedExperience.length - 1 && (
                <div className="absolute left-4 top-32 w-0.5 h-24 bg-gradient-to-b from-blue-500 to-purple-500 z-10"></div>
              )}

              {/* Timeline dot */}
              <div className="absolute left-2 top-8 w-4 h-4 bg-blue-500 rounded-full border-4 border-black z-20"></div>

              {/* Experience card with margin for timeline */}
              <div className="ml-12">
                <ExperienceCard experience={exp} />
              </div>
            </div>
          ))}
        </section>

        {/* Project Section - Dipindahkan dari home page */}
        <section className="py-8" id="project">
          <Suspense
            fallback={
              <div className="h-48 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            }
          >
            <ProjectSection />
          </Suspense>
        </section>

        {/* Skills Summary - Menggunakan komponen terpisah */}
        <SkillsSection />
      </div>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-gray-500 text-center py-6 mt-8 relative z-10">
        <div className="container mx-auto px-6">
          <p>&copy; {new Date().getFullYear()} Restu Anggoro Kasih.</p>
        </div>
      </footer>
    </div>
  );
}
