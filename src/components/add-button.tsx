"use client";

import Link from "next/link";
import { useState } from "react";
import { business } from "@/content/business";
import { useNow } from "@/hooks/use-now";
import { cart, maxQty, useCart } from "@/lib/cart";
import { orderable } from "@/lib/time";
import { CheckIcon, PlusIcon } from "./icons";

/** Add one dish to the cart. Disabled when sold out, or when its day has closed (12:00 Ulaanbaatar time). */
export function AddButton({ slug, date, stock, label = "Захиалах", size = "md" }: { slug: string; date: string; stock: number | null; label?: string; size?: "sm" | "md" | "lg" }) {
  const now = useNow();
  const items = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.find((i) => i.slug === slug)?.qty ?? 0;
  const closed = now ? !orderable(date, business.cutoff, now) : false;
  const out = stock === 0;
  const full = inCart > 0 && inCart >= maxQty(slug);
  const h = size === "lg" ? "h-13 px-7 text-[16px]" : size === "sm" ? "h-10 px-4 text-[14px]" : "h-11 px-5 text-[15px]";

  if (out || closed)
    return (
      <span className={`inline-flex ${h} items-center justify-center rounded-full bg-sky-2 font-bold text-mute`} aria-disabled>
        {out ? "Дууссан" : "Хаагдсан"}
      </span>
    );

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={full}
        onClick={() => {
          cart.add(slug);
          setAdded(true);
          setTimeout(() => setAdded(false), 1600);
        }}
        aria-label={inCart ? `${label} (сагсанд ${inCart})` : label}
        className={`relative inline-flex ${h} items-center justify-center gap-2 rounded-full font-bold text-white shadow-sm transition active:scale-[0.97] disabled:opacity-45 ${added ? "bg-leaf" : "bg-tomato hover:bg-tomato-deep"}`}
      >
        {added ? <CheckIcon size={18} /> : <PlusIcon size={18} />}
        {added ? "Нэмлээ" : label}
        {/* compact cards: the count rides on the button instead of a link beside it */}
        {size === "sm" && inCart > 0 && <span className="tnum absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-yolk px-1 text-[11px] font-extrabold text-ink ring-2 ring-white">{inCart}</span>}
      </button>
      {size !== "sm" && inCart > 0 && (
        <Link href="/cart" className="tnum text-[13px] font-bold text-cobalt underline-offset-2 hover:underline">
          Сагсанд {inCart}
        </Link>
      )}
    </span>
  );
}
