// components/home/EducationPreview.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { usePageTransition } from "@/components/PageTransition";
import educationDataFallback from "@/data/education.json";
import certificationsDataFallback from "@/data/certifications.json";
import achievementsDataFallback from "@/data/achievements.json";
import organizationsDataFallback from "@/data/organizations.json";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { fetchEducation, fetchCertifications, fetchAchievements, fetchOrganizations } from "@/lib/data";

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

  const educationData = useSupabaseData(fetchEducation, educationDataFallback as Education[]);
  const certificationsData = useSupabaseData(fetchCertifications, certificationsDataFallback);
  const achievementsData = useSupabaseData(fetchAchievements, achievementsDataFallback);
  const organizationsData = useSupabaseData(fetchOrganizations, organizationsDataFallback as Organization[]);

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
      value: education?.gpa?.split("/")[0] || "3.64",
      label: "GPA",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
    },
    {
      value: certCount.toString(),
      label: "Certs",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
    {
      value: achieveCount.toString(),
      label: "Awards",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
    {
      value: orgCount.toString(),
      label: "Orgs",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
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

      {/* Main Education Card — Elegant Classic-Modern Design */}
      {education && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <GlassCard
            noAnimation
            className="hover:scale-[1.005] transition-transform duration-500"
          >
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Left Side: Logo + Degree Info */}
              <div className="flex items-start gap-5 lg:flex-1 min-w-0">
                {/* University Logo — Clean, no background box */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/15 flex items-center justify-center p-2.5 backdrop-blur-sm">
                    <img
                      src="https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/uny.png"
                      alt={`Logo ${education.institution}`}
                      className="w-full h-full object-contain select-none pointer-events-none"
                      draggable={false}
                    />
                  </div>
                  {/* Subtle glow behind logo */}
                  <div className="absolute inset-0 w-full h-full bg-primary/8 rounded-2xl blur-xl -z-10" />
                </div>

                {/* Degree Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground leading-tight mb-1">
                    {education.degree}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-3">
                    <span className="text-primary font-semibold text-sm">
                      {education.institution}
                    </span>
                    <span className="text-muted-foreground/40 text-xs">•</span>
                    <span className="text-muted-foreground text-sm">
                      {education.period}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed line-clamp-2">
                    {education.description}
                  </p>
                  {/* GPA Badge */}
                  {education.gpa && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 14l9-5-9-5-9 5 9 5z" />
                      </svg>
                      IPK: {education.gpa}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Mini Stats Grid */}
              <div className="lg:w-auto lg:flex-shrink-0">
                <div className="grid grid-cols-4 lg:grid-cols-2 gap-3">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.08, duration: 0.3 }}
                      className="text-center px-4 py-3 rounded-xl bg-background/40 border border-border/50 
                                 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group"
                    >
                      <div className="inline-flex p-1.5 rounded-lg bg-primary/10 text-primary mb-1.5 
                                      group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        {stat.icon}
                      </div>
                      <div className="text-xl font-bold text-foreground leading-none mb-0.5">
                        {stat.value}
                      </div>
                      <div className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Organizations Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <GlassCard
          noAnimation
          className="hover:scale-[1.005] transition-transform duration-500"
        >
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Organizations
            </h4>
            {orgCount > 2 && (
              <span className="text-xs text-muted-foreground/60 font-medium">
                +{orgCount - 2} more
              </span>
            )}
          </div>

          <div className="relative border-l-2 border-primary/20 pl-5 ml-1 space-y-5">
            {previewOrgs.map((org, index) => (
              <motion.div
                key={org.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                className="relative group"
              >
                {/* Timeline Node Dot */}
                <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-background border-2 border-primary/40 
                               transition-all duration-300 group-hover:border-primary group-hover:bg-primary/20 group-hover:scale-110" />
                
                <div className="min-w-0">
                  <p className="text-foreground font-semibold text-sm group-hover:text-primary transition-colors duration-300">
                    {org.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-xs">
                    <span className="text-primary/80 font-medium">{org.position}</span>
                    <span className="text-muted-foreground/40">•</span>
                    <span className="text-muted-foreground">{org.period}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default EducationPreview;
