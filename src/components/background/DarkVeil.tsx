"use client";

import React from "react";

const DarkVeil: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-background transition-colors duration-500">
      {/* ===== DARK MODE GLOWS ===== */}
      
      {/* Main rose/coral glow — center-top area */}
      <div
        className="absolute hidden dark:block darkveil-glow-main"
        style={{
          top: "5%",
          left: "30%",
          width: "70vw",
          height: "55vh",
          background:
            "radial-gradient(ellipse at center, rgba(220, 100, 90, 0.18) 0%, rgba(180, 70, 65, 0.08) 35%, transparent 65%)",
        }}
      />

      {/* Secondary warm glow — bottom-right */}
      <div
        className="absolute hidden dark:block darkveil-glow-secondary"
        style={{
          bottom: "-5%",
          right: "-5%",
          width: "50vw",
          height: "50vh",
          background:
            "radial-gradient(circle at center, rgba(200, 80, 60, 0.12) 0%, rgba(180, 60, 50, 0.04) 40%, transparent 65%)",
        }}
      />

      {/* Tertiary subtle glow — top-left accent */}
      <div
        className="absolute hidden dark:block darkveil-glow-tertiary"
        style={{
          top: "-10%",
          left: "-8%",
          width: "45vw",
          height: "45vh",
          background:
            "radial-gradient(circle at center, rgba(160, 55, 45, 0.1) 0%, transparent 55%)",
        }}
      />

      {/* ===== LIGHT MODE GLOWS ===== */}

      {/* Main rose glow — top area */}
      <div
        className="absolute dark:hidden darkveil-glow-main"
        style={{
          top: "0%",
          left: "25%",
          width: "70vw",
          height: "50vh",
          background:
            "radial-gradient(ellipse at center, rgba(220, 80, 80, 0.08) 0%, rgba(220, 100, 90, 0.03) 40%, transparent 65%)",
        }}
      />

      {/* Secondary peach glow — bottom-right */}
      <div
        className="absolute dark:hidden darkveil-glow-secondary"
        style={{
          bottom: "0%",
          right: "0%",
          width: "50vw",
          height: "45vh",
          background:
            "radial-gradient(circle at center, rgba(240, 130, 90, 0.06) 0%, rgba(240, 130, 90, 0.02) 40%, transparent 60%)",
        }}
      />

      {/* Tertiary soft blush — top-left */}
      <div
        className="absolute dark:hidden darkveil-glow-tertiary"
        style={{
          top: "-5%",
          left: "-5%",
          width: "40vw",
          height: "40vh",
          background:
            "radial-gradient(circle at center, rgba(200, 70, 70, 0.05) 0%, transparent 50%)",
        }}
      />

      {/* Ambient noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <style jsx>{`
        .darkveil-glow-main {
          animation: glowPulse 15s ease-in-out infinite;
          contain: strict;
        }
        .darkveil-glow-secondary {
          animation: glowPulseSecondary 20s ease-in-out 5s infinite;
          contain: strict;
        }
        .darkveil-glow-tertiary {
          animation: glowPulseTertiary 25s ease-in-out 10s infinite;
          contain: strict;
        }
        @keyframes glowPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.85;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }
        @keyframes glowPulseSecondary {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.12);
            opacity: 0.85;
          }
        }
        @keyframes glowPulseTertiary {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.06);
            opacity: 0.75;
          }
        }
      `}</style>
    </div>
  );
};

export default DarkVeil;
