import Image from "next/image";
import Link from "next/link";
import { AddButton } from "@/components/add-button";
import { BuildingCheck } from "@/components/building-check";
import { DayBadge } from "@/components/day-badge";
import { BowlIcon, ClockIcon, QrIcon, TruckIcon } from "@/components/icons";
import { TodayHero } from "@/components/today-hero";
import { business } from "@/content/business";
import { days, onDay, week } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { shortDate } from "@/lib/time";

export default function Home() {
  return (
    <>
      {/* today */}
      <section className="clouds relative overflow-hidden bg-gradient-to-b from-sky-2 to-sky">
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-20">
          <TodayHero />
        </div>
      </section>

      {/* how it works */}
      <section className="mx-auto -mt-8 max-w-6xl px-4 sm:px-6" aria-label="Хэрхэн захиалах">
        <ol className="grid gap-3 rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-line sm:grid-cols-3 sm:p-5">
          {[
            { icon: BowlIcon, t: `${business.cutoff} хүртэл захиал`, d: "Өдрийн хоолоо өглөө, эсвэл 7 хоногийнхоо цэснээс урьдчилж сонгоно." },
            { icon: QrIcon, t: "QPay-ээр төл", d: business.rules.payment },
            { icon: TruckIcon, t: "Халуунаар нь хүргэнэ", d: "11:30-аас өмнө захиалбал 11:30–12:30, дараа нь 12:30–13:00." },
          ].map(({ icon: Icon, t, d }, k) => (
            <li key={t} className="flex gap-3.5 rounded-2xl p-3">
              <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sky text-cobalt">
                <Icon size={22} />
                <span className="display tnum absolute -top-1.5 -left-1.5 grid h-5 w-5 place-items-center rounded-full bg-yolk text-[11px] font-bold text-ink">{k + 1}</span>
              </span>
              <span>
                <span className="block font-extrabold">{t}</span>
                <span className="mt-0.5 block text-[13.5px] leading-snug text-ink-2">{d}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* week */}
      <section id="menu" className="mx-auto mt-20 max-w-6xl scroll-mt-24 px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="label text-cobalt">
              {shortDate(week.from)} – {shortDate(week.to)}
            </p>
            <h2 className="display mt-2 text-[30px] leading-tight font-bold sm:text-[38px]">7 хоногийн цэс</h2>
            <p className="mt-2 max-w-xl text-[15.5px] text-ink-2">{business.rules.menu} Дараагийн өдрүүдийнхээ хоолыг одооноос захиалж болно.</p>
          </div>
        </div>

        <div className="no-scrollbar -mx-4 mt-8 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
          {days.map((d) => {
            const [main, set] = onDay(d.id);
            return (
              <article key={d.id} className="flex w-[78vw] max-w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-line lg:w-auto lg:max-w-none">
                <div className="px-4 pt-4">
                  <p className="display flex items-baseline justify-between gap-2 leading-none font-bold">
                    <span className="text-[19px]">{d.mn}</span>
                    <span className="tnum text-[13px] text-mute">{shortDate(d.date)}</span>
                  </p>
                  <div className="mt-2.5">
                    <DayBadge date={d.date} />
                  </div>
                </div>
                <Link href={`/menu/${main.slug}`} className="group relative mx-4 mt-4 block aspect-square overflow-hidden rounded-full">
                  <Image src={main.image.thumb} alt={main.name.mn} fill sizes="(min-width: 1024px) 200px, 70vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  {main.stock === 0 && <span className="absolute inset-0 grid place-items-center bg-white/70 text-[15px] font-extrabold text-ink">Дууссан</span>}
                </Link>
                <div className="flex flex-1 flex-col px-4 pt-4 pb-4">
                  <h3 className="display text-[16px] leading-snug font-bold">
                    <Link href={`/menu/${main.slug}`} className="hover:text-cobalt">
                      {main.name.mn}
                    </Link>
                  </h3>
                  {main.name.en && <p className="mt-0.5 line-clamp-1 text-[12.5px] font-semibold text-mute">{main.name.en}</p>}
                  <div className="tear mt-auto mb-3 pt-4" aria-hidden />
                  <div className="space-y-2.5">
                    {[main, set].filter(Boolean).map((p) => (
                      <div key={p!.slug} className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-bold text-ink-2">{p!.kind === "set" && p!.soup ? `+ ${p!.soup.mn}` : "Дангаар"}</p>
                          <p className="tnum text-[15px] font-extrabold">{formatPrice(p!.price)}</p>
                        </div>
                        <AddButton slug={p!.slug} date={p!.date} stock={p!.stock} label="Авах" size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* buildings */}
      <section id="buildings" className="mx-auto mt-20 max-w-6xl scroll-mt-24 px-4 sm:px-6">
        <div className="grid gap-8 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-line sm:p-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div>
            <p className="label text-tomato">Hyper-localized хүргэлт</p>
            <h2 className="display mt-2 text-[28px] leading-tight font-bold sm:text-[34px]">Танай барилга жагсаалтад байна уу?</h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">{business.rules.zone}</p>
            <p className="mt-5 flex items-center gap-2 text-[14px] font-bold text-ink-2">
              <ClockIcon size={17} className="text-cobalt" /> {business.rules.window}
            </p>
          </div>
          <BuildingCheck />
        </div>
      </section>

      {/* kitchen */}
      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-cobalt text-white md:grid-cols-2">
          <div className="p-7 sm:p-10">
            <p className="label text-yolk">Үүлэн гал тогоо</p>
            <h2 className="display mt-2 text-[26px] leading-tight font-bold sm:text-[32px]">{business.tagline}</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-white/85">{business.intro}</p>
            <p className="mt-3 text-[15.5px] leading-relaxed text-white/85">{business.about}</p>
            <a href={business.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-full bg-white px-5 py-2.5 text-[14px] font-bold text-cobalt hover:bg-sky">
              {business.address}
            </a>
          </div>
          <div className="relative aspect-[16/9] md:aspect-auto md:h-full md:min-h-[320px]">
            <Image src="/brand/banner.webp" alt="Cloud Kitchens Downtown: hyperlocal ghost kitchen in downtown Ulaanbaatar" fill sizes="(min-width: 768px) 560px, 100vw" className="bg-white object-contain" />
          </div>
        </div>
      </section>
    </>
  );
}
