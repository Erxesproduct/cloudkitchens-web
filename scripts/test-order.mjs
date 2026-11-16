/**
 * End-to-end check of the website order flow (cart → /api/orders → erxes).
 *
 *   node scripts/test-order.mjs [baseUrl] [--send]
 *
 * Without --send it only runs the validation cases (no order reaches erxes).
 * With --send it also places ONE real test order, marked «ТЕСТ ЗАХИАЛГА: устгана уу» in the note.
 * Which dishes can be ordered depends on the clock (12:00 Ulaanbaatar time cut-off), so the cases pick open
 * dishes the same way the server does. Exit code 1 if any check fails.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const base = (args.find((a) => !a.startsWith("--")) ?? "http://localhost:3000").replace(/\/$/, "");
const send = args.includes("--send");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(await readFile(path.join(root, "src", "data", "catalog.json"), "utf8"));
const P = catalog.products;

// same rule as src/lib/time.ts
const ub = new Date(Date.now() + 8 * 3600_000);
const today = ub.toISOString().slice(0, 10);
const minutes = ub.getUTCHours() * 60 + ub.getUTCMinutes();
const open = (p) => p.date > today || (p.date === today && minutes < 12 * 60);

const orderable = P.filter((p) => open(p) && p.stock !== 0);
const soldout = P.find((p) => p.stock === 0 && open(p));
const closed = P.find((p) => !open(p));
if (orderable.length < 2) {
  console.log(`Only ${orderable.length} dish(es) can still be ordered this week (${today}); publish next week's menu to run the order checks.`);
  process.exit(0);
}
const [dish, second] = orderable;
const scarce = orderable.find((p) => p.stock != null && p.stock < 20);
const EXPECTED_TOTAL = dish.price * 2 + second.price; // no delivery fee

const order = {
  name: "Тест Захиалагч",
  phone: "99112233",
  building: catalog.buildings[0],
  office: "12 давхар, 1203, тест",
  payment: "qpay",
  receiptType: "person",
  note: "ТЕСТ ЗАХИАЛГА: устгана уу",
  items: [
    { slug: dish.slug, qty: 2 },
    { slug: second.slug, qty: 1 },
  ],
};

async function post(body) {
  const res = await fetch(`${base}/api/orders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { status: res.status, json: await res.json().catch(() => null) };
}

// valid = passed validation (200 when erxes is set, 503 not_configured otherwise)
const valid = (r) => !r.json?.errors && (r.status === 200 || r.status === 503);
const rejects = (field) => (r) => r.status === 422 && !!r.json?.errors?.[field];
const total = (expected) => (r) => valid(r) && r.json?.total === expected;

const cases = [
  ["empty cart is rejected", { ...order, items: [] }, rejects("items")],
  ["unknown dish is ignored (then empty)", { ...order, items: [{ slug: "no-such-dish", qty: 1 }] }, rejects("items")],
  ...(soldout ? [[`sold-out dish is not orderable (${soldout.slug})`, { ...order, items: [{ slug: soldout.slug, qty: 1 }] }, rejects("items")]] : []),
  ...(closed ? [[`a day after its 12:00 cut-off is closed (${closed.slug})`, { ...order, items: [{ slug: closed.slug, qty: 1 }] }, (r) => rejects("items")(r) && /хаагдсан/.test(r.json.errors.items)]] : []),
  ...(scarce ? [[`more than the portions left is rejected (${scarce.slug}, ${scarce.stock})`, { ...order, items: [{ slug: scarce.slug, qty: scarce.stock + 1 }] }, rejects("items")]] : []),
  [`order total = dishes, no delivery fee (${EXPECTED_TOTAL}₮)`, order, total(EXPECTED_TOTAL)],
  ["building outside the delivery list is rejected", { ...order, building: "Улаанбаатар хот" }, rejects("building")],
  ["building is required", { ...order, building: "" }, rejects("building")],
  ["floor / office is required", { ...order, office: "" }, rejects("office")],
  ["unknown payment is rejected", { ...order, payment: "cash" }, rejects("payment")],
  ["company eBarimt needs a 7-digit registry number", { ...order, receiptType: "company", regNo: "12" }, rejects("regNo")],
  ["company eBarimt with a valid registry number passes", { ...order, receiptType: "company", regNo: "1234567" }, valid],
  ["bad phone is rejected", { ...order, phone: "123" }, rejects("phone")],
  ["+976 phone prefix is accepted", { ...order, phone: "+976 9911 2233" }, valid],
  ["bad email is rejected", { ...order, email: "not-an-email" }, rejects("email")],
  ["quantity over 20 is ignored", { ...order, items: [{ slug: dish.slug, qty: 21 }] }, rejects("items")],
  ["honeypot is silently accepted", { ...order, website: "spam" }, (r) => r.status === 200 && r.json?.ok === true],
];

let failed = 0;
console.log(`Order API checks against ${base} (Ulaanbaatar ${today} ${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")})\n`);
for (const [label, body, ok] of cases) {
  const r = await post(body);
  const pass = ok(r);
  if (!pass) failed++;
  console.log(`${pass ? "✓" : "✗"} ${label}  (${r.status}${r.json?.errors ? " " + Object.keys(r.json.errors).join(",") : ""})`);
}

if (send) {
  const r = await post(order);
  if (r.status === 200 && r.json?.ok) {
    console.log(`\n✓ test order delivered to erxes: ${r.json.reference}, total ${r.json.total}₮ (expected ${EXPECTED_TOTAL})`);
    if (r.json.total !== EXPECTED_TOTAL) {
      failed++;
      console.log("✗ unexpected total");
    }
  } else if (r.status === 503 && r.json?.error === "not_configured") {
    console.log(`\n– test order NOT sent: erxes env vars are not set on ${base} (reference ${r.json.reference}). See .env.example.`);
  } else {
    failed++;
    console.log(`\n✗ test order failed: ${r.status} ${JSON.stringify(r.json)}`);
  }
}

console.log(failed ? `\n${failed} check(s) failed` : `\nall ${cases.length} checks passed`);
process.exit(failed ? 1 : 0);
