"use client";

import React from "react";
import Image from "next/image";
// import ProfileCard from "@/components/profilecard/ProfileCard";

import dynamic from "next/dynamic";

const ProfileCard = dynamic(
  () => import("@/components/profilecard/ProfileCard"),
  { ssr: false }
);

interface HeroSectionProps {
  onShowCVModal: () => void;
  onScrollDown: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onShowCVModal,
  onScrollDown,
}) => {
  // Fungsi untuk scroll ke ContactSection
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="profile"
      className="py-8 flex flex-col md:flex-row items-center justify-between"
    >
      {/* Bagian kiri */}
      <div className="md:w-1/2">
        {/* Judul utama */}
        <h1 className="text-7xl font-bold mb-4">
          Portofolio
          <br />
        </h1>
        <h2 className="text-5xl font-bold mb-4">Restu Anggoro Kasih</h2>

        {/* Tombol CTA */}
        <div className="mt-8 flex space-x-4">
          <button
            onClick={onShowCVModal}
            className="bg-blue-500 text-white px-6 py-3 rounded-full flex items-center hover:bg-blue-600 transition transform hover:scale-105"
          >
            Curriculum Vitae
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Bagian kanan - ProfileCard */}
      <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
        <ProfileCard
          avatarUrl="/assets/profile.png"
          miniAvatarUrl="/assets/logo.png"
          name={" "}
          title=" "
          handle="restu22ak"
          contactText="Contact Me"
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={true}
          mobileTiltSensitivity={5}
          onContactClick={scrollToContact}
          // grainUrl="/assets/texture.png"
        />
      </div>
    </section>
  );
};

export default HeroSection;
