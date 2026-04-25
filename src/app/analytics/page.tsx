"use client";

import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createCommonAnimations } from "@/utils/pageUtils";
import VisitorStats from "@/app/about/components/VisitorStats";
import PerformanceStats from "./components/PerformanceStats";
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
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-primary relative">
      {/* Navigation */}
      <Navigation 
        scrolled={scrolled} 
        activePage="analytics" 
        handleNavClick={() => {}} 
      />

      {/* Main Content Area */}
      <main className="relative z-10">
        <div className="h-20"></div>

        <div className="w-full px-section">
          <section className="py-16 text-center">
            <div className="hero-content max-w-6xl mx-auto w-full text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Monitoring Website
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed mb-12">
                Real-time tracking and visitor statistics for this platform.
              </p>
            </div>
            <div className="max-w-6xl mx-auto w-full">
              <VisitorStats />
              <PerformanceStats />
            </div>
          </section>
        </div>
      </main>
    </main>
  );
}
