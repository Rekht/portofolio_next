"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Use MotionValues to bypass React state for high-frequency updates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Very snappy spring for the main dot to eliminate delay
  const dotX = useSpring(mouseX, { stiffness: 2000, damping: 50, mass: 0.1 });
  const dotY = useSpring(mouseY, { stiffness: 2000, damping: 50, mass: 0.1 });

  // Looser spring for the trailing ring
  const ringX = useSpring(mouseX, { stiffness: 200, damping: 20, mass: 0.5 });
  const ringY = useSpring(mouseY, { stiffness: 200, damping: 20, mass: 0.5 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDevice(true);
      return;
    }

    document.body.style.cursor = "none";
    const style = document.createElement("style");
    style.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(style);

    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") || 
        target.closest("button");
        
      setIsHovering(!!isClickable);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.body.style.cursor = "auto";
      if (document.head.contains(style)) document.head.removeChild(style);
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible, mouseX, mouseY]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Main Dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-primary rounded-full pointer-events-none z-[9999] -ml-[6px] -mt-[6px]"
        style={{ x: dotX, y: dotY }}
        animate={{
          scale: isHovering ? 2.5 : 1,
          opacity: isVisible ? (isHovering ? 0.5 : 1) : 0,
        }}
        transition={{ duration: 0.2 }}
      />
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border-[1.5px] border-primary rounded-full pointer-events-none z-[9998] hidden sm:block -ml-[16px] -mt-[16px]"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isVisible ? (isHovering ? 0 : 0.5) : 0,
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
