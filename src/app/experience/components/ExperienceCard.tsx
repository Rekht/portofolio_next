// components/ExperienceCard.tsx - Komponen kartu pengalaman kerja
import React from "react";

interface Experience {
  id: number;
  company: string;
  position: string;
  duration: string;
  location?: string;
  description: string | string[];
}

interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  const { company, position, duration, location, description } = experience;

  return (
    <div className="experience-card bg-gray-900 rounded-xl p-8 mb-8 transition-all duration-300 hover:bg-gray-800">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
            {position}
          </h3>
          <h4 className="text-xl font-semibold text-blue-400 mb-3">
            {company}
          </h4>
          {location && (
            <p className="text-gray-400 text-base mb-2 flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {location}
            </p>
          )}
        </div>
        <div className="mt-4 lg:mt-0 lg:ml-6">
          <span className="inline-block bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/30">
            {duration}
          </span>
        </div>
      </div>

      {description && (
        <div className="text-gray-300 mb-6 leading-relaxed">
          {Array.isArray(description) ? (
            <ul className="space-y-3">
              {description.map((item, index) => (
                <li key={index} className="flex items-start text-base">
                  <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-base leading-relaxed">{description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExperienceCard;
