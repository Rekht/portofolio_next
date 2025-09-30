// components/AboutSection.tsx - Komponen bagian tentang
import React from "react";

interface About {
  description: string;
}

interface AboutSectionProps {
  about: About;
}

const AboutSection: React.FC<AboutSectionProps> = ({ about }) => {
  // Komponen untuk menampilkan bagian About
  return (
    <div className="bg-gray-900 rounded-xl p-8 w-full">
      <p className="text-lg text-gray-300 leading-relaxed font-semibold">
        {/* <p className="text-lg text-xl md:text-2xl text-gray-300 leading-relaxed font-semibold"> */}
        {about.description}
      </p>
    </div>
  );
};

export default AboutSection;
