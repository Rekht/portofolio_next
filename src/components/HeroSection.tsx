"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ArrowDown } from "lucide-react";

const ProfileCard = dynamic(
  () => import("@/components/profilecard/ProfileCard"),
  { ssr: false }
);

interface HeroSectionProps {
  onShowCVModal: () => void;
}

export default function HeroSection({ onShowCVModal }: HeroSectionProps) {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById("experience-preview");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-80px)] w-full text-foreground px-4 sm:px-6 md:px-12 lg:px-24 flex items-center pt-8 pb-16 lg:py-0"
    >
      <div className="relative z-10 w-full max-w-6xl mx-auto py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-7 flex flex-col items-start text-left relative">
            {/* Background Text Glow */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/25 mb-6 shadow-sm shadow-primary/5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Hello, my name is Restu
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] uppercase drop-shadow-sm">
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/80">
                Data
              </span>{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-accent-gradient-to">
                Scientist
              </span>{" "}
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-foreground/90 to-foreground/50">
                &amp; ML Engineer
              </span>
            </h1>

            {/* Description */}
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Transforming complex data into actionable intelligence. 
              Building scalable machine learning solutions, deep learning models, and AI-driven platforms to solve real-world problems.
            </p>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-wrap gap-4 w-full sm:w-auto">
              <button
                onClick={onShowCVModal}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/95 transition transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                Curriculum Vitae
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
              <button
                onClick={scrollToContact}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-border text-foreground font-semibold hover:border-primary/50 hover:bg-primary/5 transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center cursor-pointer"
              >
                Let's Talk
              </button>
            </div>
          </div>

          {/* Right Column: ProfileCard */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
            <div className="relative w-full max-w-[360px] sm:max-w-[380px] lg:max-w-none flex justify-center">
              {/* Subtle background glow behind the card */}
              <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-3xl -z-10 transform scale-90" />
              
              <ProfileCard
                avatarUrl="https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/profile.png"
                miniAvatarUrl="https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/logo.png"
                name={" "}
                title=" "
                handle="restu22ak"
                contactText="Contact Me"
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={true}
                mobileTiltSensitivity={5}
                onContactClick={scrollToContact}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div
        onClick={scrollToAbout}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer z-20 hidden md:block"
      >
        <div className="w-10 h-10 border border-border hover:border-primary rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 text-muted-foreground hover:text-primary">
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
