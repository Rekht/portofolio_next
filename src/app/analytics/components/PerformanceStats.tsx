"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import GlassCard from "@/components/ui/GlassCard";

// Real data from Vercel Analytics requires a backend API integration with a Vercel API Token.
// Currently displaying empty states.
const deviceData: any[] = [];
const browserData: any[] = [];

export default function PerformanceStats() {
  // We no longer simulate active users
  const activeUsers = null;



  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
        Platform Insights
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Live Active Users */}
        <GlassCard accentColor="cyan" className="p-5 flex flex-col justify-center items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-3 w-3">
              <span className="relative inline-flex rounded-full h-3 w-3 bg-muted"></span>
            </span>
            <span className="text-muted-foreground text-sm font-medium">Live Active Users</span>
          </div>
          <p className="text-xl font-medium text-muted-foreground mt-2">
            No data available
          </p>
        </GlassCard>



        {/* Bounce Rate */}
        <GlassCard accentColor="cyan" className="p-5 flex flex-col justify-center items-center text-center">
          <div className="flex items-center gap-2 mb-2">
             <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-muted-foreground text-sm font-medium">Bounce Rate</span>
          </div>
          <p className="text-xl font-medium text-muted-foreground mt-2">
            No data available
          </p>
        </GlassCard>

        {/* Avg Session */}
        <GlassCard accentColor="purple" className="p-5 flex flex-col justify-center items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-muted-foreground text-sm font-medium">Avg Session</span>
          </div>
          <p className="text-xl font-medium text-muted-foreground mt-2">
            No data available
          </p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Device Breakdown */}
        <GlassCard accentColor="cyan" className="p-6 md:col-span-1 flex flex-col">
          <h4 className="text-lg font-semibold text-foreground mb-4">Device Breakdown</h4>
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <p className="text-muted-foreground text-sm">No data available</p>
          </div>
        </GlassCard>

        {/* Browser Usage */}
        <GlassCard accentColor="purple" className="p-6 md:col-span-1 flex flex-col">
          <h4 className="text-lg font-semibold text-foreground mb-6">Top Browsers</h4>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">No data available</p>
          </div>
        </GlassCard>

        {/* System Health */}
        <GlassCard accentColor="cyan" className="p-6 md:col-span-1">
          <h4 className="text-lg font-semibold text-foreground mb-6">System Health</h4>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">API Latency</p>
                  <p className="font-bold text-foreground">No data</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 bg-secondary text-muted-foreground rounded-full">Unknown</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Uptime (30d)</p>
                  <p className="font-bold text-foreground">No data</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 bg-secondary text-muted-foreground rounded-full">Unknown</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Build Time</p>
                  <p className="font-bold text-foreground">No data</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 bg-secondary text-muted-foreground rounded-full">Unknown</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
