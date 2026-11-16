/**
 * Ulaanbaatar time (UTC+8, no daylight saving) for the order cut-off. Works the same in the browser and on the
 * server, whatever their own time zone is.
 */
const UB_OFFSET = 8 * 60;

/** Wall-clock parts in Ulaanbaatar. */
export function ubNow(now = new Date()) {
  const t = new Date(now.getTime() + UB_OFFSET * 60_000);
  const date = t.toISOString().slice(0, 10);
  const minutes = t.getUTCHours() * 60 + t.getUTCMinutes();
  return { date, minutes, weekday: t.getUTCDay() };
}

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/**
 * Can a dish for `date` still be ordered? Same day before the cut-off, or any later day of the published week
 * (pre-order). Past days are closed.
 */
export function orderable(date: string, cutoff: string, now = new Date()) {
  const n = ubNow(now);
  if (date > n.date) return true;
  return date === n.date && n.minutes < toMinutes(cutoff);
}

/** Delivery window for a dish on `date`: by the time of ordering on that day; pre-orders get the first window. */
export function windowFor(date: string, windows: readonly { before: string; label: string }[], now = new Date()) {
  const n = ubNow(now);
  if (date > n.date) return windows[0].label;
  return windows.find((w) => n.minutes < toMinutes(w.before))?.label ?? null;
}

/** Minutes left until the cut-off today (null when closed or not a menu day). */
export function minutesLeft(date: string, cutoff: string, now = new Date()) {
  const n = ubNow(now);
  return date === n.date ? Math.max(0, toMinutes(cutoff) - n.minutes) : null;
}

const MONTHS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
/** "2026-11-16" → "11/16" */
export const shortDate = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]}/${Number(iso.slice(8, 10))}`;
