import { readFileSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

// Old Zochil URLs keep working: /products/<categoryId|null>/<productId> → /menu/<slug>; the weekday categories → the week board.
const catalog = JSON.parse(readFileSync(path.join(process.cwd(), "src", "data", "catalog.json"), "utf8")) as { products: { id: number; slug: string }[] };
const productRedirects = catalog.products.map((p) => ({ source: `/products/:category/${p.id}`, destination: `/menu/${p.slug}`, permanent: true }));

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Dish photos are pre-sized WebP (480 px thumbs, 1000 px large), so they are served as-is.
  images: { unoptimized: true },
  async redirects() {
    return [
      ...productRedirects,
      // a dish from an older week: back to the current menu
      { source: "/products/:category/:id(\\d+)", destination: "/#menu", permanent: false },
      { source: "/products/:path*", destination: "/#menu", permanent: false },
      { source: "/products", destination: "/#menu", permanent: false },
      { source: "/category/:path*", destination: "/#menu", permanent: false },
      { source: "/saled-products", destination: "/#menu", permanent: false },
      { source: "/brands/:path*", destination: "/#menu", permanent: false },
      { source: "/shopping-cart", destination: "/cart", permanent: true },
      { source: "/checkout", destination: "/cart", permanent: true },
      { source: "/about", destination: "/info#contact", permanent: true },
      { source: "/faq", destination: "/info", permanent: true },
      { source: "/terms", destination: "/info#order", permanent: true },
      { source: "/contact", destination: "/info#contact", permanent: true },
      { source: "/accounts/:path*", destination: "/", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      { source: "/images/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }] },
    ];
  },
};

export default nextConfig;
