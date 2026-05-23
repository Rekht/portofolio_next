"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

type AccentColor = "primary" | "purple" | "cyan" | "fuchsia" | "blue" | "green" | "orange";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  accentColor?: AccentColor;
  className?: string;
  noPadding?: boolean;
  noAnimation?: boolean;
}

const accentColors: Record<
  AccentColor,
  { primary: string; secondary: string }
> = {
  primary: { primary: "bg-primary/10", secondary: "bg-primary/5" },
  purple: { primary: "bg-primary/10", secondary: "bg-primary/5" },
  cyan: { primary: "bg-primary/10", secondary: "bg-primary/5" },
  fuchsia: { primary: "bg-primary/10", secondary: "bg-primary/5" },
  blue: { primary: "bg-primary/10", secondary: "bg-primary/5" },
  green: { primary: "bg-primary/10", secondary: "bg-primary/5" },
  orange: { primary: "bg-primary/10", secondary: "bg-primary/5" },
};

const accentGradients: Record<AccentColor, string> = {
  primary: "from-primary/5 to-accent-gradient-to/5",
  purple: "from-primary/5 to-accent-gradient-to/5",
  cyan: "from-primary/5 to-accent-gradient-to/5",
  fuchsia: "from-primary/5 to-accent-gradient-to/5",
  blue: "from-primary/5 to-accent-gradient-to/5",
  green: "from-primary/5 to-accent-gradient-to/5",
  orange: "from-primary/5 to-accent-gradient-to/5",
};

export default function GlassCard({
  children,
  accentColor = "primary",
  className = "",
  noPadding = false,
  noAnimation = false,
  ...motionProps
}: GlassCardProps) {
  const colors = accentColors[accentColor];
  const gradient = accentGradients[accentColor];

  const content = (
    <>
      {/* Background with gradient - Uses theme variables */}
      <div className="absolute inset-0 bg-card/80" />
      <div className={`absolute inset-0 bg-gradient-to-tr ${gradient}`} />

      {/* Glassmorphism overlay - Enhanced blur */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-background/10" />

      {/* Border for glass effect */}
      <div className="absolute inset-0 rounded-3xl border border-border" />

      {/* Decorative elements */}
      <div
        className={`absolute top-0 right-0 w-64 h-64 ${colors.primary} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`}
      />
      <div
        className={`absolute bottom-0 left-0 w-48 h-48 ${colors.secondary} rounded-full blur-3xl translate-y-1/2 -translate-x-1/2`}
      />

      {/* Content */}
      <div className={`relative z-10 ${noPadding ? "" : "p-4 md:p-6 lg:p-8"}`}>
        {children}
      </div>
    </>
  );

  if (noAnimation) {
    return (
      <div className={`relative overflow-hidden rounded-3xl ${className}`}>
        {content}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-3xl ${className}`}
      {...motionProps}
    >
      {content}
    </motion.div>
  );
}
