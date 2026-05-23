"use client";

import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";

interface VisitorData {
  date: string;
  count: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/90 backdrop-blur-sm border border-border rounded-xl px-4 py-3 shadow-xl">
        <p className="text-primary font-medium text-sm">{label}</p>
        <p className="text-foreground font-bold text-lg">
          {payload[0].value}{" "}
          <span className="text-muted-foreground text-sm font-normal">
            visitors
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const subFilterLabels: Record<string, string> = {
  "all": "All",
  "years": "1 Year",
  "ytd": "YTD",
  "month": "1 Month",
  "week": "1 Week",
  "last6": "6 Months",
  "3 month": "3 Months"
};

export default function VisitorStats() {
  const [data, setData] = useState<VisitorData[]>([]);
  const [view, setView] = useState<"day" | "month" | "year">("day");
  const [subFilter, setSubFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch base data when view changes
  useEffect(() => {
    setSubFilter("all"); // Reset subfilter
    
    const fetchVisitors = async () => {
      setIsLoading(true);
      let dateTrunc: string = view;

      const { data: resultData, error } = await supabase.rpc("get_visitors_grouped", {
        trunc_unit: dateTrunc,
      });

      if (error) {
        console.error("Error fetching stats:", error);
        setIsLoading(false);
        return;
      }

      setData(resultData || []);
      setIsLoading(false);
    };

    fetchVisitors();
  }, [view]);

  // Derived filtered data
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const now = new Date();
    const currentYear = now.getFullYear();

    return data.filter((item) => {
      const itemDate = new Date(item.date);

      if (view === "day") {
        if (subFilter === "week") {
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          return itemDate >= weekAgo;
        }
        if (subFilter === "month") {
          const monthAgo = new Date();
          monthAgo.setMonth(now.getMonth() - 1);
          return itemDate >= monthAgo;
        }
        if (subFilter === "ytd") {
          return itemDate.getFullYear() === currentYear;
        }
        if (subFilter === "years") {
          const yearAgo = new Date();
          yearAgo.setFullYear(now.getFullYear() - 1);
          return itemDate >= yearAgo;
        }
      } else if (view === "month") {
        if (subFilter === "3 month") {
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          return itemDate >= threeMonthsAgo;
        }
        if (subFilter === "last6") {
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(now.getMonth() - 6);
          return itemDate >= sixMonthsAgo;
        }
        if (subFilter === "ytd") {
          return itemDate.getFullYear() === currentYear;
        }
        if (subFilter === "years") {
          const yearAgo = new Date();
          yearAgo.setFullYear(now.getFullYear() - 1);
          return itemDate >= yearAgo;
        }
      } else if (view === "year") {
        if (subFilter !== "all") {
          return itemDate.getFullYear().toString() === subFilter;
        }
      }

      return true; // "all"
    });
  }, [data, view, subFilter]);

  // Sub-filter options logic
  const getSubFilters = () => {
    if (view === "day") return ["all", "years", "ytd", "month", "week"];
    if (view === "month") return ["all", "years", "ytd", "last6", "3 month"];
    if (view === "year") {
      const yearsSet = new Set(data.map((d) => new Date(d.date).getFullYear().toString()));
      const years = Array.from(yearsSet).sort((a, b) => b.localeCompare(a));
      return ["all", ...years];
    }
    return ["all"];
  };

  // Stats calculation
  const totalVisitorsFiltered = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.count, 0);
  }, [filteredData]);

  const latestVisitorCount = data.length > 0 ? data[data.length - 1]?.count || 0 : 0;

  return (
    <div>
      {/* Section Title */}
      <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
        Visitor Statistics
      </h3>

      <GlassCard accentColor="cyan">
        {/* View Toggle */}
        <div className="flex justify-center gap-2 mb-4">
          {[
            { key: "day", label: "Daily" },
            { key: "month", label: "Monthly" },
            { key: "year", label: "Yearly" },
          ].map((v) => (
            <button
              key={v.key}
              onClick={() => setView(v.key as "day" | "month" | "year")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                view === v.key
                  ? "bg-primary/20 text-primary border border-primary/50"
                  : "text-muted-foreground hover:text-primary hover:bg-accent"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Sub-Filters */}
        {!isLoading && (
          <div className="flex justify-center gap-2 flex-wrap mb-6">
            {getSubFilters().map((opt) => (
              <button
                key={opt}
                onClick={() => setSubFilter(opt)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-all duration-300 ${
                  subFilter === opt
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
              >
                {subFilterLabels[opt] || opt}
              </button>
            ))}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-primary/20 to-accent-gradient-to/10 border border-primary/20 rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <span className="text-muted-foreground text-sm">
                Total Visitors
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {isLoading ? "..." : totalVisitorsFiltered.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-accent-gradient-from/20 to-accent-gradient-to/10 border border-primary/20 rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-muted-foreground text-sm">
                {view === "day"
                  ? "Today"
                  : view === "month"
                    ? "This Month"
                    : "This Year"}
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {isLoading ? "..." : latestVisitorCount.toLocaleString()}
            </p>
          </motion.div>
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card/60 border border-border rounded-2xl p-4 backdrop-blur-sm"
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-muted-foreground">Loading data...</p>
              </div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <div className="p-4 bg-secondary rounded-full mb-4">
                <svg
                  className="w-12 h-12 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="text-muted-foreground text-lg">
                No visitor data for this filter
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={filteredData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorVisitors"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#d4a017" stopOpacity={0.6} />
                    <stop offset="50%" stopColor="#b8860b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#c8a45a" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient
                    id="strokeGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#d4a017" />
                    <stop offset="50%" stopColor="#c8a45a" />
                    <stop offset="100%" stopColor="#b8860b" />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  tick={{ fill: "currentColor", fontSize: 12 }}
                  axisLine={{ stroke: "#9ca3af" }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  tick={{ fill: "currentColor", fontSize: 12 }}
                  axisLine={{ stroke: "#9ca3af" }}
                  tickLine={false}
                  allowDecimals={false}
                  tickFormatter={(value: number) =>
                    Math.round(value).toString()
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="url(#strokeGradient)"
                  strokeWidth={3}
                  fill="url(#colorVisitors)"
                  dot={{
                    fill: "#d4a017",
                    strokeWidth: 2,
                    r: 4,
                    stroke: "#b8860b",
                  }}
                  activeDot={{
                    r: 6,
                    stroke: "#c8a45a",
                    strokeWidth: 2,
                    fill: "#fff",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </GlassCard>
    </div>
  );
}
