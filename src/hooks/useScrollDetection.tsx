// hooks/useScrollDetection.ts - Hook untuk mendeteksi scroll
import { useState, useEffect } from "react";

interface UseScrollDetectionReturn {
  scrolled: boolean;
}

export default function useScrollDetection(
  scrollThreshold: number = 10
): UseScrollDetectionReturn {
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      // Cek jika halaman di-scroll untuk mengubah background navbar
      const isScrolled = window.scrollY > scrollThreshold;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Periksa posisi scroll saat awal load
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled, scrollThreshold]);

  return { scrolled };
}
