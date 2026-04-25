// app/about/page.tsx - About Page yang Bersih dan Konsisten
"use client";

import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { useEffect } from "react";
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
import CvModal from "./components/CvModal";
import HeroSection from "./components/HeroSection";
// DarkVeil moved to layout.tsx — single instance for all pages

// Data
import aboutDataFallback from "../../data/about.json";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { fetchAbout } from "@/lib/data";

// Types
interface About {
  description: string;
}

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Lazy components
const AboutSection = lazy(() => import("./components/AboutSection"));
const ContactSection = lazy(() => import("../../components/ContactSection"));
const Guestbook = lazy(() => import("./components/Guestbook"));
const GitHubContributions = lazy(
  () => import("./components/GitHubContributions"),
);

// Direct imports removed — VisitorLogger is in layout.tsx

export default function AboutPage() {
  const mainContainerRef = useRef<HTMLDivElement>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [showCVModal, setShowCVModal] = useState<boolean>(false);

  // Memoized data
  const aboutData = useSupabaseData(fetchAbout, aboutDataFallback as About);
  const memoizedAbout = useMemo(() => aboutData as About, [aboutData]);

  // Hooks - sections yang ada di halaman about (tanpa certification)
  const { scrolled } = useScrollDetection(10);
  const { activeSection, handleNavClick } = useActiveSection([
    "about",
    "contact",
  ]);

  // Handlers
  const handleScrollDown = useCallback(() => {
    smoothScrollToSection("about");
  }, []);

  const handleSmoothNavClick = useCallback(
    (sectionId: string) => {
      // Navigation asli sudah handle redirect ke halaman lain
      // Hanya handle section di halaman yang sama
      if (sectionId === "about" || sectionId === "contact") {
        handleNavClick(sectionId);
        smoothScrollToSection(sectionId);
      }
    },
    [handleNavClick],
  );

  const handleShowCVModal = useCallback(() => {
    setShowCVModal(true);
  }, []);

  const handleCloseCVModal = useCallback(() => {
    setShowCVModal(false);
  }, []);

  // GSAP Animations - useEffect to avoid blocking paint
  useEffect(() => {
    const ctx = gsap.context(() => {
      const animations = createCommonAnimations(gsap, ScrollTrigger);

      // Fade in sections
      animations.fadeInSections();
    }, mainContainerRef);

    setIsLoaded(true);
    return () => ctx.revert();
  }, []);

  // Tampilkan loading jika belum dimuat
  if (!isLoaded) {
    return <PageLoader message="Memuat halaman tentang..." />;
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
        activePage="about"
        handleNavClick={handleSmoothNavClick}
      />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Spacer untuk navigasi fixed */}
        <div className="h-20"></div>

        {/* Content Container */}
        <div className="w-full px-section">
          {/* Hero Section */}
          <HeroSection
            onShowCVModal={handleShowCVModal}
            onScrollDown={handleScrollDown}
          />

          {/* About Section */}
          <section className="py-16" id="about">
            <Suspense fallback={<SectionLoader />}>
              <AboutSection about={memoizedAbout} />
            </Suspense>
          </section>

          {/* Guestbook Section */}
          <section className="py-8">
            <Suspense fallback={<SectionLoader />}>
              <Guestbook />
            </Suspense>
          </section>

          {/* GitHub Contributions Section */}
          <section className="py-8">
            <Suspense fallback={<SectionLoader />}>
              <GitHubContributions />
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
