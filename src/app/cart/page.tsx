import type { Metadata } from "next";
import { Checkout } from "@/components/checkout";

export const metadata: Metadata = { title: "Сагс", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <h1 className="display text-[32px] font-bold sm:text-[42px]">Сагс, захиалга</h1>
      <div className="mt-8">
        <Checkout />
      </div>
    </div>
  );
}
