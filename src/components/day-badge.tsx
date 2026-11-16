"use client";

import { useNow } from "@/hooks/use-now";
import { dayState, leftLabel } from "@/lib/status";

/** «Өнөөдөр · 1 ц 20 мин үлдлээ» / «Урьдчилан захиална» / «Хаагдсан». Nothing until the clock is known. */
export function DayBadge({ date, light = false }: { date: string; light?: boolean }) {
  const now = useNow();
  if (!now) return <span className="inline-block h-6" aria-hidden />;
  const s = dayState({ date }, now);
  if (s.kind === "today")
    return (
      <span className="tnum inline-flex h-6 items-center gap-1.5 rounded-full bg-tomato px-2.5 text-[12px] font-extrabold text-white">
        <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-white" aria-hidden />
        Өнөөдөр · {leftLabel(s.left)}
      </span>
    );
  if (s.kind === "preorder") return <span className={`inline-flex h-6 items-center rounded-full px-2.5 text-[12px] font-extrabold ${light ? "bg-white/20 text-white" : "bg-sky-2 text-cobalt"}`}>Урьдчилан захиална</span>;
  return <span className={`inline-flex h-6 items-center rounded-full px-2.5 text-[12px] font-bold ${light ? "bg-white/15 text-white/70" : "bg-line text-mute"}`}>Хаагдсан</span>;
}
