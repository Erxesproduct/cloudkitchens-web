import type { MetadataRoute } from "next";
import { catalogUpdatedAt, products } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(catalogUpdatedAt);
  return [
    { url: absoluteUrl("/"), lastModified, priority: 1 },
    ...products.map((p) => ({ url: absoluteUrl(`/menu/${p.slug}`), lastModified, priority: 0.7 })),
    { url: absoluteUrl("/info"), lastModified, priority: 0.5 },
  ];
}
