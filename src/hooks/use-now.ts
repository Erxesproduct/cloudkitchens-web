"use client";

import { useSyncExternalStore } from "react";

// One shared clock for the order cut-off. null on the server and in the first client render, so the static HTML
// never claims a time (no hydration mismatch); then it ticks every 20 s.
let now: Date | null = null;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(l: () => void) {
  listeners.add(l);
  if (!timer) {
    now = new Date();
    timer = setInterval(() => {
      now = new Date();
      listeners.forEach((x) => x());
    }, 20_000);
    queueMicrotask(() => listeners.forEach((x) => x()));
  }
  return () => {
    listeners.delete(l);
    if (!listeners.size && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

export function useNow() {
  return useSyncExternalStore(
    subscribe,
    () => now,
    () => null,
  );
}
