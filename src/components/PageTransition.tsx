"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Context for page transition
interface TransitionContextType {
  startTransition: (href: string) => void;
  isTransitioning: boolean;
  stage: "idle" | "cover" | "hold" | "reveal";
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export function usePageTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("usePageTransition must be used within TransitionProvider");
  }
  return context;
}

// Hook to check if perspective should be applied (for use in Navigation)
export function useTransitionStage() {
  const context = useContext(TransitionContext);
  return context?.stage ?? "idle";
}

// Shorter durations for better performance
const COVER_DURATION = 1; // reduced from 1s
const HOLD_DURATION = 300; // reduced from 500ms
const REVEAL_DURATION = 1.5; // reduced from 1s

// Provider component
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [stage, setStage] = useState<"idle" | "cover" | "hold" | "reveal">(
    "idle"
  );

  const startTransition = useCallback(
    (href: string) => {
      if (isTransitioning) return;

      setIsTransitioning(true);

      // Phase 1: Cover - curtain rises from bottom with perspective
      setStage("cover");

      // Phase 2: Hold - stay dark, navigate to new page
      setTimeout(() => {
        setStage("hold");
        router.push(href);

        // Phase 3: Reveal - curtain falls from top with perspective
        setTimeout(() => {
          setStage("reveal");

          // Complete
          setTimeout(() => {
            setIsTransitioning(false);
            setStage("idle");
          }, REVEAL_DURATION * 1000);
        }, HOLD_DURATION);
      }, COVER_DURATION * 1000);
    },
    [router, isTransitioning]
  );

  return (
    <TransitionContext.Provider
      value={{ startTransition, isTransitioning, stage }}
    >
      {/* Cover Curtain - rises from bottom with curved top */}
      <AnimatePresence>
        {stage === "cover" && (
          <motion.div
            key="cover-curtain"
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 99999,
              backgroundColor: "#000000",
              willChange: "transform",
            }}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: COVER_DURATION,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            {/* Curved TOP edge - concave */}
            <svg
              className="absolute w-full"
              style={{ top: "-199px", height: "200px" }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path d="M0 100 Q50 0 100 100 L100 100 L0 100 Z" fill="#000000" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hold - full black screen while page changes */}
      {stage === "hold" && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 99999,
            backgroundColor: "#000000",
          }}
        />
      )}

      {/* Reveal Curtain - falls from top with curved bottom */}
      <AnimatePresence>
        {stage === "reveal" && (
          <motion.div
            key="reveal-curtain"
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 99999,
              backgroundColor: "#000000",
              willChange: "transform",
            }}
            initial={{ y: "0%" }}
            animate={{ y: "calc(100% + 200px)" }}
            transition={{
              duration: REVEAL_DURATION,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            {/* Curved TOP edge - convex curve bulging DOWN when falling */}
            <svg
              className="absolute w-full"
              style={{ top: "-199px", height: "200px" }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path d="M0 0 Q50 100 100 0 L100 100 L0 100 Z" fill="#000000" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content - no scaling animation, direct render */}
      {children}
    </TransitionContext.Provider>
  );
}

// Custom Link component
interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function TransitionLink({
  href,
  children,
  className,
  onClick,
}: TransitionLinkProps) {
  const { startTransition, isTransitioning } = usePageTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isTransitioning) return;
    onClick?.();
    startTransition(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
