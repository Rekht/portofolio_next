"use client";

import React from "react";
import VisitorStats from "@/app/about/components/VisitorStats";

export default function AnalyticsAdminPage() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Monitoring Website
        </h1>
        <p className="text-muted-foreground mt-2">
          Real-time tracking and visitor statistics for this platform.
        </p>
      </div>
      
      <div className="bg-card/50 rounded-xl border border-border p-6 shadow-sm">
        <VisitorStats />
      </div>
    </div>
  );
}
