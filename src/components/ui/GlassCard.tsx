"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

type AccentColor = "purple" | "cyan" | "fuchsia" | "blue" | "green" | "orange";

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
  purple: {
    primary: "bg-purple-500/10",
    secondary: "bg-cyan-500/10",
  },
  cyan: {
    primary: "bg-cyan-500/10",
    secondary: "bg-purple-500/10",
  },
  fuchsia: {
    primary: "bg-fuchsia-500/10",
    secondary: "bg-purple-500/10",
  },
  blue: {
    primary: "bg-blue-500/10",
    secondary: "bg-indigo-500/10",
  },
  green: {
    primary: "bg-green-500/10",
    secondary: "bg-emerald-500/10",
  },
  orange: {
    primary: "bg-orange-500/10",
    secondary: "bg-amber-500/10",
  },
};

const accentGradients: Record<AccentColor, string> = {
  purple: "from-purple-500/5 via-transparent to-cyan-500/5",
  cyan: "from-cyan-500/5 via-transparent to-purple-500/5",
  fuchsia: "from-fuchsia-500/5 via-transparent to-purple-500/5",
  blue: "from-blue-500/5 via-transparent to-indigo-500/5",
  green: "from-green-500/5 via-transparent to-emerald-500/5",
  orange: "from-orange-500/5 via-transparent to-amber-500/5",
};

export default function GlassCard({
  children,
  accentColor = "purple",
  className = "",
  noPadding = false,
  noAnimation = false,
  ...motionProps
}: GlassCardProps) {
  const colors = accentColors[accentColor];
  const gradient = accentGradients[accentColor];

  const content = (
    <>
      {/* Background with gradient - Opacity 50% */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50" />
      <div className={`absolute inset-0 bg-gradient-to-tr ${gradient}`} />

      {/* Glassmorphism overlay - Enhanced blur */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-white/5" />

      {/* Border for glass effect */}
      <div className="absolute inset-0 rounded-3xl border border-white/10" />

      {/* Decorative elements */}
      <div
        className={`absolute top-0 right-0 w-64 h-64 ${colors.primary} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`}
      />
      <div
        className={`absolute bottom-0 left-0 w-48 h-48 ${colors.secondary} rounded-full blur-3xl translate-y-1/2 -translate-x-1/2`}
      />

      {/* Content */}
      <div className={`relative z-10 ${noPadding ? "" : "p-8"}`}>
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
