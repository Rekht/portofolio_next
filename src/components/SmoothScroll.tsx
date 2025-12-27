"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Sync Lenis scroll with framer-motion by dispatching scroll events
    lenis.on("scroll", () => {
      // This triggers native scroll event listeners that framer-motion uses
      window.dispatchEvent(new Event("scroll"));
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
