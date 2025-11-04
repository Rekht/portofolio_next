"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: { title: string; src: string };
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "relative bg-gray-100 dark:bg-neutral-900 overflow-hidden aspect-[10/14] w-full transition-all duration-500 ease-out rounded-4xl",
        hovered !== null && hovered !== index && "blur-[2px] brightness-50"
      )}
    >
      <img
        src={card.src}
        alt={card.title}
        className="w-full h-full object-cover absolute inset-0"
      />
    </div>
  )
);

Card.displayName = "Card";

type CardType = {
  title: string;
  src: string;
};

export function FocusCards({ cards }: { cards: CardType[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="relative w-full grid grid-cols-1 sm:grid-cols-3 gap-6 justify-items-center">
      {/* Text tengah dengan efek smooth masuk dari bawah */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        {hovered !== null && (
          <motion.h1
            key={cards[hovered].title}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="text-4xl md:text-6xl font-bold text-white text-center drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
          >
            {cards[hovered].title}
          </motion.h1>
        )}
      </div>

      {/* Cards */}
      {cards.map((card, index) => (
        <div
          key={card.title}
          className="relative w-full max-w-[320px] sm:max-w-[360px] md:max-w-none"
        >
          <Card
            card={card}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
          />
        </div>
      ))}
    </div>
  );
}
