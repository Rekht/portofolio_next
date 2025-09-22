// components/EducationCard.tsx - Komponen kartu pendidikan
import React from "react";
import Image from "next/image";

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
    <div className="bg-gray-900 rounded-xl p-6 w-full mb-6">
      {/* Gambar kecil di pojok kiri atas */}
      <div className="flex items-start gap-4">
        <Image
          src="/assets/uny.png"
          alt={`Logo ${education.institution}`}
          width={96}
          height={96}
          className="w-24 h-24 object-contain"
        />

        {/* Teks */}
        <div>
          <h3 className="text-xl font-bold mb-1 text-white">
            {education.degree}
          </h3>
          <p className="text-blue-400 mb-2">
            {education.institution} | {education.period}
          </p>
          <p className="text-gray-300">
            {education.description}
            {education.gpa && <span> IPK: {education.gpa}</span>}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EducationCard;
