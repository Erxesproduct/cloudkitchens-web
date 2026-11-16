"use client";

import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { useNow } from "@/hooks/use-now";
import { buildings, days, onDay, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { dayState, focusDay, leftLabel } from "@/lib/status";
import { shortDate } from "@/lib/time";
import { AddButton } from "./add-button";
import { ClockIcon, TruckIcon } from "./icons";

/** The dish to order now: today's while it is open, else the next open day. Server HTML shows Monday faded until the clock is known. */
export function TodayHero() {
  const now = useNow();
  const day = now ? focusDay(now) : days[0];
  const known = !!now;

  if (!day)
    return (
      <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm ring-1 ring-line">
        <p className="display text-2xl font-bold">Энэ 7 хоногийн цэс дууслаа</p>
        <p className="mt-2 text-ink-2">Дараагийн 7 хоногийн цэсийг удахгүй нийтэлнэ. Асуух зүйл байвал {business.phone.display}.</p>
      </div>
    );

  const [main, set] = onDay(day.id) as [Product, Product | undefined];
  const state = now ? dayState(day, now) : null;
  const heading = state?.kind === "today" ? "Өнөөдрийн хоол" : `${day.mn} гарагийн хоол`;

  return (
    <div className={`grid items-center gap-8 transition-opacity duration-300 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12 ${known ? "" : "opacity-0"}`} aria-busy={!known}>
      <div className="relative mx-auto w-[78%] max-w-[420px] md:order-2 md:w-full">
        <div className="relative aspect-square">
          <span className="steam absolute -top-6 left-[38%] h-14 w-3 rounded-full bg-white/80 blur-[3px]" aria-hidden />
          <span className="steam absolute -top-8 left-[50%] h-16 w-3 rounded-full bg-white/80 blur-[3px] [animation-delay:1.1s]" aria-hidden />
          <span className="steam absolute -top-5 left-[62%] h-12 w-3 rounded-full bg-white/80 blur-[3px] [animation-delay:2.1s]" aria-hidden />
          <Link href={`/menu/${main.slug}`} className="plate relative block h-full w-full overflow-hidden" aria-label={main.name.mn}>
            {/* the set photo shows the dish with its soup bowl */}
            <Image src={(set ?? main).image.src} alt={set?.soup ? `${main.name.mn} + ${set.soup.mn}` : main.name.mn} fill priority sizes="(min-width: 768px) 420px, 78vw" className="object-cover" />
          </Link>
          {set?.soup && (
            <span className="display absolute -right-1 bottom-[8%] rotate-[6deg] rounded-2xl bg-white px-3 py-2 text-[13px] leading-tight font-bold text-ink shadow-md sm:-right-4">
              + {set.soup.mn}
            </span>
          )}
          <span className="display tnum absolute top-[6%] -left-3 rotate-[-8deg] rounded-2xl bg-yolk px-3.5 py-2 text-center leading-none font-bold text-ink shadow-md sm:-left-6">
            <span className="block text-[12px]">{day.mn}</span>
            <span className="block text-[22px]">{shortDate(day.date)}</span>
          </span>
        </div>
      </div>

      <div className="md:order-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="label text-cobalt">{heading}</p>
          {state?.kind === "today" && (
            <span className="tnum inline-flex items-center gap-1.5 rounded-full bg-tomato/10 px-2.5 py-1 text-[12.5px] font-extrabold text-tomato">
              <ClockIcon size={14} /> {business.cutoff} хүртэл {leftLabel(state.left)}
            </span>
          )}
        </div>
        <h1 className="display mt-3 text-[34px] leading-[1.08] font-bold sm:text-[46px]">{main.name.mn}</h1>
        {main.name.en && <p className="mt-1.5 text-[16px] font-semibold text-mute">{main.name.en}</p>}
        {main.sides.mn && <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ink-2">{main.sides.mn}</p>}

        <div className="mt-6 space-y-3">
          {[main, set].filter(Boolean).map((p) => (
            <div key={p!.slug} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-3.5 pl-5 shadow-sm ring-1 ring-line">
              <div className="min-w-0">
                <p className="font-extrabold">{p!.kind === "set" && p!.soup ? `+ ${p!.soup.mn}` : "Дангаар"}</p>
                <p className="display tnum text-[20px] font-bold text-cobalt">{formatPrice(p!.price)}</p>
              </div>
              <AddButton slug={p!.slug} date={p!.date} stock={p!.stock} label={p!.kind === "set" ? "Сет захиалах" : "Захиалах"} />
            </div>
          ))}
        </div>

        <p className="mt-5 flex items-start gap-2 text-[14px] leading-relaxed text-ink-2">
          <TruckIcon size={18} className="mt-0.5 shrink-0 text-cobalt" />
          <span>
            {state?.kind === "today" ? (
              <>
                Одоо захиалбал <b className="tnum text-ink">{state.window}</b>-д хүргэнэ.
              </>
            ) : (
              <>
                {day.mn} гарагт <b className="tnum text-ink">{business.windows[0].label}</b>-д хүргэнэ.
              </>
            )}{" "}
            Downtown-ын {buildings.length} барилга руу.
          </span>
        </p>
      </div>
    </div>
  );
}
