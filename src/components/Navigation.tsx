// components/Navigation.tsx
import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface NavigationProps {
  scrolled: boolean;
  activePage: string; // halaman aktif
  handleNavClick: (sectionId: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  scrolled,
  activePage,
  handleNavClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Cek ukuran layar
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Tutup menu jika klik luar atau scroll
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

  // Daftar halaman
  const navLinks = useMemo(() => {
    const pages = ["about", "experience", "education"];

    return pages.map((page, index) => (
      <motion.a
        key={page}
        href={`/${page}`}
        onClick={(e) => {
          e.preventDefault();
          window.location.href = `/${page}`;
          setIsMenuOpen(false);
        }}
        className={`nav-link px-4 py-2 rounded-full transition-all duration-300 ${
          activePage === page
            ? "active-nav bg-blue-600 text-white"
            : isMobile
            ? "text-gray-300 hover:text-white hover:bg-gray-700/50"
            : "text-gray-300 hover:text-white hover:bg-white/10"
        } ${isMobile ? "block w-full text-center mb-2" : "mx-1"}`}
        initial={isMobile ? { opacity: 0, x: -20 } : {}}
        animate={isMobile ? { opacity: 1, x: 0 } : {}}
        transition={isMobile ? { delay: index * 0.1 } : {}}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {page.charAt(0).toUpperCase() + page.slice(1)}
      </motion.a>
    ));
  }, [activePage, isMobile]);

  // Animasi burger
  const burgerVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 },
  };

  const lineVariants = {
    closed: { rotate: 0, y: 0, opacity: 1 },
    open: (custom: number) => ({
      rotate: custom === 1 ? 45 : custom === 3 ? -45 : 0,
      y: custom === 1 ? 6 : custom === 3 ? -6 : 0,
      opacity: custom === 2 ? 0 : 1,
    }),
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <nav className="w-full px-section relative z-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo ke Homepage */}
          <Link href="/" passHref>
            <motion.div
              className="flex-shrink-0 cursor-pointer flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src="/assets/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center bg-black/80 backdrop-blur-sm rounded-full px-2 py-1">
            {navLinks}
          </div>

          {/* Available for Work + Burger */}
          <div className="flex items-center space-x-4">
            {/* Available for Work */}
            <motion.a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/contact";
              }}
              className="hidden sm:block text-green-400 hover:text-green-300 font-semibold transition-colors duration-300 px-4 py-2 rounded-full border border-green-400/30 hover:border-green-300/50 bg-black/80 backdrop-blur-sm hover:bg-black/90"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Available for Work
            </motion.a>

            {/* Burger Menu */}
            <motion.button
              className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              variants={burgerVariants}
              animate={isMenuOpen ? "open" : "closed"}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {[1, 2, 3].map((line) => (
                <motion.span
                  key={line}
                  className="absolute w-6 h-0.5 bg-white transform origin-center"
                  custom={line}
                  variants={lineVariants}
                  animate={isMenuOpen ? "open" : "closed"}
                  transition={{ duration: 0.3 }}
                  style={{
                    top: line === 1 ? "30%" : line === 2 ? "50%" : "70%",
                    left: "50%",
                    marginLeft: "-12px",
                  }}
                />
              ))}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && isMobile && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsMenuOpen(false)}
              />
              <motion.div
                className="absolute top-full left-0 right-0 bg-gray-900/98 backdrop-blur-md border-b border-gray-700/50 shadow-2xl"
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="container mx-auto px-4 py-6">
                  <div className="flex flex-col space-y-2">
                    {navLinks}

                    <motion.a
                      href="/contact"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = "/contact";
                        setIsMenuOpen(false);
                      }}
                      className="text-green-400 hover:text-green-300 font-semibold transition-colors duration-300 px-4 py-3 rounded-full border border-green-400/30 hover:border-green-300/50 text-center mt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Available for Work
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Navigation;
