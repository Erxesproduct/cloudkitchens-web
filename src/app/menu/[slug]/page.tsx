import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddButton } from "@/components/add-button";
import { DayBadge } from "@/components/day-badge";
import { ClockIcon, PhoneIcon, TruckIcon } from "@/components/icons";
import { business } from "@/content/business";
import { buildings, days, getDay, getProduct, onDay, products, sku, title } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { absoluteUrl } from "@/lib/site-url";
import { shortDate } from "@/lib/time";

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const d = getDay(p.day)!;
  const description = `${d.mn} ${shortDate(p.date)}: ${p.sides.mn ?? title(p)}. ${formatPrice(p.price)}, оффис руу халуунаар нь хүргэнэ.`;
  return {
    title: `${title(p)} (${d.mn} ${shortDate(p.date)})`,
    description,
    alternates: { canonical: `/menu/${p.slug}` },
    openGraph: { type: "website", title: title(p), description, images: [{ url: p.image.src, width: p.image.w, height: p.image.h }] },
  };
}

export default async function DishPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const d = getDay(p.day)!;
  const pair = onDay(p.day);
  const others = days.filter((x) => x.id !== p.day).map((x) => onDay(x.id)[0]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: title(p),
    description: p.sides.mn ?? undefined,
    image: absoluteUrl(p.image.src),
    offers: { "@type": "Offer", price: p.price, priceCurrency: "MNT", sku: sku(p), availability: p.stock === 0 ? "https://schema.org/SoldOut" : "https://schema.org/InStock", url: absoluteUrl(`/menu/${p.slug}`) },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Зам" className="text-[13.5px] font-semibold text-mute">
        <Link href="/#menu" className="hover:text-cobalt">
          7 хоногийн цэс
        </Link>
        {" / "}
        {d.mn} {shortDate(d.date)}
      </nav>

      <div className="mt-6 grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-14">
        <div className="relative mx-auto w-[86%] max-w-[480px] md:sticky md:top-28 md:w-full">
          <div className="plate relative aspect-square overflow-hidden">
            <Image src={p.image.src} alt={title(p)} fill priority sizes="(min-width: 768px) 480px, 86vw" className="object-cover" />
          </div>
          <span className="display tnum absolute top-[4%] -left-3 rotate-[-8deg] rounded-2xl bg-yolk px-3.5 py-2 text-center leading-none font-bold text-ink shadow-md">
            <span className="block text-[12px]">{d.mn}</span>
            <span className="block text-[22px]">{shortDate(d.date)}</span>
          </span>
        </div>

        <div>
          <DayBadge date={p.date} />
          <h1 className="display mt-3 text-[32px] leading-[1.1] font-bold sm:text-[42px]">{p.name.mn}</h1>
          {p.name.en && <p className="mt-1.5 text-[16px] font-semibold text-mute">{p.name.en}</p>}
          {p.kind === "set" && p.soup && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-yolk/30 px-3.5 py-1.5 text-[14.5px] font-extrabold">
              + {p.soup.mn}
              {p.soup.en && <span className="font-semibold text-ink-2">/ {p.soup.en}</span>}
            </p>
          )}

          {/* main or set */}
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-full bg-white p-1.5 ring-1 ring-line" role="tablist" aria-label="Сонголт">
            {pair.map((x) => (
              <Link key={x.slug} href={`/menu/${x.slug}`} role="tab" aria-selected={x.slug === p.slug} className={`rounded-full px-3 py-2.5 text-center text-[14px] font-extrabold ${x.slug === p.slug ? "bg-cobalt text-white" : "text-ink-2 hover:bg-sky"}`}>
                {x.kind === "set" ? "Шөлтэй сет" : "Дангаар"} · <span className="tnum">{formatPrice(x.price)}</span>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <p className="display tnum text-[34px] font-bold text-cobalt">{formatPrice(p.price)}</p>
            <AddButton slug={p.slug} date={p.date} stock={p.stock} size="lg" label="Сагсанд нэмэх" />
          </div>

          {p.sides.mn && (
            <section className="mt-8 rounded-[1.5rem] bg-white p-5 ring-1 ring-line">
              <h2 className="label text-mute">Хайрцганд</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {p.sides.mn
                  .split(/,|\+/)
                  .map((x) => x.trim())
                  .filter(Boolean)
                  .map((x) => (
                    <li key={x} className="rounded-full bg-sky px-3 py-1.5 text-[14px] font-bold">
                      {x.charAt(0).toUpperCase() + x.slice(1)}
                    </li>
                  ))}
              </ul>
              {p.sides.en && <p className="mt-3 text-[13.5px] text-mute">{p.sides.en}</p>}
            </section>
          )}

          <div className="mt-5 divide-y divide-line rounded-[1.5rem] bg-white text-[14.5px] leading-relaxed text-ink-2 ring-1 ring-line">
            <p className="flex gap-3 p-4">
              <ClockIcon size={20} className="mt-0.5 shrink-0 text-tomato" />
              <span>
                <b className="text-ink">
                  {d.mn} {shortDate(d.date)}, {business.cutoff} хүртэл захиална.
                </b>{" "}
                {business.rules.window}
              </span>
            </p>
            <p className="flex gap-3 p-4">
              <TruckIcon size={20} className="mt-0.5 shrink-0 text-cobalt" />
              <span>
                Зөвхөн {buildings.length} барилга руу хүргэнэ.{" "}
                <Link href="/#buildings" className="font-bold text-cobalt hover:underline">
                  Жагсаалт
                </Link>
              </span>
            </p>
            <a href={`tel:${business.phone.tel}`} className="flex items-center gap-3 p-4 font-bold text-ink hover:text-cobalt">
              <PhoneIcon size={20} className="shrink-0" /> {business.phone.display}
            </a>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <h2 className="display text-[26px] font-bold">Энэ 7 хоногийн бусад өдөр</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {others.map((x) => {
            const xd = getDay(x.day)!;
            return (
              <Link key={x.slug} href={`/menu/${x.slug}`} className="group rounded-[1.5rem] bg-white p-4 ring-1 ring-line hover:ring-cobalt">
                <div className="relative aspect-square overflow-hidden rounded-full">
                  <Image src={x.image.thumb} alt="" fill sizes="(min-width: 640px) 220px, 45vw" className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <p className="tnum mt-3 text-[12.5px] font-bold text-mute">
                  {xd.mn} {shortDate(xd.date)}
                </p>
                <p className="display mt-0.5 text-[15px] leading-snug font-bold group-hover:text-cobalt">{x.name.mn}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
