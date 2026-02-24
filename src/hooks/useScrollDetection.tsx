// hooks/useScrollDetection.ts - Hook untuk mendeteksi scroll
import { useState, useEffect } from "react";

interface UseScrollDetectionReturn {
  scrolled: boolean;
}

export default function useScrollDetection(
  scrollThreshold: number = 10,
): UseScrollDetectionReturn {
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Periksa posisi scroll saat awal load
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollThreshold]);

  return { scrolled };
}
