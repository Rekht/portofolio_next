// components/OrganizationCard.tsx - Komponen kartu organisasi
import React from "react";

interface Organization {
  id: number;
  title: string;
  position: string;
  period: string;
  description: string[];
}

interface OrganizationCardProps {
  organization: Organization;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization,
}) => {
  return (
    <div className="bg-gray-900 rounded-xl p-8 w-full mb-6">
      <h3 className="text-xl font-bold mb-2">{organization.title}</h3>
      <p className="text-blue-400 mb-4">
        {organization.position} | {organization.period}
      </p>
      <ul className="list-none space-y-2 text-gray-300">
        {organization.description.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="mt-1 mr-2">•</span>
            <span className="text-justify">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrganizationCard;
