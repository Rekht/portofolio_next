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
    All: "https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/icons/all-mono.svg",
    Python: "https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/icons/python-mono.svg",
    SQL: "https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/icons/sql-mono.svg",
    "Power BI": "https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/icons/powerbi-mono.svg",
    "Google Looker Studio": "https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/icons/looker-mono.svg",
    JavaScript: "https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/icons/js-mono.svg",
    Flutter: "https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/icons/flutter-mono.svg",
    AWS: "https://joybwgquarfmqmaedxfw.supabase.co/storage/v1/object/public/portfolio-images/assets/icons/aws-mono.svg",
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
                className={`relative w-14 h-14 rounded-full transition-all duration-300 flex-shrink-0 border flex items-center justify-center ${
                  activeFilter === filter
                    ? "scale-110 shadow-lg shadow-primary/40 border-primary/50"
                    : "hover:scale-105 shadow-md hover:shadow-lg shadow-black/5 hover:shadow-primary/20 bg-card border-border hover:border-primary/40"
                }`}
                style={
                  activeFilter === filter
                    ? {
                        background: "linear-gradient(135deg, var(--color-accent-gradient-from) 0%, var(--color-primary) 50%, var(--color-accent-gradient-to) 100%)",
                      }
                    : {}
                }
              >
                <div
                  className={`w-6 h-6 m-auto pointer-events-none transition-colors duration-300 ${
                    activeFilter === filter ? "bg-white" : "bg-foreground/70"
                  }`}
                  style={{
                    WebkitMaskImage: `url(${iconMap[filter]})`,
                    WebkitMaskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskImage: `url(${iconMap[filter]})`,
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
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
