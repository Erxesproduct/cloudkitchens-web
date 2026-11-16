/**
 * Business facts from cloudkitchens.mn (Zochil shop 23005: shop description, delivery rule, payment rule, terms)
 * and the Facebook page «Cloud Kitchens Downtown», read on 2026-11-16. Nothing here is invented; open questions
 * are listed in docs/erxes/MANUAL-STEPS.md.
 */
export const business = {
  name: "Cloud Kitchens DOWNTOWN",
  short: "Cloud Kitchens",
  tagline: "Hyperlocal ghost kitchen in downtown Ulaanbaatar",
  intro: "Эрүүл, амттай, шинэхэн өдрийн хоолыг халуунаар нь таны оффис руу хүргэнэ.",
  about:
    "Өдрийн хоолыг өглөө бүр шинэхэн орцоор, эрүүл ахуйн өндөр түвшинд таны ажлын хажууханд байрлах үүлэн гал тогоонд үйлдвэрлэж байна.",
  phone: { display: "8006-8204", tel: "+97680068204" },
  email: "cloudkitchensdowntown@gmail.com",
  address: "СБД, 1-р хороо, Жамьян Гүний гудамж, Чойжин Сүйтс, 1F",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Choijin Suites, Jamyan Gun street, Ulaanbaatar"),
  facebook: "https://www.facebook.com/p/Cloud-Kitchens-Downtown-61557596277076/",
  instagram: "https://www.instagram.com/cloudkitchensdowntown",
  payments: [{ id: "qpay", name: "QPay", note: "Аль ч банкны аппаар QR уншуулж төлнө" }],
  /** No delivery options or fees were set on Zochil: lunch is delivered to the listed buildings at no extra charge. */
  delivery: [{ id: "office", name: "Оффис руу хүргэлт", fee: 0, note: "Жагсаалтад байгаа барилгууд руу" }],
  /** «тухайн өдрийн 12 цагаас өмнө хэзээ ч өгч болно» */
  cutoff: "12:00",
  /** «11:30-аас өмнө өгвөл 11:30 - 12:30 хооронд … 11:30-аас хойш өгвөл 12:30 - 13:00» */
  windows: [
    { before: "11:30", label: "11:30–12:30" },
    { before: "12:00", label: "12:30–13:00" },
  ],
  rules: {
    menu: "Өдрийн хоолны меню ажлын 5 өдрөөр гардаг ба өдөр бүр нэг хоол: дангаар нь эсвэл шөлтэй сет.",
    order: "Тухайн өдрийн хоолоо 12:00 цагаас өмнө хэзээ ч захиалж болно.",
    window: "11:30-аас өмнө захиалбал 11:30–12:30-ийн хооронд, 11:30-аас хойш захиалбал 12:30–13:00-ийн хооронд хүргэнэ.",
    zone: "Хоолоо халуунаар нь хүргэхийн тулд hyper-localized бүсэд буюу зөвхөн жагсаалтад байгаа барилгуудад хүргэнэ. Манай үүлэн гал тогоо таны оффисоос 2–5 минутын зайд байна.",
    payment: "100% төлбөрөө төлж байж таны захиалга баталгаажна.",
    ebarimt: "И-баримтыг таны утасны дугаараар эсвэл байгууллагын регистрээр олгоно.",
  },
} as const;

export type DeliveryId = (typeof business.delivery)[number]["id"];
export const deliveryOption = (id: DeliveryId) => business.delivery.find((d) => d.id === id)!;
/** No delivery fee on Zochil. */
export const deliveryFee = (id: DeliveryId, subtotal: number) => (subtotal >= 0 ? deliveryOption(id).fee : 0);
