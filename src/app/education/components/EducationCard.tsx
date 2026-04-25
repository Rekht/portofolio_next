// components/EducationCard.tsx - Komponen kartu pendidikan
import React from "react";
import Image from "next/image";
import GlassCard from "@/components/ui/GlassCard";

interface Education {
  id: number;
  degree: string;
  institution: string;
  period: string;
  description: string;
  gpa?: string;
}

interface EducationCardProps {
  education: Education;
}

const EducationCard: React.FC<EducationCardProps> = ({ education }) => {
  return (
    <GlassCard accentColor="purple" noAnimation className="w-full mb-6">
      <div className="flex items-start gap-4">
        <Image
          src="https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/uny.png"
          alt={`Logo ${education.institution}`}
          width={96}
          height={96}
          className="w-24 h-24 object-contain"
        />

        <div>
          <h3 className="text-xl font-bold mb-1 text-foreground">
            {education.degree}
          </h3>
          <p className="text-blue-400 mb-2">
            {education.institution} | {education.period}
          </p>
          <p className="text-base text-foreground/90 leading-relaxed">
            {education.description}
            {education.gpa && <span> IPK: {education.gpa}</span>}
          </p>
        </div>
      </div>
    </GlassCard>
  );
};

export default EducationCard;
