"use client";

import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createCommonAnimations } from "@/utils/pageUtils";
import VisitorStats from "@/app/about/components/VisitorStats";
import Navigation from "@/components/Navigation";
import useScrollDetection from "@/hooks/useScrollDetection";

gsap.registerPlugin(ScrollTrigger);

export default function AnalyticsPage() {
  const { scrolled } = useScrollDetection(10);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const animations = createCommonAnimations(gsap, ScrollTrigger);
      animations.animateHero();
    });
    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-primary relative flex">
      {/* Navigation */}
      <Navigation 
        scrolled={scrolled} 
        activePage="analytics" 
        handleNavClick={() => {}} 
      />

      {/* Main Content Area */}
      <div className="flex-1 w-full min-h-screen ml-0 md:ml-24">
        <div className="pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center">
          <div className="hero-content w-full">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
                Platform Analytics
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Real-time analytics and visitor statistics for this portfolio.
              </p>
            </div>
            <VisitorStats />
          </div>
        </div>
      </div>
    </main>
  );
}
