"use client";

import { ArrowDown } from "lucide-react";

export default function HeroSection() {
  const scrollToProfile = () => {
    const profileSection = document.getElementById("profile"); // target ProfileSection
    if (profileSection) {
      profileSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative flex flex-col justify-center min-h-screen w-full text-white px-4 sm:px-6 md:px-20 lg:px-32"
    >
      {/* Wrapper teks utama */}
      <div className="relative ml-auto mr-2 sm:mr-5 lg:mr-90 max-w-fit md:-mt-45 lg:left-20">
        <h1 className="font-bold text-[2rem] sm:text-[3rem] md:text-[6rem] lg:text-[8rem] leading-none uppercase tracking-tight">
          <span className="block sm:ml-8 md:ml-16">Data</span>
          Storyteller <br />
          <span className="block sm:ml-8 md:ml-16">Engineer</span>
        </h1>
      </div>

      {/* Paragraf */}
      <p className="absolute bottom-28 sm:bottom-32 md:bottom-[13rem] lg:bottom-[15.35rem] right-4 sm:right-10 md:right-40 lg:right-30 max-w-xs sm:max-w-sm md:max-w-md text-[12px] sm:text-sm md:text-base text-gray-300 leading-relaxed text-left indent-6 sm:indent-8 uppercase">
        <span className="pl-1 sm:pl-3">CRAFTING IMPACTFUL NARRATIVES FROM</span>{" "}
        <br />
        DATA, ENGINEERING, & DEPLOYING AI SYSTEMS <br />
        TO DRIVE MEANINGFUL ADVANCEMENT ACROSS
        <br />
        ALL DOMAINS.
      </p>

      {/* Scroll indicator */}
      <div
        onClick={scrollToProfile} // klik panah → scroll ke #profile
        className="absolute bottom-10 sm:bottom-14 md:bottom-40 left-1/2 -translate-x-1/2 cursor-pointer"
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border border-white rounded-full flex items-center justify-center animate-bounce hover:scale-110 transition-transform">
          <ArrowDown className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
        </div>
      </div>
    </section>
  );
}
