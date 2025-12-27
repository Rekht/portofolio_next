"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionWeek {
  days: ContributionDay[];
}

const GITHUB_USERNAME = "rekht";

export default function GitHubContributions() {
  const [contributions, setContributions] = useState<ContributionWeek[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalContributions, setTotalContributions] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContributions();
  }, []);

  const fetchContributions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Using GitHub Contributions API by jogruber
      const response = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch contributions");
      }

      const data = await response.json();

      // Transform the data into our format
      const weeks: ContributionWeek[] = [];
      let total = 0;

      // Group contributions by week
      const contributionsArray = data.contributions || [];
      let currentWeek: ContributionDay[] = [];

      contributionsArray.forEach(
        (
          day: { date: string; count: number; level: number },
          index: number
        ) => {
          const date = new Date(day.date);
          const dayOfWeek = date.getDay();

          // Start a new week on Sunday (day 0)
          if (dayOfWeek === 0 && currentWeek.length > 0) {
            weeks.push({ days: currentWeek });
            currentWeek = [];
          }

          currentWeek.push({
            date: day.date,
            count: day.count,
            level: day.level,
          });

          total += day.count;

          // Push the last week
          if (
            index === contributionsArray.length - 1 &&
            currentWeek.length > 0
          ) {
            weeks.push({ days: currentWeek });
          }
        }
      );

      setContributions(weeks);
      setTotalContributions(total);
    } catch (err) {
      console.error("Error fetching GitHub contributions:", err);
      setError("Gagal memuat data kontribusi");
      // Fallback to empty state
      setContributions([]);
    }

    setIsLoading(false);
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const days = ["Mon", "Wed", "Fri"];

  const getMonthLabels = () => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    contributions.forEach((week, weekIndex) => {
      if (week.days.length > 0) {
        const date = new Date(week.days[0].date);
        const month = date.getMonth();
        if (month !== lastMonth) {
          labels.push({ month: months[month], weekIndex });
          lastMonth = month;
        }
      }
    });

    return labels;
  };

  const getLevelColor = (level: number) => {
    const colors = [
      "bg-slate-800/60", // 0 - no contributions
      "bg-purple-900/80", // 1 - low
      "bg-purple-700/80", // 2 - medium-low
      "bg-purple-500/90", // 3 - medium-high
      "bg-fuchsia-500", // 4 - high
    ];
    return colors[level] || colors[0];
  };

  return (
    <div className="w-full">
      {/* Title outside container */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Github Contributions
        </h2>
        <p className="text-slate-400 text-sm">
          Here&apos;s a snapshot of my coding activity over the past year on
          GitHub.
        </p>
      </div>

      <GlassCard accentColor="fuchsia">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-slate-400">{error}</p>
            <button
              onClick={fetchContributions}
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Total contributions */}
            <p className="text-slate-400 text-sm mb-4">
              {totalContributions.toLocaleString()} contributions in the last
              year
            </p>

            {/* Month Labels */}
            <div className="flex justify-center mb-2">
              {getMonthLabels().map(({ month, weekIndex }, idx) => {
                const prevWeekIndex =
                  idx > 0 ? getMonthLabels()[idx - 1].weekIndex : 0;
                const gap = weekIndex - prevWeekIndex;
                return (
                  <div
                    key={`${month}-${weekIndex}`}
                    className="text-slate-400 text-xs"
                    style={{
                      marginLeft: idx === 0 ? 0 : `${gap * 15 - 30}px`,
                      minWidth: "30px",
                    }}
                  >
                    {month}
                  </div>
                );
              })}
            </div>

            {/* Contribution Grid - centered */}
            <div className="flex justify-center">
              {/* Day Labels */}
              <div className="flex flex-col justify-around mr-2 py-1">
                {days.map((day) => (
                  <span
                    key={day}
                    className="text-slate-400 text-xs h-[14px] leading-[14px]"
                  >
                    {day}
                  </span>
                ))}
              </div>

              {/* Grid */}
              <div className="flex gap-[3px]">
                {contributions.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[3px]">
                    {week.days.map((day) => (
                      <motion.div
                        key={day.date}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: weekIndex * 0.01,
                        }}
                        className={`w-[12px] h-[12px] rounded-sm ${getLevelColor(
                          day.level
                        )} hover:ring-2 hover:ring-white/30 transition-all cursor-pointer`}
                        title={`${day.date}: ${day.count} contributions`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4">
              <span className="text-slate-400 text-xs">Less</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`w-[12px] h-[12px] rounded-sm ${getLevelColor(
                    level
                  )}`}
                />
              ))}
              <span className="text-slate-400 text-xs">More</span>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
