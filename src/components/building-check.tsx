"use client";

import { useState } from "react";
import { business } from "@/content/business";
import { buildings } from "@/lib/catalog";
import { BuildingIcon, CheckIcon, SearchIcon } from "./icons";

const fold = (s: string) => s.toLowerCase().replace(/[^a-zа-яёөү0-9]+/gi, "");

/** «Танай барилга жагсаалтад байна уу?»: type a building name, the list narrows. */
export function BuildingCheck() {
  const [q, setQ] = useState("");
  const f = fold(q);
  const hits = f ? buildings.filter((b) => fold(b).includes(f)) : buildings;
  return (
    <div>
      <label className="flex h-13 max-w-md items-center gap-2.5 rounded-full bg-white px-5 shadow-sm ring-1 ring-line focus-within:ring-2 focus-within:ring-cobalt">
        <SearchIcon size={19} className="shrink-0 text-mute" />
        <span className="sr-only">Барилга хайх</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Барилгынхаа нэрийг бичээрэй (ICC, Central…)" className="min-w-0 flex-1 bg-transparent text-[15.5px] outline-none placeholder:text-mute" />
      </label>
      <p className="mt-3 min-h-6 text-[14.5px] font-bold" role="status">
        {q.trim() ? (
          hits.length ? (
            <span className="inline-flex items-center gap-1.5 text-leaf">
              <CheckIcon size={17} /> Хүргэнэ: {hits.length === 1 ? hits[0] : `${hits.length} барилга таарлаа`}
            </span>
          ) : (
            <span className="text-tomato">Жагсаалтад алга. Хүргэх боломжийг {business.phone.display} дугаараас лавлаарай.</span>
          )
        ) : (
          <span className="text-mute">{buildings.length} барилга, гал тогооноос 2–5 минутын зайд</span>
        )}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {buildings.map((b) => {
          const on = !f || hits.includes(b);
          return (
            <li key={b} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13.5px] font-bold transition ${on ? (f ? "bg-cobalt text-white" : "bg-white text-ink-2 ring-1 ring-line") : "bg-transparent text-mute/50 ring-1 ring-line/60"}`}>
              <BuildingIcon size={14} className="shrink-0" />
              {b}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
