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
import { useLayoutEffect } from "react";
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
import DarkVeil from "../../components/background/DarkVeil";

// Data
import aboutData from "../../data/about.json";

// Types
interface About {
  description: string;
}

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Lazy components
const AboutSection = lazy(() => import("./components/AboutSection"));
const ContactSection = lazy(() => import("../../components/ContactSection"));

export default function AboutPage() {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [showCVModal, setShowCVModal] = useState<boolean>(false);

  // Memoized data
  const memoizedAbout = useMemo(() => aboutData as About, []);

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
    [handleNavClick]
  );

  const handleShowCVModal = useCallback(() => {
    setShowCVModal(true);
  }, []);

  const handleCloseCVModal = useCallback(() => {
    setShowCVModal(false);
  }, []);

  // GSAP Animations - menggunakan utils
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const animations = createCommonAnimations(gsap, ScrollTrigger);

      // Fade in sections
      animations.fadeInSections();

      // Animate header background
      animations.animateHeader(headerRef);
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
          activePage="about"
          handleNavClick={handleSmoothNavClick}
        />
      </div>

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
