import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Dot } from "lucide-react";

const weekdayLabels = ["M", "T", "W", "T", "F", "S", "S"];

// marks is an array of ISO date strings (yyyy-mm-dd) to highlight like meetings
export default function Calendar({ initialDate = new Date(), marks = [], value = null, onSelect }) {
  const safeInitial = value || initialDate || new Date();
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
    <section className="w-full max-w-[420px] rounded-[24px] border border-primary/20 bg-gradient-to-br from-[#04161c] via-[#031116] to-[#05080c] px-5 pb-5 pt-6 text-slate-100 shadow-[0_25px_50px_rgba(0,0,0,0.45)]">
      {/* Header */}
      <header className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => handleMonthShift(-1)}
          className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-slate-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-semibold tracking-wide uppercase text-slate-100">
          {activeDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <button
          type="button"
          onClick={() => handleMonthShift(1)}
          className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-slate-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </header>

      {/* Weekday labels */}
      <div className="mb-2 grid grid-cols-7 text-center text-xs font-medium uppercase tracking-wide text-white/50">
        {weekdayLabels.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-2 text-sm text-white">
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
                "relative mx-auto grid h-10 w-10 place-items-center rounded-lg border border-white/5 transition",
                isSelected
                  ? "bg-primary text-white shadow shadow-primary/40"
                  : "bg-white/5 hover:bg-white/10 focus:bg-white/10",
                !isCurrentMonth && "text-white/40",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {day.getDate()}
              {hasMark && !isSelected && (
                <Dot className="absolute bottom-1 h-3 w-3 text-primary" />
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
