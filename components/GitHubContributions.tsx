"use client";

import { useEffect, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionWeek {
  days: ContributionDay[];
}

interface ContributionData {
  weeks: ContributionWeek[];
  totalContributions: number;
}

const LEVEL_COLORS: Record<number, string> = {
  0: "#161b22",
  1: "#0e4429",
  2: "#006d32",
  3: "#26a641",
  4: "#39d353",
};

const MONTH_LABELS = [
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

function getMonthPositions(weeks: ContributionWeek[]): { month: string; left: number }[] {
  const positions: { month: string; left: number }[] = [];
  let lastMonth = -1;
  const cellSize = 11;
  const gap = 3;

  weeks.forEach((week, i) => {
    const firstDay = week.days[0];
    if (firstDay) {
      const month = new Date(firstDay.date + "T00:00:00").getMonth();
      if (month !== lastMonth) {
        positions.push({
          month: MONTH_LABELS[month],
          left: i * (cellSize + gap),
        });
        lastMonth = month;
      }
    }
  });

  return positions;
}

export default function GitHubContributions() {
  const { ref, isVisible } = useScrollAnimation();
  const [data, setData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    async function fetchContributions() {
      try {
        const res = await fetch(
          "/api/github-contributions?username=gabrielSabang",
        );
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error ?? "Failed to load contributions");
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchContributions();
  }, []);

  const monthPositions = data ? getMonthPositions(data.weeks) : [];
  const cellSize = 11;
  const gap = 3;
  const labelWidth = 36;
  const gridWidth = data ? data.weeks.length * (cellSize + gap) : 0;

  return (
    <section id="contributions" className="py-24 px-6">
      <div
        ref={ref}
        className={`max-w-5xl mx-auto transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
          GitHub Contributions
        </h2>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="h-32 w-full max-w-3xl rounded-lg bg-surface animate-pulse" />
          </div>
        )}

        {error && (
          <p className="text-center text-foreground/50 py-8">{error}</p>
        )}

        {data && (
          <div className="bg-surface border border-border rounded-xl p-6 md:p-8">
            <p className="text-foreground/70 mb-6 text-center">
              <span className="text-accent font-bold text-lg">
                {data.totalContributions}
              </span>{" "}
              contributions in{" "}
              {new Date().getFullYear()}
            </p>

            <div className="overflow-x-auto pb-2">
              <div
                className="relative"
                style={{
                  minWidth: labelWidth + gridWidth,
                  height: 120,
                }}
              >
                {/* Day labels */}
                <div
                  className="absolute top-0 left-0 flex flex-col justify-between"
                  style={{
                    width: labelWidth,
                    height: cellSize,
                    marginTop: 18,
                  }}
                >
                  <span className="text-[10px] text-foreground/40 leading-none">
                    Mon
                  </span>
                  <span className="text-[10px] text-foreground/40 leading-none">
                    Wed
                  </span>
                  <span className="text-[10px] text-foreground/40 leading-none">
                    Fri
                  </span>
                </div>

                {/* Month labels */}
                <div
                  className="absolute top-0"
                  style={{ left: labelWidth, height: 14 }}
                >
                  {monthPositions.map((m, i) => (
                    <span
                      key={`${m.month}-${i}`}
                      className="absolute text-[10px] text-foreground/40 leading-none"
                      style={{ left: m.left }}
                    >
                      {m.month}
                    </span>
                  ))}
                </div>

                {/* Heatmap grid */}
                <div
                  className="absolute"
                  style={{ left: labelWidth, top: 18 }}
                >
                  {data.weeks.map((week, wi) => (
                    <div
                      key={wi}
                      className="absolute flex flex-col gap-[3px]"
                      style={{
                        left: wi * (cellSize + gap),
                        top: 0,
                      }}
                    >
                      {week.days.map((day) => (
                        <div
                          key={day.date}
                          className="rounded-sm transition-colors duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent"
                          style={{
                            width: cellSize,
                            height: cellSize,
                            backgroundColor: LEVEL_COLORS[day.level],
                          }}
                          tabIndex={0}
                          role="gridcell"
                          aria-label={`${day.count} contributions on ${day.date}`}
                          onMouseEnter={(e) => {
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            setTooltip({
                              date: day.date,
                              count: day.count,
                              x: rect.left + rect.width / 2,
                              y: rect.top - 8,
                            });
                          }}
                          onMouseLeave={() => setTooltip(null)}
                          onFocus={(e) => {
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            setTooltip({
                              date: day.date,
                              count: day.count,
                              x: rect.left + rect.width / 2,
                              y: rect.top - 8,
                            });
                          }}
                          onBlur={() => setTooltip(null)}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4">
              <span className="text-[10px] text-foreground/40">Less</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className="rounded-sm"
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: LEVEL_COLORS[level],
                  }}
                />
              ))}
              <span className="text-[10px] text-foreground/40">More</span>
            </div>
          </div>
        )}

        {/* Tooltip */}
        {tooltip && (
          <div
            className="fixed z-50 px-3 py-1.5 bg-foreground text-background text-xs rounded-md shadow-lg pointer-events-none whitespace-nowrap"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
            }}
            role="tooltip"
          >
            <strong>
              {tooltip.count} contribution{tooltip.count !== 1 ? "s" : ""}
            </strong>{" "}
            on {tooltip.date}
          </div>
        )}
      </div>
    </section>
  );
}
