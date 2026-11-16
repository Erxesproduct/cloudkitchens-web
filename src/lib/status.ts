import { business } from "@/content/business";
import { days, type Day } from "@/lib/catalog";
import { minutesLeft, orderable, ubNow, windowFor } from "@/lib/time";

export type DayState = { kind: "today"; left: number; window: string } | { kind: "preorder" } | { kind: "closed" };

/** Where a menu day stands right now (Ulaanbaatar time). */
export function dayState(day: Pick<Day, "date">, now: Date): DayState {
  if (!orderable(day.date, business.cutoff, now)) return { kind: "closed" };
  const left = minutesLeft(day.date, business.cutoff, now);
  return left != null ? { kind: "today", left, window: windowFor(day.date, business.windows, now)! } : { kind: "preorder" };
}

/** Today's menu day if it is still open, otherwise the next open one, otherwise null (week is over). */
export function focusDay(now: Date) {
  const today = ubNow(now).date;
  return days.find((d) => d.date >= today && orderable(d.date, business.cutoff, now)) ?? null;
}

/** 75 → "1 ц 15 мин" */
export const leftLabel = (min: number) => (min >= 60 ? `${Math.floor(min / 60)} ц ${min % 60} мин` : `${min} мин`);
