// components/Navigation.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TransitionLink } from "@/components/PageTransition";
import ThemeToggle from "@/components/ThemeToggle";

// Icons for navigation
const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const AboutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ExperienceIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const EducationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const ContactIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

interface NavigationProps {
  scrolled: boolean;
  activePage: string;
  handleNavClick: (sectionId: string) => void;
}

const navItems = [
  { href: "/about", icon: AboutIcon, label: "About", page: "about" },
  {
    href: "/experience",
    icon: ExperienceIcon,
    label: "Experience",
    page: "experience",
  },
  {
    href: "/education",
    icon: EducationIcon,
    label: "Education",
    page: "education",
  },
];

const Navigation: React.FC<NavigationProps> = ({
  scrolled,
  activePage,
  handleNavClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Close menu on outside click or scroll (only for mobile menu)
  useEffect(() => {
    const handleClickOutside = () => setIsMenuOpen(false);
    const handleScroll = () => setIsMenuOpen(false);

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMenuOpen]);

  // Close mobile menu when switching to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Desktop Sidebar Navigation - Hidden on mobile via CSS */}
      <aside className="fixed left-4 inset-y-0 z-50 hidden md:flex items-center">
        {/* Glassmorphism container */}
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl py-4 px-2 shadow-2xl">
          {/* Logo */}
          <TransitionLink href="/" className="block mb-4">
            <motion.div
              className="flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src="/assets/logo.png"
                alt="Logo"
                width={36}
                height={36}
                className="rounded-lg dark:invert-0 invert"
              />
            </motion.div>
          </TransitionLink>

          {/* Divider */}
          <div className="w-6 h-px bg-border mx-auto mb-4" />

          {/* Navigation Items */}
          <div className="flex flex-col items-center space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                activePage === item.page ||
                (item.page === "" && activePage === "home");

              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <TransitionLink
                    href={item.href}
                    className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 group ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon />

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        className="absolute -left-3 w-1 h-4 bg-blue-500 rounded-r-full"
                        layoutId="activeIndicator"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </TransitionLink>

                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredItem === item.label && (
                      <motion.div
                        className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-card/95 backdrop-blur-sm text-foreground text-sm font-medium rounded-lg whitespace-nowrap shadow-xl border border-border"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                      >
                        {item.label}
                        {/* Arrow */}
                        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-[6px] border-r-card/95" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="w-6 h-px bg-border mx-auto my-4" />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Divider */}
          <div className="w-6 h-px bg-white/20 mx-auto my-4" />

          {/* Available for Work indicator */}
          <motion.div
            className="flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
          >
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75" />
            </div>
          </motion.div>
        </div>
      </aside>

      {/* Mobile Navigation - Hidden on desktop via CSS */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <nav className="w-full px-4 py-3 backdrop-blur-xl border-b border-border bg-background/80">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <TransitionLink href="/">
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src="/assets/logo.png"
                  alt="Logo"
                  width={36}
                  height={36}
                  className="rounded-full dark:invert-0 invert"
                />
              </motion.div>
            </TransitionLink>

            <div className="flex items-center space-x-2">
              {/* Theme Toggle for Mobile */}
              <ThemeToggle />

              {/* Burger Menu Button */}
              <motion.button
                className="relative w-8 h-8 flex flex-col justify-center items-center focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.span
                  className="absolute w-6 h-0.5 bg-foreground"
                  animate={{
                    rotate: isMenuOpen ? 45 : 0,
                    y: isMenuOpen ? 0 : -6,
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="absolute w-6 h-0.5 bg-foreground"
                  animate={{
                    opacity: isMenuOpen ? 0 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="absolute w-6 h-0.5 bg-foreground"
                  animate={{
                    rotate: isMenuOpen ? -45 : 0,
                    y: isMenuOpen ? 0 : 6,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className="absolute top-full left-0 right-0 bg-card/98 backdrop-blur-xl border-b border-border shadow-2xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-6 space-y-2">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive =
                      activePage === item.page ||
                      (item.page === "" && activePage === "home");

                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <TransitionLink
                          href={item.href}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Icon />
                          <span className="font-medium">{item.label}</span>
                        </TransitionLink>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
    </>
  );
};

export default Navigation;
