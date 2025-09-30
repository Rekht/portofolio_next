// app/contact/page.tsx - Halaman Contact
"use client";

import React, { Suspense } from "react";
import Navigation from "@/components/Navigation";
import DarkVeil from "@/components/background/DarkVeil";
import { SectionLoader } from "@/utils/pageUtils";

// Lazy load ContactSection
const ContactSection = React.lazy(
  () => import("@/app/contact/components/ContactOnly")
);

export default function ContactPage() {
  return (
    <div className="font-sans bg-black text-white relative h-screen overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <DarkVeil />
      </div>

      {/* Navigation */}
      <div className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
        <Navigation
          scrolled={false}
          activePage="contact"
          handleNavClick={() => {}}
        />
      </div>

      {/* Main Content */}
      <main className="absolute inset-0 top-15 bottom-[64px] z-10 overflow-hidden">
        <section id="contact">
          <Suspense fallback={<SectionLoader />}>
            <ContactSection />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
