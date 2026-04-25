// components/AboutSection.tsx - Komponen bagian tentang
import React from "react";
import GlassCard from "@/components/ui/GlassCard";

interface About {
  description: string;
}

interface AboutSectionProps {
  about: About;
}

const AboutSection: React.FC<AboutSectionProps> = ({ about }) => {
  return (
    <GlassCard accentColor="purple" className="max-w-6xl mx-auto w-full">
      <p className="text-lg text-foreground/90 leading-relaxed font-semibold">
        {about.description}
      </p>
    </GlassCard>
  );
};

export default AboutSection;
