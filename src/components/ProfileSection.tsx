"use client";

import React from "react";
import dynamic from "next/dynamic";

const ProfileCard = dynamic(
  () => import("@/components/profilecard/ProfileCard"),
  { ssr: false }
);

interface ProfileSectionProps {
  onShowCVModal: () => void;
  onScrollDown: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
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
      className="relative py-8 flex items-center justify-center"
    >
      {/* Tulisan kiri atas */}
      <div
        className="
          absolute z-20 
          top-6 left-6 sm:top-10 sm:left-10 
          max-w-[90%] sm:max-w-xs 
          text-white font-semibold tracking-wide leading-relaxed
        "
      >
        <span className="pl-10 block">HELLO, MY NAME’S RESTU</span>
        I’M A DATA ENTHUSIAST <br />
        FOCUSING ON DATA & AI
      </div>

      {/* ProfileCard di tengah */}
      <div className="flex justify-center">
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

export default ProfileSection;
