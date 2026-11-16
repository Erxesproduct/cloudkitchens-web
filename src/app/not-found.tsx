import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <span className="mx-auto block h-20 w-20 rounded-full bg-white shadow-[0_0_0_10px_#fff,0_20px_40px_-14px_rgb(16_32_61/0.35)]" aria-hidden />
      <h1 className="display mt-8 text-4xl font-bold">Хуудас олдсонгүй</h1>
      <p className="mt-3 text-ink-2">Таваг хоосон байна: холбоос хуучирсан эсвэл тэр өдрийн хоол цэснээс гарсан байж магадгүй.</p>
      <Link href="/#menu" className="mt-8 inline-block rounded-full bg-tomato px-6 py-3 font-bold text-white hover:bg-tomato-deep">
        7 хоногийн цэс
      </Link>
    </div>
  );
}
