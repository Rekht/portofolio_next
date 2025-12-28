// components/home/EducationPreview.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { usePageTransition } from "@/components/PageTransition";
import educationData from "@/data/education.json";
import certificationsData from "@/data/certifications.json";
import achievementsData from "@/data/achievements.json";
import organizationsData from "@/data/organizations.json";

interface Education {
  id: number;
  degree: string;
  institution: string;
  period: string;
  description: string;
  gpa?: string;
}

interface Organization {
  id: number;
  title: string;
  position: string;
  period: string;
}

const EducationPreview: React.FC = () => {
  const { startTransition, isTransitioning } = usePageTransition();

  const education = (educationData as Education[])[0];
  const certCount = certificationsData.length;
  const achieveCount = achievementsData.length;
  const orgCount = (organizationsData as Organization[]).length;

  // Get first 2 organizations for preview
  const previewOrgs = (organizationsData as Organization[]).slice(0, 2);

  const handleViewAll = () => {
    if (isTransitioning) return;
    startTransition("/education");
  };

  const stats = [
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
          />
        </svg>
      ),
      value: education?.gpa?.split("/")[0] || "3.64",
      label: "GPA",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      ),
      value: certCount.toString(),
      label: "Certifications",
      color: "from-purple-500 to-fuchsia-500",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
      value: achieveCount.toString(),
      label: "Achievements",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      value: orgCount.toString(),
      label: "Organizations",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="w-full relative">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Education
          </h2>
          <p className="text-muted-foreground">
            Academic background & achievements
          </p>
        </div>
        <motion.button
          onClick={handleViewAll}
          className="px-5 py-2.5 border border-border text-foreground text-sm rounded-full 
                     bg-secondary backdrop-blur-sm transition-all duration-300 
                     hover:border-primary hover:bg-accent flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View All
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <GlassCard
              accentColor={
                index === 0
                  ? "cyan"
                  : index === 1
                  ? "purple"
                  : index === 2
                  ? "orange"
                  : "green"
              }
              noAnimation
              className="text-center hover:scale-105 transition-transform"
            >
              <div
                className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20 mb-2`}
              >
                <span className="text-white">{stat.icon}</span>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-xs md:text-sm">
                {stat.label}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Education & Organizations Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Education Card */}
        {education && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <GlassCard
              accentColor="blue"
              noAnimation
              className="h-full hover:scale-[1.01] transition-transform"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {education.degree}
                  </h3>
                  <h4 className="text-blue-400 font-medium text-sm mb-2">
                    {education.institution}
                  </h4>
                  <p className="text-muted-foreground text-xs">
                    {education.period}
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Organizations Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <GlassCard
            accentColor="green"
            noAnimation
            className="h-full hover:scale-[1.01] transition-transform"
          >
            <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
              Organizations
            </h4>
            <div className="space-y-3">
              {previewOrgs.map((org) => (
                <div key={org.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-foreground font-medium text-sm truncate">
                      {org.title}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {org.position}
                    </p>
                  </div>
                </div>
              ))}
              {orgCount > 2 && (
                <p className="text-muted-foreground/70 text-xs pl-5">
                  +{orgCount - 2} more organizations
                </p>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default EducationPreview;
