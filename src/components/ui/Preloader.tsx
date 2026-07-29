"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    // Check if we've already shown the preloader in this session
    const hasShown = sessionStorage.getItem("preloader_shown");
    if (hasShown) {
      setIsLoading(false);
      setShouldRender(false);
      return;
    }

    // Lock scroll
    document.body.style.overflow = "hidden";

    // Animate counter from 0 to 100 over 1.5 seconds
    const controls = animate(count, 100, {
      duration: 1.5,
      ease: [0.7, 0, 0.3, 1], // Custom easing for that "fast then slow" premium feel
      onComplete: () => {
        // Wait a tiny bit after hitting 100 before hiding
        setTimeout(() => {
          setIsLoading(false);
          sessionStorage.setItem("preloader_shown", "true");
          document.body.style.overflow = "auto";
        }, 400);
      },
    });

    return () => {
      controls.stop();
      document.body.style.overflow = "auto";
    };
  }, [count]);

  if (!shouldRender) return null;

  return (
    <AnimatePresence onExitComplete={() => setShouldRender(false)}>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-background text-foreground"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Main Title */}
          <div className="overflow-hidden">
            <motion.h1 
              className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tighter uppercase"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
            >
              Restu Anggoro Kasih.
            </motion.h1>
          </div>

          {/* Loading Counter */}
          <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 overflow-hidden">
            <motion.div 
              className="flex items-baseline text-4xl md:text-6xl font-black tracking-tighter tabular-nums"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.4 }}
            >
              <motion.span>{rounded}</motion.span>
              <span className="text-primary ml-1">%</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
