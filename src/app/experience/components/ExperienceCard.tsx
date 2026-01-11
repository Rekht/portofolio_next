// components/ExperienceCard.tsx - Futuristic Aesthetic Experience Card
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Experience {
  id: number;
  company: string;
  position: string;
  duration: string;
  location?: string;
  description: string | string[];
  technologies?: string[];
  images?: string[];
}

interface ExperienceCardProps {
  experience: Experience;
  index?: number;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  index = 0,
}) => {
  const {
    company,
    position,
    duration,
    location,
    description,
    technologies,
    images,
  } = experience;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const hasImages = images && images.length > 0;

  return (
    <>
      <motion.div
        className="experience-card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: index * 0.15 }}
      >
        {/* Card with gradient border effect */}
        <div className="relative group">
          {/* Gradient border glow - subtle futuristic effect */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

          {/* Main Card */}
          <div className="relative bg-card/80 backdrop-blur-md border border-border rounded-2xl overflow-hidden">
            {/* Top accent line */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="p-6 lg:p-8">
              {/* Header Row */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                <div className="space-y-1">
                  <h3 className="text-xl lg:text-2xl font-bold text-foreground">
                    {position}
                  </h3>
                  <p className="text-primary font-medium text-lg">{company}</p>
                  {location && (
                    <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {location}
                    </p>
                  )}
                </div>

                {/* Duration badge */}
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-sm font-medium text-primary">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {duration}
                </div>
              </div>

              {/* Description */}
              {description && (
                <div className="mb-6">
                  {Array.isArray(description) ? (
                    <ul className="space-y-3">
                      {description.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-muted-foreground"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-sm leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>
              )}

              {/* Technologies */}
              {technologies && technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 text-xs font-medium text-foreground/80 bg-muted/50 border border-border/50 rounded-lg hover:border-primary/30 transition-colors duration-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Images Grid */}
              {hasImages && (
                <div className="grid grid-cols-3 gap-3">
                  {images.map((image, imgIndex) => (
                    <div
                      key={imgIndex}
                      className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group/img border border-border/50 bg-muted/30"
                      onClick={() => {
                        setActiveImageIndex(imgIndex);
                        setIsImageModalOpen(true);
                      }}
                    >
                      <Image
                        src={image}
                        alt={`${position} - ${imgIndex + 1}`}
                        fill
                        className="object-cover transition-all duration-300 group-hover/img:scale-105"
                        sizes="(max-width: 768px) 33vw, 250px"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-primary/0 group-hover/img:bg-primary/10 transition-colors duration-300 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
                          <svg
                            className="w-5 h-5 text-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isImageModalOpen && hasImages && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsImageModalOpen(false)}
          >
            {/* Close */}
            <button
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-50"
              onClick={() => setIsImageModalOpen(false)}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    );
                  }}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    );
                  }}
                >
                  <svg
                    className="w-6 h-6 text-white"
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
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              className="relative max-w-6xl w-full max-h-[85vh] aspect-video"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[activeImageIndex]}
                alt={`${position} at ${company}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>

            {/* Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                {activeImageIndex + 1} / {images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ExperienceCard;
