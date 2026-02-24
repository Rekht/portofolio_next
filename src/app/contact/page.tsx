// app/contact/page.tsx - Halaman Contact
"use client";

import React, { Suspense } from "react";
import Navigation from "@/components/Navigation";
// DarkVeil moved to layout.tsx — single instance for all pages
import { SectionLoader } from "@/utils/pageUtils";

// Lazy load ContactSection
const ContactSection = React.lazy(
  () => import("@/app/contact/components/ContactOnly"),
);

export default function ContactPage() {
  return (
    <div className="font-sans h-screen overflow-hidden bg-background text-foreground relative flex flex-col">
      {/* Background moved to layout.tsx */}

      {/* Navigation */}
      <Navigation
        scrolled={false}
        activePage="contact"
        handleNavClick={() => {}}
      />

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center -mt-8">
        <div className="w-full">
          <Suspense fallback={<SectionLoader />}>
            <ContactSection />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
