# cloudkitchens-web

Lunch-ordering site for **Cloud Kitchens DOWNTOWN**, replacing the Zochil shop at cloudkitchens.mn.
Next.js 16 (App Router), Tailwind CSS 4, no database: the week's menu is `src/data/catalog.json`.

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run typecheck
npm run build
npm run test:order -- http://localhost:3000          # order API checks (no order sent)
npm run sync:erxes                                   # refresh prices from erxes (needs env vars)
```

- Pages: home (today's dish with the 12:00 countdown, the week board, building checker), `/menu/<slug>`
  (dish on its own or with soup), `/cart` (checkout), `/info`. Old Zochil URLs redirect.
- Time rules run in Ulaanbaatar time on both the browser and the server (`src/lib/time.ts`): a dish closes at 12:00
  on its day; ordered before 11:30 it arrives 11:30–12:30, after that 12:30–13:00.
- Orders: `POST /api/orders` checks the cart against the catalog (prices, portions, cut-off) and the building
  against the delivery list, then sends it to erxes as a form submission. Without the `ERXES_*` env vars it answers
  `503 not_configured` and the checkout tells the customer to call.
- Business facts and rules: `src/content/business.ts`. erxes admin steps: `docs/erxes/MANUAL-STEPS.md`.
- **Every week** the menu changes: update `src/data/catalog.json` and `public/images/menu`, then redeploy.
