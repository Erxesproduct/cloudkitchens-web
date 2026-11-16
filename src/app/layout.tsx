import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { business } from "@/content/business";
import { siteUrl } from "@/lib/site-url";
import { comfortaa, nunito } from "./fonts";
import "./globals.css";

const description = "Downtown-ын оффисуудад өдрийн хоолыг халуунаар нь хүргэнэ: ажлын 5 өдрийн цэс, 12:00 хүртэл захиална, 11:30–13:00-д хүргэнэ, QPay-ээр төлнө.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${business.name}: оффисын өдрийн хоол`, template: `%s · ${business.short}` },
  description,
  openGraph: { type: "website", locale: "mn_MN", siteName: business.name, description, images: [{ url: "/brand/banner.webp", width: 1640, height: 924 }] },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#0b4fc0" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mn" className={`${comfortaa.variable} ${nunito.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-cobalt focus:px-4 focus:py-2 focus:text-white">
          Үндсэн агуулга руу
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
