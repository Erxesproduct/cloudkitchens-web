"use client";

import Link from "next/link";
import { cartCount, useCart } from "@/lib/cart";
import { BagIcon } from "./icons";

export function CartLink() {
  const n = cartCount(useCart());
  return (
    <Link href="/cart" className="relative flex h-11 items-center gap-2 rounded-full bg-cobalt px-4 font-bold text-white hover:bg-cobalt-deep" aria-label={n ? `Сагс, ${n} хоол` : "Сагс"}>
      <BagIcon size={19} />
      <span className="hidden text-[14px] sm:inline">Сагс</span>
      {n > 0 && <span className="tnum grid h-5 min-w-5 place-items-center rounded-full bg-yolk px-1 text-[11.5px] font-extrabold text-ink">{n}</span>}
    </Link>
  );
}
