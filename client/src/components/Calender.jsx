import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Dot } from "lucide-react";

const weekdayLabels = ["M", "T", "W", "T", "F", "S", "S"];

// marks is an array of ISO date strings (yyyy-mm-dd) to highlight like meetings
export default function Calendar({ initialDate = new Date(), marks = [], value = null, onSelect }) {
  const safeInitial = value || initialDate;
  const [activeDate, setActiveDate] = useState(safeInitial);
  const [selected, setSelected] = useState(value ?? null);

  const matrix = useMemo(() => buildCalendarMatrix(activeDate), [activeDate]);
  const marksSet = useMemo(() => new Set(marks), [marks]);

  useEffect(() => {
    if (value) {
      setSelected(value);
      setActiveDate(value);
    } else {
      setSelected(null);
    }
  }, [value]);

  useEffect(() => {
    if (!value && initialDate) {
      setActiveDate(initialDate);
    }
  }, [initialDate, value]);

  const handleMonthShift = (delta) => {
    setActiveDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const handleSelect = (day) => {
    setSelected(day);
    onSelect?.(day);
  };

  return (
    <section className="w-full max-w-xs rounded-2xl bg-slate-900/80 px-4 pb-4 pt-5 text-slate-100 shadow-lg ring-1 ring-white/5">
      {/* Header */}
      <header className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => handleMonthShift(-1)}
          className="grid h-8 w-8 place-items-center rounded-full bg-slate-800/80 text-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-semibold tracking-wide uppercase text-slate-200">
          {activeDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <button
          type="button"
          onClick={() => handleMonthShift(1)}
          className="grid h-8 w-8 place-items-center rounded-full bg-slate-800/80 text-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </header>

      {/* Weekday labels */}
      <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium uppercase tracking-wide text-slate-400">
        {weekdayLabels.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-2 text-sm text-slate-200">
        {matrix.map((day) => {
          const isCurrentMonth = day.getMonth() === activeDate.getMonth();
          const isSelected = selected ? sameDay(day, selected) : false;
          const iso = day.toISOString().slice(0, 10);
          const hasMark = marksSet.has(iso);

          return (
            <button
              key={iso + day.getMonth()}
              type="button"
              onClick={() => handleSelect(day)}
              className={[
                "relative mx-auto grid h-10 w-10 place-items-center rounded-lg transition",
                isSelected
                  ? "bg-indigo-500 text-white shadow shadow-indigo-500/40"
                  : "hover:bg-slate-800/70 focus:bg-slate-800/70",
                !isCurrentMonth && "text-slate-500",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {day.getDate()}
              {hasMark && !isSelected && (
                <Dot className="absolute bottom-1 h-3 w-3 text-indigo-400" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ---- helpers ---- */

// Build a 6x7 grid (42 cells) of Date objects with Monday as the first column.
function buildCalendarMatrix(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const startOfMonth = new Date(year, month, 1);
  // Convert Sunday (0) to 6 so Monday becomes index 0
  const offset = (startOfMonth.getDay() + 6) % 7;

  const days = [];
  for (let cell = 0; cell < 42; cell += 1) {
    const dayNumber = cell - offset + 1;
    days.push(new Date(year, month, dayNumber));
  }
  return days;
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
