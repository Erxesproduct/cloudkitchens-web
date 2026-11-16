# Cloud Kitchens DOWNTOWN: erxes manual steps

Owner of every step below: **Terbish**, with Cloud Kitchens DOWNTOWN for credentials and decisions.

These steps happen inside the erxes 3.0 admin, not in code. The website reads the results through the
environment variables in `.env.example`. Never commit their values.

| Task | Status | What to do in erxes (admin path) |
| --- | --- | --- |
| [1.1] Import products, categories, prices | website done · manual import in erxes | Section 1.1 |
| [1.2] Payment setup (QPay) | website done · manual, blocked on QPay merchant credentials | Section 1.2 |
| [1.3] eBarimt setup | website done · manual, blocked on PosAPI registration + TIN | Section 1.3 |
| [1.4] Delivery zones, fees, order statuses | website done · manual in erxes | Section 1.4 |
| [1.5] Test order from cart to receipt | validation verified · real order blocked on erxes env vars + 1.2 + 1.3 | Section 1.5 |

There is no erxes instance for Cloud Kitchens yet ("erxes 3.0: NOT SET"). Create it first, then add the env vars
under **Vercel → cloudkitchens-web → Settings → Environment Variables**.

---

## 1.1 Import products, categories and prices

Source: cloudkitchens.mn (Zochil shop 23005), scraped 2026-11-16, plus the Facebook page «Cloud Kitchens Downtown»
(its short description and profile picture).

- A **weekday lunch menu**: one dish a day, Monday–Friday, sold on its own («Дангаар») or as a set with the day's
  soup. **10 products** for the week of **2026-11-16 → 11-20**.
- Each dish's date comes from the strip printed on top of its Zochil photo («Даваа 11/16» … «Баасан 11/20»); the
  strip is cropped off on the website. Names are split into Mongolian and English (Zochil had «МН / EN» in capitals).
- What is in each box comes from the Zochil short description.

| Date | Dish | Дангаар | + soup (set) |
| --- | --- | --- | --- |
| Mon 11/16 | Үхрийн махтай гуляш | 19,900₮ | + Мөөгний зутан шөл 24,900₮ |
| Tue 11/17 | Тахианы шницель | 17,900₮ | + Кимчижигэ 22,900₮ |
| Wed 11/18 | Нимгэн төмстэй хуурга | 19,900₮ | + Хулууны зутан шөл 24,900₮ |
| Thu 11/19 | Ананастай тахиа | 17,900₮ | + Хурган бантан 22,900₮ |
| Fri 11/20 | Жэюүг солонгос халуун ногоотой гахайн мах | 17,900₮ | + Өндөг помидортой шөл 22,900₮ |

Files:

- `docs/erxes/cloudkitchens-categories.csv`: `CK` → `CK-lunch` → one category per weekday (`CK-lunch-mon` …).
- `docs/erxes/cloudkitchens-products.csv`: 10 rows, code `CK-<zochilId>`, with price, date, portions left, status,
  the box contents (MN and EN) and the photo path.

Steps:

1. **Products & services → Categories**: import `cloudkitchens-categories.csv`.
2. **Settings → Import & Export → Import → Products**: upload `cloudkitchens-products.csv`.
   - Map `code → Code`, `name → Name`, `categoryCode → Category code`, `unitPrice → Unit price`, `type → Type`,
     `uom → UOM`, `description → Description`.
   - Keep the codes: the website and `npm run sync:erxes` match products on them.
3. **Portions**: Zochil tracked them per dish (30 for a main, 25 for a set). **Monday is already at 0** for both
   (sold out). Enter the daily portions in **Inventories → Remainders**.
4. **Every week:** the menu changes. Add the new dishes in erxes, and in the website add the new week to
   `src/data/catalog.json` (days, products, photos in `public/images/menu`) and redeploy. When the week is over and
   nothing new is published, the site says «Энэ 7 хоногийн цэс дууслаа».
5. Run `npm run sync:erxes` once with a Client Portal token to confirm the codes match (prices only).

**Confirm with Cloud Kitchens:**

- Who publishes next week's menu and when (Friday? Sunday?). Should we automate it from erxes instead of
  `catalog.json`?
- The Friday soup «Өндөг помидортой шөл» has no English name on Zochil.
- Monday's main and set share Zochil SKU `D019`; erxes uses the `CK-<id>` codes instead.
