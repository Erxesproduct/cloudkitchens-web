"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { business } from "@/content/business";
import { useNow } from "@/hooks/use-now";
import { cart, cartSubtotal, maxQty, useCart } from "@/lib/cart";
import { buildings, getDay, resolveLine } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import type { OrderErrors } from "@/lib/orders/schema";
import { orderable, shortDate, windowFor } from "@/lib/time";
import { BagIcon, CheckIcon, ClockIcon, MinusIcon, PhoneIcon, PlusIcon, TrashIcon } from "./icons";

type Done = { reference: string; total: number; building: string; lines: { name: string; date: string; qty: number; total: number; window: string }[] };

const field = "mt-1.5 w-full rounded-2xl border border-line bg-white px-4 py-3 text-[15px] outline-none focus:border-cobalt aria-invalid:border-tomato aria-invalid:bg-tomato/5";

export function Checkout() {
  const items = useCart();
  const now = useNow();
  const [receiptType, setReceiptType] = useState<"person" | "company">("person");
  const [errors, setErrors] = useState<OrderErrors>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);

  const lines = items
    .flatMap((i) => {
      const l = resolveLine(i.slug);
      return l ? [{ ...i, line: l, closed: now ? !orderable(l.product.date, business.cutoff, now) : false }] : [];
    })
    .sort((a, b) => a.line.product.date.localeCompare(b.line.product.date));
  const open = lines.filter((l) => !l.closed);
  const subtotal = cartSubtotal(open);
  const fee = business.delivery[0].fee;
  const total = subtotal + fee;

  if (done) return <Receipt done={done} />;

  if (!lines.length)
    return (
      <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-line">
        <BagIcon size={40} className="mx-auto text-cobalt" />
        <p className="display mt-4 text-2xl font-bold">Сагс хоосон байна</p>
        <p className="mt-2 text-ink-2">7 хоногийн цэснээс өдрийн хоолоо сонгоорой.</p>
        <Link href="/#menu" className="mt-6 inline-block rounded-full bg-tomato px-6 py-3 font-bold text-white hover:bg-tomato-deep">
          Цэс үзэх
        </Link>
      </div>
    );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setNotice(null);
    setErrors({});
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          phone: f.get("phone"),
          email: f.get("email"),
          building: f.get("building"),
          office: f.get("office"),
          payment: "qpay",
          receiptType,
          regNo: f.get("regNo") ?? "",
          note: f.get("note"),
          website: f.get("website"),
          items: open.map(({ slug, qty }) => ({ slug, qty })),
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        const win = new Map<string, string>((json.windows ?? []).map((w: { slug: string; window: string }) => [w.slug, w.window]));
        setDone({
          reference: json.reference,
          total: json.total ?? total,
          building: `${f.get("building")}, ${f.get("office")}`,
          lines: open.map((l) => ({ name: l.line.product.name.mn + (l.line.product.soup ? ` + ${l.line.product.soup.mn}` : ""), date: l.line.product.date, qty: l.qty, total: l.line.price * l.qty, window: win.get(l.slug) ?? "" })),
        });
        cart.clear();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (res.status === 422 && json?.errors) {
        setErrors(json.errors);
        setNotice("Мэдээллээ шалгаад дахин оролдоно уу.");
      } else if (json?.error === "not_configured") {
        setNotice(`Онлайн захиалгын систем тохируулагдаж байна. Захиалгаа ${business.phone.display} дугаарт утсаар өгнө үү (лавлах код ${json.reference}).`);
      } else {
        setNotice(`Захиалга илгээхэд алдаа гарлаа. Дахин оролдох эсвэл ${business.phone.display} дугаарт залгана уу.`);
      }
    } catch {
      setNotice("Интернэт холболтоо шалгаад дахин оролдоно уу.");
    } finally {
      setBusy(false);
    }
  }

  const err = (k: keyof OrderErrors) => errors[k] && <p className="mt-1 text-[13px] font-bold text-tomato">{errors[k]}</p>;
  const box = "rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-line sm:p-6";

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:gap-8">
      <div className="space-y-5">
        <section className="rounded-[1.75rem] bg-white shadow-sm ring-1 ring-line">
          <h2 className="display border-b border-line px-5 py-4 text-[17px] font-bold sm:px-6">Таны өдрийн хоол</h2>
          <ul className="divide-y divide-line">
            {lines.map(({ slug, qty, line, closed }) => {
              const p = line.product;
              const d = getDay(p.day)!;
              const win = now && !closed ? windowFor(p.date, business.windows, now) : null;
              return (
                <li key={slug} className={`flex gap-4 px-5 py-4 sm:px-6 ${closed ? "bg-sky/60" : ""}`}>
                  <Link href={`/menu/${slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full">
                    <Image src={p.image.thumb} alt="" fill sizes="80px" className={`object-cover ${closed ? "grayscale" : ""}`} />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="tnum flex flex-wrap items-center gap-x-2 text-[12.5px] font-extrabold text-cobalt">
                      {d.mn} {shortDate(p.date)}
                      {win && (
                        <span className="inline-flex items-center gap-1 text-ink-2">
                          <ClockIcon size={13} /> {win}
                        </span>
                      )}
                    </p>
                    <Link href={`/menu/${slug}`} className="display line-clamp-2 text-[15.5px] leading-snug font-bold hover:text-cobalt">
                      {p.name.mn}
                      {p.soup && <span className="font-medium text-ink-2"> + {p.soup.mn}</span>}
                    </Link>
                    {closed ? (
                      <p className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[13px] font-bold text-tomato">
                        Энэ өдрийн захиалга {business.cutoff}-д хаагдсан.
                        <button type="button" onClick={() => cart.setQty(slug, 0)} className="rounded-full px-3 py-1 text-mute ring-1 ring-line hover:text-tomato">
                          Хасах
                        </button>
                      </p>
                    ) : (
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                        <div className="flex items-center rounded-full ring-1 ring-line">
                          <button type="button" onClick={() => cart.setQty(slug, qty - 1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-sky" aria-label="Цөөлөх">
                            <MinusIcon size={16} />
                          </button>
                          <span className="tnum w-7 text-center text-sm font-extrabold">{qty}</span>
                          <button type="button" onClick={() => cart.setQty(slug, qty + 1)} disabled={qty >= maxQty(slug)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-sky disabled:opacity-35" aria-label="Нэмэх">
                            <PlusIcon size={16} />
                          </button>
                        </div>
                        <span className="tnum font-extrabold">{formatPrice(line.price * qty)}</span>
                        <button type="button" onClick={() => cart.setQty(slug, 0)} className="grid h-9 w-9 place-items-center rounded-full text-mute hover:bg-tomato/10 hover:text-tomato" aria-label="Хасах">
                          <TrashIcon size={17} />
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className={box}>
          <h2 className="display text-[17px] font-bold">Хүргэх газар</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold">
              Барилга
              <select name="building" required defaultValue="" aria-invalid={!!errors.building} className={`${field} appearance-none`}>
                <option value="" disabled>
                  Сонгох…
                </option>
                {buildings.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              {err("building")}
            </label>
            <label className="text-sm font-bold">
              Давхар, тоот, байгууллага
              <input name="office" required placeholder="12 давхар, 1203, «Компани» ХХК" aria-invalid={!!errors.office} className={field} />
              {err("office")}
            </label>
          </div>
          <p className="mt-3 text-[13px] text-mute">
            Барилга тань жагсаалтад байхгүй бол {business.phone.display} дугаарт залгаж лавлаарай.
          </p>
        </section>

        <section className={box}>
          <h2 className="display text-[17px] font-bold">Захиалагч</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold">
              Нэр
              <input name="name" autoComplete="name" required aria-invalid={!!errors.name} className={field} />
              {err("name")}
            </label>
            <label className="text-sm font-bold">
              Утас
              <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="99112233" required aria-invalid={!!errors.phone} className={field} />
              {err("phone")}
            </label>
            <label className="text-sm font-bold sm:col-span-2">
              Имэйл <span className="font-normal text-mute">(заавал биш)</span>
              <input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} className={field} />
              {err("email")}
            </label>
          </div>
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        </section>

        <section className={box}>
          <h2 className="display text-[17px] font-bold">И-баримт, тайлбар</h2>
          <div className="mt-3 flex gap-2" role="radiogroup" aria-label="И-баримтын төрөл">
            {(
              [
                ["person", "Хувь хүн"],
                ["company", "Байгууллага"],
              ] as const
            ).map(([id, label]) => (
              <button key={id} type="button" role="radio" aria-checked={receiptType === id} onClick={() => setReceiptType(id)} className="rounded-full px-4 py-2 text-sm font-bold ring-1 ring-line aria-checked:bg-cobalt aria-checked:text-white aria-checked:ring-cobalt">
                {label}
              </button>
            ))}
          </div>
          {receiptType === "company" ? (
            <label className="mt-3 block text-sm font-bold">
              Байгууллагын регистр
              <input name="regNo" inputMode="numeric" maxLength={7} placeholder="1234567" aria-invalid={!!errors.regNo} className={field} />
              {err("regNo")}
            </label>
          ) : (
            <p className="mt-2 text-[13px] text-mute">И-баримтыг таны утасны дугаараар бүртгэнэ.</p>
          )}
          <label className="mt-4 block text-sm font-bold">
            Нэмэлт тайлбар <span className="font-normal text-mute">(заавал биш)</span>
            <textarea name="note" rows={2} placeholder="Харшил, хүлээн авах хүн гэх мэт" className={field} />
          </label>
        </section>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="overflow-hidden rounded-[1.75rem] bg-cobalt text-white shadow-lg">
          <div className="p-6">
            <h2 className="display text-[22px] font-bold">Төлөх дүн</h2>
            <dl className="tnum mt-4 space-y-2 text-[15px]">
              <div className="flex justify-between">
                <dt className="text-white/70">Хоол ({open.reduce((n, l) => n + l.qty, 0)})</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/70">Хүргэлт</dt>
                <dd>{fee ? formatPrice(fee) : "Нэмэлт төлбөргүй"}</dd>
              </div>
              <div className="flex justify-between border-t border-white/20 pt-3 text-xl font-extrabold">
                <dt>Нийт</dt>
                <dd className="display text-yolk">{formatPrice(total)}</dd>
              </div>
            </dl>
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/10 p-3">
              <span className="rounded-md bg-[#e6332a] px-2 py-1 text-xs font-black text-white">QPay</span>
              <span className="text-[13px] leading-snug text-white/85">{business.rules.payment}</span>
            </div>
            {notice && (
              <p role="alert" className="mt-4 rounded-2xl bg-yolk px-3.5 py-3 text-[13.5px] font-semibold text-ink">
                {notice}
              </p>
            )}
            {errors.items && <p className="mt-3 text-[13.5px] font-bold text-yolk">{errors.items}</p>}
            <button type="submit" disabled={busy || !open.length} className="mt-5 h-13 w-full rounded-full bg-tomato text-[16px] font-extrabold text-white shadow-md hover:bg-tomato-deep disabled:cursor-not-allowed disabled:opacity-60">
              {busy ? "Илгээж байна…" : "Захиалга өгөх"}
            </button>
            <a href={`tel:${business.phone.tel}`} className="mt-4 flex items-center gap-2 text-[13.5px] font-bold text-white/80 hover:text-yolk">
              <PhoneIcon size={16} /> Асуух зүйл байвал: {business.phone.display}
            </a>
          </div>
        </div>
      </aside>
    </form>
  );
}

function Receipt({ done }: { done: Done }) {
  return (
    <div className="mx-auto max-w-lg">
      <div className="rise overflow-hidden rounded-[2rem] bg-white shadow-lg ring-1 ring-line">
        <div className="bg-cobalt p-7 text-white">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-leaf">
            <CheckIcon size={28} />
          </span>
          <h2 className="display mt-4 text-[28px] font-bold">Захиалга хүлээн авлаа</h2>
          <p className="mt-1 text-white/80">
            Код: <b className="tnum text-white">{done.reference}</b>
          </p>
        </div>
        <div className="tear" aria-hidden />
        <div className="p-7">
          <p className="text-[14px] font-bold text-ink-2">{done.building}</p>
          <ul className="tnum mt-4 space-y-3 text-[14.5px]">
            {done.lines.map((l) => (
              <li key={l.name + l.date} className="flex justify-between gap-4">
                <span>
                  <span className="block text-[12.5px] font-extrabold text-cobalt">
                    {shortDate(l.date)} · {l.window}
                  </span>
                  {l.name} × {l.qty}
                </span>
                <span className="font-bold">{formatPrice(l.total)}</span>
              </li>
            ))}
            <li className="flex justify-between gap-4 border-t border-line pt-3 text-lg font-extrabold">
              <span>Нийт</span>
              <span>{formatPrice(done.total)}</span>
            </li>
          </ul>
          <p className="mt-5 text-[14px] leading-relaxed text-ink-2">QPay нэхэмжлэлийг таны утсанд илгээнэ. {business.rules.payment} {business.rules.ebarimt}</p>
          <Link href="/#menu" className="mt-6 inline-block rounded-full bg-tomato px-6 py-3 font-bold text-white hover:bg-tomato-deep">
            Цэс рүү буцах
          </Link>
        </div>
      </div>
    </div>
  );
}
