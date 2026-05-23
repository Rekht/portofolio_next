"use client";

import React from "react";

const DarkVeil: React.FC = () => {
  return (
    <div className="hidden dark:block fixed inset-0 pointer-events-none z-0 overflow-hidden bg-background transition-colors duration-500">
      {/* 
        Main Glow - Pre-blurred via large gradient spread instead of CSS filter: blur()
        Using larger gradient radii achieves the same visual softness without GPU blur cost
      */}
      <div
        className="absolute top-1/2 left-1/2 darkveil-glow-main"
        style={{
          width: "90vw",
          height: "60vh",
          transform: "translate(-40%, -50%)",
          background:
            "radial-gradient(ellipse at center, rgba(220, 100, 90, 0.15) 0%, rgba(160, 60, 55, 0.07) 30%, rgba(160, 60, 55, 0) 60%)",
        }}
      />

      {/* Secondary softer blue glow — also pre-blurred via gradient */}
      <div
        className="absolute darkveil-glow-secondary"
        style={{
          top: "-10%",
          left: "-10%",
          width: "55vw",
          height: "55vh",
          background:
            "radial-gradient(circle at center, rgba(120, 45, 40, 0.08) 0%, rgba(120, 45, 40, 0) 60%)",
        }}
      />

      {/* Ambient noise texture — unchanged, very lightweight */}
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
        @keyframes glowPulse {
          0%,
          100% {
            transform: translate(-40%, -50%) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translate(-40%, -50%) scale(1.05);
            opacity: 1;
          }
        }
        @keyframes glowPulseSecondary {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export default DarkVeil;
