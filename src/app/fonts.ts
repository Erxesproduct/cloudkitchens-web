import { Comfortaa, Nunito } from "next/font/google";

// Both draw Mongolian Ө ө Ү ү (checked in the cyrillic-ext files, not just the subset list).
export const comfortaa = Comfortaa({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["500", "700"], variable: "--font-comfortaa", display: "swap" });
export const nunito = Nunito({ subsets: ["latin", "cyrillic", "cyrillic-ext"], variable: "--font-nunito", display: "swap" });
