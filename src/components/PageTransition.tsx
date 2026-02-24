"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "@/components/SmoothScroll";

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

// Adjusted durations per user request
const COVER_DURATION = 1.25;
const REVEAL_DURATION = 1.25;
const FALLBACK_TIMEOUT = 5000; // 5 seconds max wait if route change fails

// Provider component
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [stage, setStage] = useState<"idle" | "cover" | "hold" | "reveal">(
    "idle",
  );
  const [targetPath, setTargetPath] = useState<string | null>(null);

  // Effect to handle reveal when the route actually changes
  useEffect(() => {
    // Only trigger reveal if we are waiting in the 'hold' stage and the route has changed
    // Checking pathname is usually enough for page transitions in App Router
    if (stage === "hold" && targetPath) {
      // 100ms buffer to allow the browser to paint the new DOM
      const revealTimer = setTimeout(() => {
        setStage("reveal");

        // Return to idle after reveal animation finishes
        setTimeout(() => {
          setIsTransitioning(false);
          setStage("idle");
          setTargetPath(null);

          // Resume Lenis smooth scroll after transition completes
          lenis?.start();

          // After the curtain reveals, if there's a hash in the URL, scroll to it manually
          // because the native browser jump was lost during the transition delay
          if (window.location.hash) {
            const targetId = window.location.hash.substring(1);
            const element = document.getElementById(targetId);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }
        }, REVEAL_DURATION * 1000);
      }, 100);

      return () => clearTimeout(revealTimer);
    }
  }, [pathname, stage, targetPath]);

  const startTransition = useCallback(
    (href: string) => {
      if (isTransitioning) return;

      // Basic check: if navigating to the exact same page, don't do full transition
      if (
        href === pathname ||
        (typeof window !== "undefined" &&
          href === window.location.pathname + window.location.search)
      ) {
        router.push(href);
        return;
      }

      setIsTransitioning(true);
      setTargetPath(href);

      // Pause Lenis during transition to reduce overhead
      lenis?.stop();

      // Phase 1: Cover - curtain rises from bottom with perspective
      setStage("cover");

      // Set fallback timeout in case route change fails/hangs
      const fallbackTimer = setTimeout(() => {
        if (stage === "hold") {
          console.warn(
            "PageTransition: Route change took too long, forcing reveal phase",
          );
          setStage("reveal");
          setTimeout(() => {
            setIsTransitioning(false);
            setStage("idle");
            setTargetPath(null);
          }, REVEAL_DURATION * 1000);
        }
      }, FALLBACK_TIMEOUT);

      // Phase 2: Hold - stay dark, navigate to new page
      setTimeout(() => {
        setStage("hold");
        // Scroll to top BEFORE navigating so new page starts at top,
        // EXCEPT if there's a hash fragment (like #project), then let browser handle it
        if (!href.includes("#")) {
          window.scrollTo(0, 0);
        }
        router.push(href);
      }, COVER_DURATION * 1000);
    },
    [router, isTransitioning, pathname, stage, lenis],
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
            className="fixed inset-0 pointer-events-none bg-background"
            style={{
              zIndex: 99999,
              willChange: "transform",
            }}
            initial={{ y: "calc(100% + 200px)" }}
            animate={{ y: "0%" }}
            transition={{
              duration: COVER_DURATION,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            {/* Curved TOP edge - concave */}
            <svg
              className="absolute w-full fill-background"
              style={{ top: "-199px", height: "200px" }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path d="M0 100 Q50 0 100 100 L100 100 L0 100 Z" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hold - full screen while page changes */}
      {stage === "hold" && (
        <div
          className="fixed inset-0 pointer-events-none bg-background"
          style={{
            zIndex: 99999,
          }}
        />
      )}

      {/* Reveal Curtain - falls from top with curved bottom */}
      <AnimatePresence>
        {stage === "reveal" && (
          <motion.div
            key="reveal-curtain"
            className="fixed inset-0 pointer-events-none bg-background"
            style={{
              zIndex: 99999,
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
              className="absolute w-full fill-background"
              style={{ top: "-199px", height: "200px" }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path d="M0 0 Q50 100 100 0 L100 100 L0 100 Z" />
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
