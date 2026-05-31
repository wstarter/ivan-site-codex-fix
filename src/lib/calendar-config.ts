/**
 * Centralized availability calendar configuration.
 *
 * SINGLE SOURCE OF TRUTH for the informational calendar shown on:
 *  - /dostupni-termini
 *  - homepage availability preview
 *  - right-side panel on /upit/svadba
 *
 * The calendar is INFORMATIONAL ONLY. It does not:
 *  - submit inquiries
 *  - reserve dates
 *  - connect to forms or payments
 *
 * Days are AVAILABLE BY DEFAULT. Only unavailable dates need to be listed.
 *
 * ──────────────────────────────────────────────────────────────────────
 * FUTURE WORDPRESS MAPPING (do NOT implement PHP here)
 * ──────────────────────────────────────────────────────────────────────
 * Option A — Theme settings / ACF Options page:
 *   - field: `ivan_calendar_unavailable_dates` (ACF repeater: date + label + note)
 *   - PHP enqueues `window.IvanTheme.availability.unavailableDates = [...]`
 *
 * Option B — Custom Post Type `ivan_unavailable_date`:
 *   - fields: date (ACF date_picker), status, label, note
 *   - REST: /wp-json/ivan/v1/availability  →  same shape as below
 *
 * Option C — Custom admin page in wp_options:
 *   - key: ivan_unavailable_dates_json
 *   - inlined to window.IvanTheme.availability
 *
 * In all cases the runtime contract is:
 *   window.IvanTheme?.availability?.unavailableDates: UnavailableDate[]
 * which, when present, REPLACES `availabilityCalendarConfig.unavailableDates`.
 *
 * Shortcode (future): [ij_availability_calendar]
 * ──────────────────────────────────────────────────────────────────────
 */

export type AvailabilityStatus = "available" | "unavailable" | "today";

export interface UnavailableDate {
  /** ISO date `YYYY-MM-DD` */
  date: string;
  status: "unavailable";
  /** Public label shown in UI / tooltip */
  label: string;
  /** Internal note, not displayed unless intentionally exposed */
  note?: string;
  /** Origin marker — e.g. "manual" | "acf" | "cpt" | "rest" */
  source?: "manual" | "acf" | "cpt" | "rest";
}

export interface AvailabilityCalendarConfig {
  /** First visible month on initial mount, `YYYY-MM`. If past, falls back to current month. */
  initialMonth: string;
  /** Earliest month user can navigate to, `YYYY-MM`. */
  minMonth: string;
  /** Latest month user can navigate to, `YYYY-MM`. */
  maxMonth: string;
  locale: string;
  /** 0 = Sunday, 1 = Monday */
  weekStartsOn: 0 | 1;
  statuses: Record<AvailabilityStatus, string>;
  unavailableDates: UnavailableDate[];
}

export const availabilityCalendarConfig: AvailabilityCalendarConfig = {
  initialMonth: "2026-05",
  minMonth: "2025-01",
  maxMonth: "2028-12",
  locale: "sr-RS",
  weekStartsOn: 1,
  statuses: {
    available: "Slobodno",
    unavailable: "Zauzeto",
    today: "Danas",
  },
  unavailableDates: [
    { date: "2026-05-03", status: "unavailable", label: "Zauzeto", source: "manual" },
    { date: "2026-05-10", status: "unavailable", label: "Zauzeto", source: "manual" },
    { date: "2026-05-17", status: "unavailable", label: "Zauzeto", source: "manual" },
    { date: "2026-05-24", status: "unavailable", label: "Zauzeto", source: "manual" },
    { date: "2026-05-31", status: "unavailable", label: "Zauzeto", source: "manual" },
    { date: "2026-06-06", status: "unavailable", label: "Zauzeto", source: "manual" },
    { date: "2026-06-07", status: "unavailable", label: "Zauzeto", source: "manual" },
    { date: "2026-06-13", status: "unavailable", label: "Zauzeto", source: "manual" },
    { date: "2026-06-14", status: "unavailable", label: "Zauzeto", source: "manual" },
    { date: "2026-06-20", status: "unavailable", label: "Zauzeto", source: "manual" },
    { date: "2026-06-21", status: "unavailable", label: "Zauzeto", source: "manual" },
    { date: "2026-06-27", status: "unavailable", label: "Zauzeto", source: "manual" },
    { date: "2026-06-28", status: "unavailable", label: "Zauzeto", source: "manual" },
    { date: "2026-07-04", status: "unavailable", label: "Zauzeto", source: "manual" },
    { date: "2026-07-05", status: "unavailable", label: "Zauzeto", source: "manual" },
    { date: "2026-07-11", status: "unavailable", label: "Zauzeto", source: "manual" },
    { date: "2026-07-12", status: "unavailable", label: "Zauzeto", source: "manual" },
  ],
};

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_MONTH_RE = /^\d{4}-\d{2}$/;

/** Safely parse `YYYY-MM-DD`. Returns null on invalid. */
export function parseIsoDate(iso: string): { y: number; m: number; d: number } | null {
  if (!ISO_DATE_RE.test(iso)) return null;
  const [ys, ms, ds] = iso.split("-");
  const y = Number(ys), m = Number(ms) - 1, d = Number(ds);
  const probe = new Date(y, m, d);
  if (probe.getFullYear() !== y || probe.getMonth() !== m || probe.getDate() !== d) return null;
  return { y, m, d };
}

export function parseIsoMonth(iso: string): { y: number; m: number } | null {
  if (!ISO_MONTH_RE.test(iso)) return null;
  const [ys, ms] = iso.split("-");
  return { y: Number(ys), m: Number(ms) - 1 };
}

/** Effective list of unavailable dates — WP override wins, invalid entries dropped.
 * (Window.IvanTheme typing lives in `src/lib/wp-bridge.ts`.) */
export function getUnavailableDates(): UnavailableDate[] {
  const wp =
    typeof window !== "undefined" ? window.IvanTheme?.availability?.unavailableDates : undefined;
  const source: ReadonlyArray<{ date: string; status?: string; label?: string }> =
    Array.isArray(wp) && wp.length > 0 ? wp : availabilityCalendarConfig.unavailableDates;
  return source
    .filter((u) => u && typeof u.date === "string" && parseIsoDate(u.date) !== null)
    .map((u) => ({ date: u.date, status: "unavailable" as const, label: u.label ?? "Zauzeto" }));
}

/** Build a Set<"YYYY-MM-DD"> for O(1) lookup. */
export function buildUnavailableSet(): Set<string> {
  return new Set(getUnavailableDates().map((u) => u.date));
}

export function isoOf(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Compare two months as `YYYY-MM`. -1 / 0 / 1 */
export function compareMonth(a: { y: number; m: number }, b: { y: number; m: number }): number {
  if (a.y !== b.y) return a.y < b.y ? -1 : 1;
  if (a.m !== b.m) return a.m < b.m ? -1 : 1;
  return 0;
}
