// utils/pageUtils.ts - Utilities sederhana untuk halaman

import gsap from "gsap";

// Utility untuk smooth scroll ke section
export const smoothScrollToSection = (
  sectionId: string,
  offset: number = 80
) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const offsetTop = element.offsetTop - offset;
    gsap.to(window, {
      duration: 1.5,
      scrollTo: { y: offsetTop, autoKill: false },
      ease: "power2.inOut",
    });
  }
};

// Common GSAP animations
export const createCommonAnimations = (gsap: any, ScrollTrigger: any) => {
  return {
    // Animasi fade in untuk section
    fadeInSections: (selector: string = "section") => {
      gsap.utils.toArray(selector).forEach((section: any, index: number) => {
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
    },

    // Animasi untuk cards
    animateCards: (selector: string, staggerDelay: number = 0.1) => {
      ScrollTrigger.batch(selector, {
        start: "top 90%",
        onEnter: (batch: any) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: staggerDelay,
          }),
        onLeaveBack: (batch: any) =>
          gsap.to(batch, { opacity: 0, y: 30, stagger: staggerDelay }),
      });
    },

    // Animasi background header
    animateHeader: (headerRef: React.RefObject<HTMLDivElement | null>) => {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self: any) => {
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
    },

    // Animasi hero content
    animateHero: (selector: string = ".hero-content") => {
      gsap.fromTo(
        selector,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          delay: 0.2,
        }
      );
    },
  };
};

// Page loading component
export const PageLoader = ({ message }: { message: string }) => (
  <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
    <div className="text-white text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p>{message}</p>
    </div>
  </div>
);

// Section loading component
export const SectionLoader = () => (
  <div className="h-48 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);
