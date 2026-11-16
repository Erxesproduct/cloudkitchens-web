import data from "@/data/catalog.json";

export type Img = { src: string; w: number; h: number; thumb: string };
export type Bi = { mn: string; en: string | null };
export type DayId = "mon" | "tue" | "wed" | "thu" | "fri";
export type Day = { id: DayId; date: string; mn: string; en: string };

export type Product = {
  /** Zochil product id (kept for the erxes product code and old-URL redirects). */
  id: number;
  slug: string;
  sku: string | null;
  day: DayId;
  /** The date this dish is cooked and delivered (from the menu photo). */
  date: string;
  /** main = the dish on its own; set = the dish with the day's soup. */
  kind: "main" | "set";
  name: Bi;
  soup: Bi | null;
  /** What is in the box: «Үхрийн махтай гуляш, будаа, …». */
  sides: { mn: string | null; en: string | null };
  price: number;
  /** Portions left; null = not tracked; 0 = sold out. */
  stock: number | null;
  image: Img;
  zochilCategoryIds: number[];
};

export const products = data.products as Product[];
export const days = data.days as Day[];
export const buildings = data.buildings as string[];
export const week = data.week;
export const catalogUpdatedAt = data.updatedAt;

const bySlug = new Map(products.map((p) => [p.slug, p]));
export const getProduct = (slug: string) => bySlug.get(slug);
export const getDay = (id: string) => days.find((d) => d.id === id);
export const onDay = (id: DayId) => products.filter((p) => p.day === id).sort((a, b) => a.price - b.price);

export const soldOut = (p: { stock: number | null }) => p.stock === 0;
export const title = (p: Product) => (p.kind === "set" && p.soup ? `${p.name.mn} + ${p.soup.mn}` : p.name.mn);

/** The product a cart line points at. */
export function resolveLine(slug: string) {
  const product = getProduct(slug);
  return product ? { product, price: product.price, stock: product.stock } : null;
}

/** erxes product code: CK-<zochil id>. */
export const sku = (p: Pick<Product, "id">) => `CK-${p.id}`;
