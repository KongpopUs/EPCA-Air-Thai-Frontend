import React, { useMemo, useState } from "react";

// Simple Calendar component (TypeScript + React) for Next.js (.tsx)
// TailwindCSS classes are used for styling — adjust to your project's theme.

type CalendarProps = {
  initialDate?: Date;
  onSelectDate?: (date: Date) => void;
};

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

// function endOfMonth(date: Date) {
//   return new Date(date.getFullYear(), date.getMonth() + 1, 0);
// }

function addMonths(date: Date, n: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getMonthMatrix(year: number, month: number) {
  // returns 6 weeks x 7 days matrix of Date | null for display
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay(); // 0..6 (Sun..Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const matrix: (Date | null)[][] = [];
  let week: (Date | null)[] = [];

  // fill leading nulls
  for (let i = 0; i < startWeekday; i++) week.push(null);

  for (let d = 1; d <= daysInMonth; d++) {
    week.push(new Date(year, month, d));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }

  // fill trailing nulls and ensure 6 rows
  if (week.length) {
    while (week.length < 7) week.push(null);
    matrix.push(week);
  }
  while (matrix.length < 6) {
    const emptyWeek: (Date | null)[] = Array(7).fill(null);
    matrix.push(emptyWeek);
  }

  return matrix;
}

export default function Calendar({ initialDate, onSelectDate }: CalendarProps) {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState<Date>(initialDate ? new Date(initialDate) : startOfMonth(today));
  const [selected, setSelected] = useState<Date | null>(initialDate ? new Date(initialDate) : null);

  const monthMatrix = useMemo(() => getMonthMatrix(cursor.getFullYear(), cursor.getMonth()), [cursor]);

  function goPrev() {
    setCursor((s) => addMonths(s, -1));
  }
  function goNext() {
    setCursor((s) => addMonths(s, 1));
  }

  function handleSelect(day: Date | null) {
    if (!day) return;
    setSelected(day);
    onSelectDate?.(day);
  }

  return (
    <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={goPrev}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Previous month"
          >
            ‹
          </button>
          <div className="text-lg font-semibold">
            {cursor.toLocaleString([], { month: "long" })} {cursor.getFullYear()}
          </div>
          <button
            onClick={goNext}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Next month"
          >
            ›
          </button>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-300">Today: {today.toLocaleDateString()}</div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500 mb-2">
        {WEEK_DAYS.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {monthMatrix.map((week, wi) =>
          week.map((day, di) => {
            const isToday = day ? isSameDay(day, today) : false;
            const isSelected = day && selected ? isSameDay(day, selected) : false;
            const isCurrentMonth = day ? day.getMonth() === cursor.getMonth() : false;

            return (
              <button
                key={`${wi}-${di}`}
                onClick={() => handleSelect(day)}
                disabled={!day}
                className={`h-14 p-1 rounded-lg flex items-start justify-center flex-col transition ease-in-out duration-150 focus:outline-none
                  ${!day ? "opacity-0 pointer-events-none" : ""}
                  ${!isCurrentMonth ? "text-slate-400" : "text-slate-900 dark:text-slate-100"}
                `}
                aria-pressed={isSelected}
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-full">
                  {isSelected ? (
                    <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium">{day?.getDate()}</div>
                  ) : isToday ? (
                    <div className="w-9 h-9 rounded-full border border-indigo-400 flex items-center justify-center font-medium">{day?.getDate()}</div>
                  ) : (
                    <div className="w-9 h-9 flex items-center justify-center font-medium">{day?.getDate()}</div>
                  )}
                </div>
                {/* small placeholder for event dot if you want to show events later */}
              </button>
            );
          })
        )}
      </div>

      <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
        Selected: {selected ? selected.toLocaleDateString() : "—"}
      </div>
    </div>
  );
}

// export default Calendar;