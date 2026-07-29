"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const hoveredElement = useRef<HTMLElement | null>(null);
  const rawMouse = useRef({ x: 0, y: 0 });

  // Main Dot (always follows mouse precisely)
  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);
  const dotXSpring = useSpring(dotX, { stiffness: 2000, damping: 50, mass: 0.1 });
  const dotYSpring = useSpring(dotY, { stiffness: 2000, damping: 50, mass: 0.1 });

  // Outer Ring (morphs and snaps to elements)
  const ringX = useMotionValue(0);
  const ringY = useMotionValue(0);
  const ringW = useMotionValue(32);
  const ringH = useMotionValue(32);
  const ringR = useMotionValue(16);

  const ringXSpring = useSpring(ringX, { stiffness: 250, damping: 25, mass: 0.3 });
  const ringYSpring = useSpring(ringY, { stiffness: 250, damping: 25, mass: 0.3 });
  const ringWSpring = useSpring(ringW, { stiffness: 250, damping: 25, mass: 0.3 });
  const ringHSpring = useSpring(ringH, { stiffness: 250, damping: 25, mass: 0.3 });
  const ringRSpring = useSpring(ringR, { stiffness: 250, damping: 25, mass: 0.3 });

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
      rawMouse.current = { x: e.clientX, y: e.clientY };
      dotX.set(e.clientX - 6);
      dotY.set(e.clientY - 6);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Find the closest clickable container
      const clickable = target.closest('a, button, [role="button"]');
      if (clickable) {
        hoveredElement.current = clickable as HTMLElement;
        setIsHovering(true);
      } else {
        hoveredElement.current = null;
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      hoveredElement.current = null;
      setIsHovering(false);
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Animation frame loop for continuous bounding box tracking (handles scroll and scale animations)
    let rafId: number;
    const loop = () => {
      if (hoveredElement.current) {
        const rect = hoveredElement.current.getBoundingClientRect();
        const padding = 12; // extra padding around the element
        const computedStyle = window.getComputedStyle(hoveredElement.current);
        let radius = parseFloat(computedStyle.borderRadius);
        if (isNaN(radius)) radius = 8; // fallback radius

        ringX.set(rect.left - padding / 2);
        ringY.set(rect.top - padding / 2);
        ringW.set(rect.width + padding);
        ringH.set(rect.height + padding);
        ringR.set(radius + padding / 4);
      } else {
        ringX.set(rawMouse.current.x - 16);
        ringY.set(rawMouse.current.y - 16);
        ringW.set(32);
        ringH.set(32);
        ringR.set(16);
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      document.body.style.cursor = "auto";
      if (document.head.contains(style)) document.head.removeChild(style);
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible, dotX, dotY, ringX, ringY, ringW, ringH, ringR]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Main Dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-primary rounded-full pointer-events-none z-[9999]"
        style={{ x: dotXSpring, y: dotYSpring }}
        animate={{
          opacity: isVisible ? (isHovering ? 0 : 1) : 0,
        }}
        transition={{ duration: 0.2 }}
      />
      {/* Magnetic Outer Ring / Border */}
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-[9998] hidden sm:block border-[1.5px] ${isHovering ? 'border-primary/20' : 'border-primary'}`}
        style={{
          x: ringXSpring,
          y: ringYSpring,
          width: ringWSpring,
          height: ringHSpring,
          borderRadius: ringRSpring,
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Spinning Glow Effect (only visible when hovering magnetic items) */}
        {isHovering && (
          <motion.div
            className="absolute -inset-[1.5px] rounded-[inherit]"
            style={{
              padding: "1.5px",
              background: "conic-gradient(from 0deg, transparent 60%, hsl(var(--primary) / 0.8) 90%, hsl(var(--primary)) 100%)",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
        )}
      </motion.div>
    </>
  );
}
