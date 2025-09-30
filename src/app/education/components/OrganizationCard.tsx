"use client";

import { Timeline } from "@/components/ui/timeline";
import organizations from "../../../data/organizations.json";

export default function OrganizationsSection() {
  const timelineData = organizations.map((item) => ({
    title: `${item.title}`,
    content: (
      <div className="space-y-4">
        {/* Organization */}
        <div className="organization-card">
          {/* Position */}
          <h3 className="text-xl font-bold mb-1 text-white">{item.position}</h3>
          {/* Period */}
          <p className="text-xl font-bold mb-3 text-white">{item.period}</p>

          {/* Description */}
          <div className="text-gray-300">
            {Array.isArray(item.description) ? (
              <ul className="list-disc list-outside pl-5 space-y-1">
                {item.description.map((desc, index) => (
                  <li key={index}>{desc}</li>
                ))}
              </ul>
            ) : (
              <p>{item.description}</p>
            )}
          </div>

          {/* Images */}
          {Array.isArray(item.image) && item.image.length > 0 && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {item.image.map((img, idx) => (
                <div key={idx} className="relative w-full flex justify-center">
                  <img
                    src={img}
                    alt={`${item.title} - ${idx + 1}`}
                    className="max-h-80 max-w-full object-scale-down rounded-xl shadow-md"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
  }));

  return (
    <div className="px-0 bg-transparent text-white">
      <Timeline data={timelineData} />
    </div>
  );
}
