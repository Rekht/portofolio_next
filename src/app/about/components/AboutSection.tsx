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
    <GlassCard accentColor="purple">
      <p className="text-lg text-foreground leading-relaxed font-semibold">
        {about.description}
      </p>
    </GlassCard>
  );
};

export default AboutSection;
