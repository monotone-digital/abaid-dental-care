"use client";

import { useEffect, useState } from "react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Server-renders the approved fallback line, then swaps in today's hours after hydration.
 * Today is always Asia/Karachi, never the visitor's device clock.
 */
export default function TodaysHours({
  week,
  todayLabel,
  fallback,
  timezone,
  className = "",
}: {
  week: Record<string, string>;
  todayLabel: string;
  fallback: string;
  timezone: string;
  className?: string;
}) {
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    try {
      const weekday = new Intl.DateTimeFormat("en-US", { timeZone: timezone, weekday: "short" }).format(
        new Date(),
      );
      const index = WEEKDAYS.indexOf(weekday);
      if (index >= 0 && week[String(index)]) setToday(week[String(index)]);
    } catch {
      // Keep the fallback if the runtime has no time-zone data.
    }
  }, [week, timezone]);

  if (!today) return <span className={className}>{fallback}</span>;

  return (
    <span className={className}>
      <span className="font-semibold">{todayLabel}</span> {today}
    </span>
  );
}
