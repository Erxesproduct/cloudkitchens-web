import type { Metadata } from "next";
import { BuildingIcon, CardIcon, ClockIcon, MailIcon, PhoneIcon, PinIcon, ReceiptIcon } from "@/components/icons";
import { business } from "@/content/business";
import { buildings } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Хүргэлт, төлбөр, холбоо барих",
  description: `${business.cutoff} хүртэл захиална, 11:30–13:00-д ${buildings.length} барилга руу хүргэнэ. QPay-ээр 100% урьдчилж төлнө.`,
  alternates: { canonical: "/info" },
};

export default function Info() {
  const card = "rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-line sm:p-8";
  return (
    <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6">
      <p className="label text-cobalt">Мэдээлэл</p>
      <h1 className="display mt-2 text-[32px] font-bold sm:text-[42px]">Хүргэлт, төлбөр, холбоо барих</h1>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <section id="order" className={`${card} scroll-mt-28`}>
          <ClockIcon size={26} className="text-tomato" />
          <h2 className="display mt-3 text-xl font-bold">Захиалах цаг</h2>
          <ul className="mt-3 space-y-2.5 text-[15px] leading-relaxed text-ink-2">
            <li>{business.rules.menu}</li>
            <li>{business.rules.order}</li>
            {business.windows.map((w) => (
              <li key={w.label} className="tnum font-bold text-ink">
                {w.before}-аас өмнө захиалбал → {w.label}
              </li>
            ))}
            <li>Дараагийн өдрүүдийн хоолыг 7 хоногийн цэснээс урьдчилан захиалж болно.</li>
          </ul>
        </section>

        <section id="payment" className={`${card} scroll-mt-28`}>
          <CardIcon size={26} className="text-cobalt" />
          <h2 className="display mt-3 text-xl font-bold">Төлбөр</h2>
          <ul className="mt-3 space-y-2.5 text-[15px] leading-relaxed text-ink-2">
            <li>QPay: аль ч банкны аппаар QR уншуулж төлнө.</li>
            <li className="font-bold text-ink">{business.rules.payment}</li>
            <li>Хүргэлтэд нэмэлт төлбөр авахгүй.</li>
          </ul>
          <div className="mt-5 flex gap-3 border-t border-line pt-5 text-[15px] leading-relaxed text-ink-2">
            <ReceiptIcon size={22} className="mt-0.5 shrink-0 text-ink" />
            <span>{business.rules.ebarimt}</span>
          </div>
        </section>
      </div>

      <section id="delivery" className={`${card} mt-5 scroll-mt-28`}>
        <BuildingIcon size={26} className="text-cobalt" />
        <h2 className="display mt-3 text-xl font-bold">Хүргэх {buildings.length} барилга</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{business.rules.zone}</p>
        <ul className="mt-4 grid gap-x-6 gap-y-1.5 text-[14.5px] font-semibold sm:grid-cols-2 md:grid-cols-3">
          {buildings.map((b) => (
            <li key={b} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cobalt" aria-hidden />
              {b}
            </li>
          ))}
        </ul>
      </section>

      <section id="contact" className={`${card} mt-5 scroll-mt-28`}>
        <h2 className="display text-xl font-bold">Үүлэн гал тогоо</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{business.about}</p>
        <ul className="mt-4 grid gap-3.5 text-[15px] sm:grid-cols-2">
          <li>
            <a href={business.mapUrl} target="_blank" rel="noopener noreferrer" className="flex gap-2.5 hover:text-cobalt">
              <PinIcon size={18} className="mt-0.5 shrink-0 text-cobalt" /> {business.address}
            </a>
          </li>
          <li>
            <a href={`tel:${business.phone.tel}`} className="flex items-center gap-2.5 font-bold hover:text-cobalt">
              <PhoneIcon size={18} className="shrink-0 text-cobalt" /> <span className="tnum">{business.phone.display}</span>
            </a>
          </li>
          <li>
            <a href={`mailto:${business.email}`} className="flex items-center gap-2.5 break-all hover:text-cobalt">
              <MailIcon size={18} className="shrink-0 text-cobalt" /> {business.email}
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
