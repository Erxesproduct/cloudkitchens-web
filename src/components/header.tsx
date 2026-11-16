import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { CartLink } from "./cart-link";
import { PhoneIcon } from "./icons";

const nav = [
  { href: "/#menu", label: "7 хоногийн цэс" },
  { href: "/#buildings", label: "Хүргэх барилгууд" },
  { href: "/info", label: "Мэдээлэл" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:h-[72px] sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${business.name}: нүүр`}>
          <Image src="/brand/logo.png" alt="" width={44} height={44} priority className="h-10 w-10 rounded-xl sm:h-11 sm:w-11" />
          <span className="leading-none">
            <span className="display block text-[17px] font-bold text-cobalt sm:text-[18px]">
              Cloud<span className="text-ink">Kitchens</span>
            </span>
            <span className="label mt-1 block text-[9px] tracking-[0.3em] text-mute">DOWNTOWN</span>
          </span>
        </Link>
        <nav aria-label="Үндсэн цэс" className="ml-auto hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-full px-3.5 py-2 text-[14.5px] font-bold text-ink-2 hover:bg-sky hover:text-cobalt">
              {n.label}
            </Link>
          ))}
        </nav>
        <a href={`tel:${business.phone.tel}`} className="ml-auto hidden items-center gap-1.5 rounded-full px-3 py-2 text-[14px] font-bold text-ink-2 hover:text-cobalt sm:flex md:ml-0">
          <PhoneIcon size={16} />
          <span className="tnum">{business.phone.display}</span>
        </a>
        <div className="ml-auto sm:ml-0">
          <CartLink />
        </div>
      </div>
      <nav aria-label="Цэс" className="no-scrollbar flex gap-1 overflow-x-auto border-t border-line/70 px-3 py-1.5 md:hidden">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className="shrink-0 rounded-full px-3 py-1.5 text-[13.5px] font-bold text-ink-2 hover:bg-sky">
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
