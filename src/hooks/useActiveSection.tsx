// hooks/useActiveSection.ts - Hook untuk mengelola section aktif
import { useState, useEffect } from "react";

interface UseActiveSectionReturn {
  activeSection: string;
  handleNavClick: (sectionId: string) => void;
}

export default function useActiveSection(
  sectionIds: string[] = []
): UseActiveSectionReturn {
  const [activeSection, setActiveSection] = useState<string>(
    sectionIds[0] || "home"
  );

  useEffect(() => {
    const handleScroll = (): void => {
      // Cek section mana yang sedang dilihat
      let currentSection = sectionIds[0];
      let minDistance = Infinity;

      sectionIds.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
          // Hitung jarak dari atas viewport
          const rect = section.getBoundingClientRect();
          const distance = Math.abs(rect.top - 100); // Offset 100px untuk UX yang lebih baik

          // Temukan section terdekat dengan bagian atas
          if (distance < minDistance) {
            minDistance = distance;
            currentSection = sectionId;
          }
        }
      });

      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Periksa section aktif saat awal load
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeSection, sectionIds]);

  const handleNavClick = (sectionId: string): void => {
    setActiveSection(sectionId);
  };

  return { activeSection, handleNavClick };
}
