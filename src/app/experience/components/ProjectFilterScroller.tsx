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
    All: "/assets/icons/all-icon.svg",
    Python: "/assets/icons/python-icon.svg",
    SQL: "/assets/icons/sql-icon.svg",
    "Power BI": "/assets/icons/power-bi-icon.svg",
    "Google Looker Studio": "/assets/icons/looker-studio-icon.svg",
    JavaScript: "/assets/icons/js-icon.svg",
    Flutter: "/assets/icons/flutter-icon.svg",
    AWS: "/assets/icons/aws-icon.svg",
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
                className={`relative w-14 h-14 rounded-full transition-all duration-300 flex-shrink-0 ${
                  activeFilter === filter
                    ? "bg-gray-400 text-black scale-110 shadow-md"
                    : "bg-white hover:bg-gray-400 hover:scale-105"
                }`}
                style={{ overflow: "visible" }}
              >
                <Image
                  src={iconMap[filter]}
                  alt={filter}
                  width={24}
                  height={24}
                  className="w-6 h-6 m-auto pointer-events-none"
                  draggable={false}
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
