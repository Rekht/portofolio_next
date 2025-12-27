// components/ProjectFilterScroller.tsx - Komponen filter scroll untuk proyek
import React, { useRef, useState, MouseEvent } from "react";
import Image from "next/image";

interface ProjectFilterScrollerProps {
  filters: string[];
  activeFilter: string;
  handleFilterClick: (filter: string) => void;
  isAnimating: boolean;
}

const ProjectFilterScroller: React.FC<ProjectFilterScrollerProps> = ({
  filters,
  activeFilter,
  handleFilterClick,
  isAnimating,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const iconMap: Record<string, string> = {
    All: "/assets/icons/all-mono.svg",
    Python: "/assets/icons/python-mono.svg",
    SQL: "/assets/icons/sql-mono.svg",
    "Power BI": "/assets/icons/powerbi-mono.svg",
    "Google Looker Studio": "/assets/icons/looker-mono.svg",
    JavaScript: "/assets/icons/js-mono.svg",
    Flutter: "/assets/icons/flutter-mono.svg",
    AWS: "/assets/icons/aws-mono.svg",
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current) {
      e.preventDefault();
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  const handleMouseEnter =
    (filter: string) => (e: MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setHoveredFilter(filter);
      setTooltipPos({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
    };

  const handleMouseLeave = () => {
    setHoveredFilter(null);
  };

  return (
    <>
      {/* Tombol Filter */}
      <div className="relative z-10">
        <div
          className="flex overflow-x-auto overflow-visible py-4"
          ref={scrollContainerRef}
          onWheel={handleWheel}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex space-x-4">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterClick(filter)}
                disabled={isAnimating}
                onMouseEnter={handleMouseEnter(filter)}
                onMouseLeave={handleMouseLeave}
                className={`relative w-14 h-14 rounded-full transition-all duration-300 flex-shrink-0 border ${
                  activeFilter === filter
                    ? "scale-110 shadow-lg shadow-purple-500/40 border-purple-400/50"
                    : "hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 border-white/20 hover:border-purple-400/40"
                }`}
                style={{
                  overflow: "visible",
                  background:
                    activeFilter === filter
                      ? "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)"
                      : "linear-gradient(135deg, #1e3a5f 0%, #312e81 50%, #4c1d95 100%)",
                }}
              >
                <Image
                  src={iconMap[filter]}
                  alt={filter}
                  width={24}
                  height={24}
                  className="w-6 h-6 m-auto pointer-events-none"
                  draggable={false}
                  style={{
                    filter: "brightness(0) invert(1)",
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip muncul di luar, mengikuti posisi mouse */}
      {hoveredFilter && (
        <div
          className="fixed z-50 px-2 py-1 bg-black text-white text-sm rounded pointer-events-none transition-opacity duration-200"
          style={{
            top: tooltipPos.y,
            left: tooltipPos.x,
            transform: "translate(-50%, -100%)",
          }}
        >
          {hoveredFilter}
        </div>
      )}
    </>
  );
};

export default ProjectFilterScroller;
