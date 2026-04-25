// app/project/[slug]/page.tsx
"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import projectsDataFallback from "../../../data/projects.json";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { fetchProjects } from "@/lib/data";

// Helper function to match slugs correctly (outside component for stability)
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const router = useRouter();

  // Add type for projects
  interface Project {
    title: string;
    description: string;
    detailedDescription?: string;
    image: string;
    url?: string;
    tags?: string[];
    features?: string[];
  }

  const projectsData = useSupabaseData<Project[]>(fetchProjects, projectsDataFallback as Project[]);

  // Find the requested project using slug
  const project = useMemo(() => {
    return projectsData.find((p) => createSlug(p.title) === slug);
  }, [slug, projectsData]);

  const handleBack = () => {
    router.push("/experience#project");
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The project you are looking for does not exist or has been removed.
        </p>
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative pb-20">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 pt-12 md:pt-20">
        {/* Back navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={handleBack}
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center group-hover:bg-accent transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </div>
            Back to Experience
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags?.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-400 to-blue-500 bg-clip-text text-transparent">
            {project.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {project.description}
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 border border-border shadow-2xl"
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
          {project.url && (
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform shadow-xl"
              >
                View Live Project
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Main Content (Left, 2/3 width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2 space-y-8"
          >
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </span>
                Overview
              </h2>
              <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground">
                {project.detailedDescription
                  ?.split("\n\n")
                  .map((para, i) => <p key={i}>{para}</p>) || (
                  <p>{project.description}</p>
                )}
              </div>
            </section>
          </motion.div>

          {/* Sidebar (Right, 1/3 width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-8"
          >
            {project.features && project.features.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 text-foreground flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {project.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0" />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 text-foreground flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-accent text-accent-foreground border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                View Repository
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
