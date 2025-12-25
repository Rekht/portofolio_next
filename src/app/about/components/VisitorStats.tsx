"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";

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
      <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-600/50 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-cyan-400 font-medium text-sm">{label}</p>
        <p className="text-white font-bold text-lg">
          {payload[0].value}{" "}
          <span className="text-slate-400 text-sm font-normal">visitors</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function VisitorStats() {
  const [data, setData] = useState<VisitorData[]>([]);
  const [view, setView] = useState<"day" | "month" | "year">("day");
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVisitors = async () => {
      setIsLoading(true);
      let dateTrunc: string;
      if (view === "year") dateTrunc = "year";
      else if (view === "month") dateTrunc = "month";
      else dateTrunc = "day";

      const { data, error } = await supabase.rpc("get_visitors_grouped", {
        trunc_unit: dateTrunc,
      });

      if (error) {
        console.error("Error fetching stats:", error);
        setIsLoading(false);
        return;
      }

      setData(data || []);

      // Calculate total visitors
      const total = (data || []).reduce(
        (sum: number, item: VisitorData) => sum + item.count,
        0
      );
      setTotalVisitors(total);
      setIsLoading(false);
    };

    fetchVisitors();
  }, [view]);

  const todayVisitors = data.length > 0 ? data[data.length - 1]?.count || 0 : 0;

  return (
    <div>
      {/* Section Title - Outside container, centered */}
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        Visitor Statistics
      </h3>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl"
      >
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/10" />

        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-3xl" />

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 p-8">
          {/* View Toggle - Inside container, above cards */}
          <div className="flex justify-center gap-2 mb-6">
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
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                    : "text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/20 rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <svg
                    className="w-5 h-5 text-cyan-400"
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
                <span className="text-slate-400 text-sm">Total Visitors</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {isLoading ? "..." : totalVisitors.toLocaleString()}
              </p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/20 rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <svg
                    className="w-5 h-5 text-purple-400"
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
                <span className="text-slate-400 text-sm">
                  {view === "day"
                    ? "Today"
                    : view === "month"
                    ? "This Month"
                    : "This Year"}
                </span>
              </div>
              <p className="text-3xl font-bold text-white">
                {isLoading ? "..." : todayVisitors.toLocaleString()}
              </p>
            </motion.div>
          </div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-slate-900/60 via-blue-950/40 to-slate-900/60 border border-slate-700/30 rounded-2xl p-4 backdrop-blur-sm"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                  <p className="text-slate-400">Loading data...</p>
                </div>
              </div>
            ) : data.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <div className="p-4 bg-slate-700/30 rounded-full mb-4">
                  <svg
                    className="w-12 h-12 text-slate-500"
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
                <p className="text-slate-400 text-lg">No visitor data yet</p>
                <p className="text-slate-500 text-sm mt-1">
                  Data will appear after visits
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={data}
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
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
                      <stop
                        offset="50%"
                        stopColor="#6366f1"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="#0ea5e9"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="strokeGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    tick={{ fill: "#ffffff", fontSize: 12 }}
                    axisLine={{ stroke: "#64748b" }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: "#ffffff", fontSize: 12 }}
                    axisLine={{ stroke: "#64748b" }}
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
                      fill: "#a855f7",
                      strokeWidth: 2,
                      r: 4,
                      stroke: "#7c3aed",
                    }}
                    activeDot={{
                      r: 6,
                      stroke: "#38bdf8",
                      strokeWidth: 2,
                      fill: "#fff",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
