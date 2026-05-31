import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  availabilityCalendarConfig,
  buildUnavailableSet,
  compareMonth,
  isoOf,
  parseIsoMonth,
} from "@/lib/calendar-config";

const MONTHS_SR = [
  "Januar","Februar","Mart","April","Maj","Jun",
  "Jul","Avgust","Septembar","Oktobar","Novembar","Decembar",
];
const DAYS_SR_MON = ["PON","UTO","SRE","ČET","PET","SUB","NED"];
const DAYS_SR_SUN = ["NED","PON","UTO","SRE","ČET","PET","SUB"];

/**
 * Informational availability calendar.
 * Read-only. No date selection / no form submission / no booking.
 * Reads data from `src/lib/calendar-config.ts` (WP override via
 * `window.IvanTheme.availability.unavailableDates`).
 *
 * Future WordPress mapping: shortcode [ij_availability_calendar].
 */
export function AvailabilityCalendar({ compact = false }: { compact?: boolean }) {
  const cfg = availabilityCalendarConfig;
  const today = new Date();
  const todayKey = isoOf(today.getFullYear(), today.getMonth(), today.getDate());

  const initial =
    parseIsoMonth(cfg.initialMonth) ?? { y: today.getFullYear(), m: today.getMonth() };
  const minM = parseIsoMonth(cfg.minMonth) ?? { y: today.getFullYear() - 1, m: 0 };
  const maxM = parseIsoMonth(cfg.maxMonth) ?? { y: today.getFullYear() + 3, m: 11 };

  const [year, setYear] = useState(initial.y);
  const [month, setMonth] = useState(initial.m);

  const unavailableSet = useMemo(() => buildUnavailableSet(), []);
  const weekStartsOn = cfg.weekStartsOn;
  const weekdayLabels = weekStartsOn === 1 ? DAYS_SR_MON : DAYS_SR_SUN;

  const firstDayJsIdx = new Date(year, month, 1).getDay(); // 0..6, Sun..Sat
  const shift = weekStartsOn === 1 ? (firstDayJsIdx + 6) % 7 : firstDayJsIdx;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();

  const cells: Array<{ day: number; current: boolean; iso: string | null }> = [];
  for (let i = shift; i > 0; i--) cells.push({ day: prevDays - i + 1, current: false, iso: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true, iso: isoOf(year, month, d) });
  while (cells.length % 7 !== 0) {
    cells.push({ day: cells.length - daysInMonth - shift + 1, current: false, iso: null });
  }

  const canPrev = compareMonth({ y: year, m: month }, minM) > 0;
  const canNext = compareMonth({ y: year, m: month }, maxM) < 0;

  function move(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    const cur = { y, m };
    if (compareMonth(cur, minM) < 0 || compareMonth(cur, maxM) > 0) return;
    setMonth(m); setYear(y);
  }

  const monthTitle = `${MONTHS_SR[month]} ${year}`;

  return (
    <div className="calendar-panel panel p-5 md:p-6" role="group" aria-label={`Kalendar dostupnosti — ${monthTitle}`}>
      <div className="calendar-header flex items-center justify-between mb-5">
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={!canPrev}
          aria-label="Prethodni mesec"
          className="calendar-nav-button btn-base btn-ghost gold-border disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ minHeight: 40, padding: "0 0.7rem" }}
        >
          <ChevronLeft size={16} />
        </button>
        <h3 className="text-card-title text-foreground" aria-live="polite">{monthTitle}</h3>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={!canNext}
          aria-label="Sledeći mesec"
          className="calendar-nav-button btn-base btn-ghost gold-border disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ minHeight: 40, padding: "0 0.7rem" }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="calendar-grid calendar-weekday-row grid grid-cols-7 gap-1.5 mb-2" aria-hidden="true">
        {weekdayLabels.map((d) => (
          <div key={d} className="calendar-weekday text-[10px] tracking-widest text-center text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      <div className="calendar-grid grid grid-cols-7 gap-1.5">
        {cells.map((c, i) => {
          const isUnavailable = c.current && c.iso !== null && unavailableSet.has(c.iso);
          const isToday = c.current && c.iso === todayKey;
          const isAvailable = c.current && !isUnavailable;

          let stateClass = "calendar-day-muted text-muted-foreground/40";
          let style: React.CSSProperties = {};
          let ariaLabel: string | undefined;

          if (isUnavailable) {
            stateClass = "calendar-day-unavailable";
            style = { background: "color-mix(in oklab, var(--color-unavailable) 90%, transparent)", color: "var(--color-foreground)" };
            ariaLabel = `${c.day}. ${MONTHS_SR[month]} ${year} — ${cfg.statuses.unavailable}`;
          } else if (isAvailable) {
            stateClass = "calendar-day-available";
            style = { background: "color-mix(in oklab, var(--color-available) 85%, transparent)", color: "var(--color-foreground)" };
            ariaLabel = `${c.day}. ${MONTHS_SR[month]} ${year} — ${cfg.statuses.available}`;
          }
          if (isToday) {
            stateClass += " calendar-day-today";
            if (!isUnavailable && !isAvailable) {
              style = { border: "1px solid color-mix(in oklab, var(--color-primary) 70%, transparent)" };
            }
            ariaLabel = `${c.day}. ${MONTHS_SR[month]} ${year} — ${cfg.statuses.today}`;
          }

          return (
            <div
              key={i}
              role="gridcell"
              aria-disabled
              aria-label={ariaLabel}
              title={ariaLabel}
              className={`calendar-day h-10 md:h-12 rounded-lg flex items-center justify-center text-sm font-medium ${stateClass}`}
              style={style}
            >
              {c.day}
            </div>
          );
        })}
      </div>

      <div className="calendar-legend flex flex-wrap gap-4 mt-5 text-xs text-muted-foreground">
        <div className="calendar-legend-item flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: "var(--color-available)" }} /> {cfg.statuses.available}
        </div>
        <div className="calendar-legend-item flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: "var(--color-unavailable)" }} /> {cfg.statuses.unavailable}
        </div>
        <div className="calendar-legend-item flex items-center gap-2">
          <span className="w-3 h-3 rounded-full border" style={{ borderColor: "color-mix(in oklab, var(--color-primary) 70%, transparent)" }} /> {cfg.statuses.today}
        </div>
      </div>

      {!compact && (
        <p className="mt-4 text-xs text-muted-foreground/80 italic">
          Kalendar je informativan. Termin se potvrđuje tek nakon dogovora i avansa.
        </p>
      )}
    </div>
  );
}
