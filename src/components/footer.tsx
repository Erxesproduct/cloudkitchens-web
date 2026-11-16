import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { ClockIcon, FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon } from "./icons";

export function Footer() {
  return (
    <footer className="mt-24 bg-cobalt text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/brand/logo.png" alt="" width={48} height={48} className="h-12 w-12 rounded-xl ring-2 ring-white/30" />
            <p className="display text-[22px] font-bold text-white">{business.name}</p>
          </div>
          <p className="mt-4 max-w-sm text-[14.5px] leading-relaxed">{business.about}</p>
          <div className="mt-5 flex gap-2">
            <a href={business.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-white/30 hover:bg-white/10">
              <FacebookIcon size={18} />
            </a>
            <a href={business.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-white/30 hover:bg-white/10">
              <InstagramIcon size={18} />
            </a>
          </div>
        </div>
        <div>
          <p className="label text-yolk">Захиалга</p>
          <ul className="mt-3 space-y-2.5 text-[14.5px]">
            <li className="flex gap-2">
              <ClockIcon size={16} className="mt-0.5 shrink-0" /> Ажлын өдөр, {business.cutoff} хүртэл захиална
            </li>
            {business.windows.map((w) => (
              <li key={w.label} className="tnum pl-6 text-white/70">
                {w.before} хүртэл → {w.label}
              </li>
            ))}
            <li>
              <Link href="/info" className="font-bold text-yolk hover:underline">
                Хүргэлт, төлбөр, и-баримт
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="label text-yolk">Холбоо барих</p>
          <ul className="mt-3 space-y-2.5 text-[14.5px]">
            <li>
              <a href={`tel:${business.phone.tel}`} className="flex items-center gap-2 hover:text-white">
                <PhoneIcon size={16} /> <span className="tnum">{business.phone.display}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${business.email}`} className="flex items-center gap-2 break-all hover:text-white">
                <MailIcon size={16} className="shrink-0" /> {business.email}
              </a>
            </li>
            <li>
              <a href={business.mapUrl} target="_blank" rel="noopener noreferrer" className="flex gap-2 hover:text-white">
                <PinIcon size={16} className="mt-0.5 shrink-0" /> {business.address}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <p className="mx-auto max-w-6xl px-4 py-5 text-[12.5px] text-white/55 sm:px-6">
          © {new Date().getFullYear()} {business.name} · {business.tagline}
        </p>
      </div>
    </footer>
  );
}
