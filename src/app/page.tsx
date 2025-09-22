// app/page.tsx - Optimized version
"use client";

import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Custom hooks
import useScrollDetection from "../hooks/useScrollDetection";
import useActiveSection from "../hooks/useActiveSection";

// Components (eager loaded)
import Navigation from "../components/Navigation";
import OrganizationCard from "../components/OrganizationCard";
import EducationCard from "../components/EducationCard";
import CvModal from "../components/CvModal";
import HeroSection from "../components/HeroSection";
import DarkVeil from "@/components/background/DarkVeil";

// Data JSON
import organizationsData from "../data/organizations.json";
import educationData from "../data/education.json";
import aboutData from "../data/about.json";

// Types
interface Organization {
  id: number;
  title: string;
  position: string;
  period: string;
  description: string[];
}

interface Education {
  id: number;
  degree: string;
  institution: string;
  period: string;
  description: string;
  gpa?: string;
}

interface About {
  description: string;
}

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Lazy components
const AboutSection = lazy(() => import("../components/AboutSection"));
const CertificationSection = lazy(
  () => import("../components/CertificationSection")
);
const AchievementSection = lazy(
  () => import("../components/AchievementSection")
);
const ContactSection = lazy(() => import("../components/ContactSection"));

// Reusable Suspense Fallback
const SpinnerFallback = () => (
  <div className="h-48 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

export default function HomePage() {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [isLoaded, setIsLoaded] = useState(false);

  // Memoized data
  const memoizedEducation = useMemo(() => educationData as Education[], []);
  const memoizedOrganizations = useMemo(
    () => organizationsData as Organization[],
    []
  );
  const memoizedAbout = useMemo(() => aboutData as About, []);

  // Hooks
  const { scrolled } = useScrollDetection(10);
  const { activeSection, handleNavClick } = useActiveSection([
    "profile",
    "about",
    "education",
    "organization",
    "certification",
    "achievement",
    "contact",
  ]);

  const [showCVModal, setShowCVModal] = useState<boolean>(false);

  // Scroll to "About"
  const handleScrollDown = useCallback(() => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      const offsetTop = aboutSection.offsetTop - 80;
      gsap.to(window, {
        duration: 1.5,
        scrollTo: { y: offsetTop, autoKill: false },
        ease: "power2.inOut",
      });
    }
  }, []);

  // Smooth nav click
  const handleSmoothNavClick = useCallback(
    (sectionId: string) => {
      if (sectionId === "experience" || sectionId === "project") {
        router.push("/experience"); // next/navigation router
        return;
      }

      handleNavClick(sectionId);

      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        gsap.to(window, {
          duration: 1.5,
          scrollTo: { y: offsetTop, autoKill: false },
          ease: "power2.inOut",
        });
      }
    },
    [handleNavClick, router]
  );

  const handleShowCVModal = useCallback(() => {
    setShowCVModal(true);
  }, []);

  // GSAP Animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Section fade-in
      gsap.utils.toArray("section").forEach((section: any, index: number) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: index * 0.1,
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "bottom 60%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Batch animation for cards
      ScrollTrigger.batch(".education-card, .organization-card", {
        start: "top 90%",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.1,
          }),
        onLeaveBack: (batch) =>
          gsap.to(batch, { opacity: 0, x: -30, stagger: 0.1 }),
      });

      // Header background change
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
    }, mainContainerRef);

    setIsLoaded(true);

    return () => ctx.revert();
  }, []);

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading page...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="font-sans min-h-screen bg-black text-white relative"
      ref={mainContainerRef}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <DarkVeil />
      </div>

      {/* Navigation */}
      <div
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
      >
        <Navigation
          scrolled={scrolled}
          activeSection={activeSection}
          handleNavClick={handleSmoothNavClick}
        />
      </div>

      {/* Spacer */}
      <div className="h-24"></div>

      {/* Content */}
      <div className="container mx-auto px-2 md:px-2 relative z-10">
        <HeroSection
          onShowCVModal={handleShowCVModal}
          onScrollDown={handleScrollDown}
        />

        <section className="py-8" id="about">
          <Suspense fallback={<SpinnerFallback />}>
            <AboutSection about={memoizedAbout} />
          </Suspense>
        </section>

        <section className="py-8" id="education">
          <h2 className="text-3xl font-bold mb-8">Education</h2>
          {memoizedEducation.map((edu) => (
            <EducationCard key={edu.id} education={edu} />
          ))}
        </section>

        <section className="py-8" id="organization">
          <h2 className="text-3xl font-bold mb-8">Organization</h2>
          {memoizedOrganizations.map((organization) => (
            <OrganizationCard
              key={organization.id}
              organization={organization}
            />
          ))}
        </section>

        <section className="py-8" id="certification">
          <Suspense fallback={<SpinnerFallback />}>
            <CertificationSection />
          </Suspense>
        </section>

        <section className="py-8" id="achievement">
          <Suspense fallback={<SpinnerFallback />}>
            <AchievementSection />
          </Suspense>
        </section>

        <section className="py-24" id="contact">
          <Suspense fallback={<SpinnerFallback />}>
            <ContactSection />
          </Suspense>
        </section>
      </div>

      {/* CV Modal */}
      <CvModal isOpen={showCVModal} onClose={() => setShowCVModal(false)} />

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-gray-500 text-center py-3 mt-4 relative z-10">
        <p>&copy; {new Date().getFullYear()} Restu Anggoro Kasih.</p>
      </footer>
    </div>
  );
}
