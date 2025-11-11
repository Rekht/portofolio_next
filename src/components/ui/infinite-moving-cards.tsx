"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      const duration =
        speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";
      containerRef.current.style.setProperty("--animation-duration", duration);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,rgba(0,0,0,1)5%,rgba(0,0,0,1)90%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-6 py-6",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            className={cn(
              "relative w-[350px] max-w-full shrink-0 md:w-[450px]",
              // Background gradient + shadow sesuai paletmu
              "rounded-2xl border border-zinc-800/50 bg-[linear-gradient(180deg,rgba(88,28,135,0.35),rgba(17,24,39,0.85))]",
              "shadow-[0_0_20px_rgba(88,28,135,0.25)] hover:shadow-[0_0_35px_rgba(147,51,234,0.35)]",
              "transition-all duration-700 ease-out px-8 py-6"
            )}
          >
            <blockquote className="flex flex-col justify-between h-full">
              <span className="relative z-20 text-sm leading-[1.7] font-normal text-gray-200">
                {item.quote}
              </span>
              <div className="relative z-20 mt-6 flex flex-row items-center justify-between">
                <span className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-purple-300">
                    {item.name}
                  </span>
                  <span className="text-xs font-normal text-gray-400">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
