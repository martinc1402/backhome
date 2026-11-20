import type { Listing } from "@/content/directory/types";

/* ---------------------------------------------------------------------------
   SAMPLE LISTINGS — TEST DATA ONLY. NONE OF THESE PROVIDERS EXIST.

   They exist so every page can be built and tested before real providers are
   checked. Names, numbers, prices and licence numbers are deliberately fake:
   phone numbers use the reserved 555 block, licence numbers say SAMPLE.

   To remove them: delete this file and the `...sampleListings` line in
   content/directory/listings.ts.

   The dates are relative to the day the site is built, so the samples show
   the badges they are meant to show (one lapsed, one listed) whatever day you
   test on.
--------------------------------------------------------------------------- */

const PLACEHOLDER_PHOTO = {
  src: "/placeholders/listing-photo.svg",
  width: 1200,
  height: 800,
};

function daysAgo(days: number): `${number}-${number}-${number}` {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10) as `${number}-${number}-${number}`;
}

export const sampleListings: Listing[] = [
  {
    slug: "sample-mabuhay-home-carers",
    name: "[Sample] Mabuhay Home Carers",
    sample: true,
    category: "care-at-home",
    subcategories: ["live-in-caregivers", "visiting-caregivers", "dementia-caregivers"],
    area: "mandaue",
    checkLevel: "visited",
    checkDate: daysAgo(21),
    services: [
      "Live-in caregivers, placed for a minimum of one month",
      "Visiting caregivers by the hour or day",
      "Replacement carer if yours is sick or leaves",
    ],
    suits: [
      "Parents who need help with bathing, dressing and meals",
      "Families who want someone in the house overnight",
      "Early to middle-stage dementia",
    ],
    careModes: ["live-in", "hourly"],
    dementiaExperience: true,
    acceptsPhilHealth: false,
    acceptsHMO: false,
    price: { kind: "range", from: 18000, to: 25000, per: "month", note: "Live-in. Hourly rates on request." },
    licences: [
      { type: "DOLE private recruitment licence", number: "SAMPLE-0001", checkedOn: daysAgo(21) },
      { type: "Mayor's permit (Mandaue)", number: "SAMPLE-0002", checkedOn: daysAgo(21) },
    ],
    languages: ["cebuano", "tagalog", "english"],
    hours: "Office Mon–Sat, 8am–5pm. Live-in carers 24/7.",
    responseTime: "Usually replies within a day",
    photos: [
      { ...PLACEHOLDER_PHOTO, alt: "Sample photo placeholder" },
      { ...PLACEHOLDER_PHOTO, alt: "Sample photo placeholder" },
    ],
    notes:
      "This is a sample listing used to test the site. It shows what a Visited listing looks like. The provider does not exist.",
    contact: { phone: "+639175550101", whatsapp: "+639175550101" },
    feedback: [
      {
        from: "Sample family, Dubai",
        date: daysAgo(10),
        text: "This is sample feedback to show how family comments appear on a listing.",
      },
    ],
  },
  {
    slug: "sample-lapu-lapu-home-nursing",
    name: "[Sample] Lapu-Lapu Home Nursing",
    sample: true,
    category: "nursing-and-therapy",
    subcategories: ["home-nursing", "wound-catheter-care", "physiotherapy"],
    area: "lapu-lapu",
    checkLevel: "called",
    checkDate: daysAgo(45),
    services: [
      "PRC-licensed nurses for home visits",
      "Wound dressing and catheter care",
      "Physiotherapy after a stroke or fall",
    ],
    suits: [
      "Parents recovering after a hospital stay",
      "Anyone who needs regular dressings or injections at home",
    ],
    careModes: ["visit"],
    dementiaExperience: false,
    acceptsPhilHealth: false,
    acceptsHMO: true,
    price: { kind: "range", from: 1500, to: 2500, per: "visit" },
    licences: [
      { type: "PRC licence (lead nurse)", number: "SAMPLE-0003", checkedOn: daysAgo(45) },
      { type: "Business permit (Lapu-Lapu)", number: "SAMPLE-0004", checkedOn: daysAgo(45) },
    ],
    languages: ["cebuano", "english"],
    hours: "Mon–Sun, 7am–7pm",
    responseTime: "Usually replies the same day",
    photos: [],
    notes:
      "This is a sample listing used to test the site. It shows what a Called listing looks like. The provider does not exist.",
    contact: { phone: "+639175550102" },
    feedback: [],
  },
  {
    slug: "sample-talisay-garden-residence",
    name: "[Sample] Talisay Garden Residence",
    sample: true,
    category: "care-homes",
    subcategories: ["nursing-homes", "short-stay-respite"],
    area: "talisay",
    address: "Sample barangay, Talisay",
    checkLevel: "visited",
    // Deliberately more than six months ago, so this sample shows a lapsed badge.
    checkDate: daysAgo(200),
    services: [
      "Residential nursing care with a nurse on site 24 hours",
      "Short stays of two weeks or more while family carers take a break",
    ],
    suits: [
      "Parents who can no longer be cared for safely at home",
      "Bedbound residents who need turning and hoisting",
    ],
    careModes: ["live-in"],
    dementiaExperience: true,
    acceptsPhilHealth: true,
    acceptsHMO: false,
    price: { kind: "range", from: 45000, to: 70000, per: "month", note: "Depends on room and care level." },
    licences: [
      { type: "DOH licence to operate", number: "SAMPLE-0005", checkedOn: daysAgo(200) },
      { type: "DSWD registration", number: "SAMPLE-0006", checkedOn: daysAgo(200) },
    ],
    languages: ["cebuano", "tagalog", "english"],
    hours: "Visiting hours 9am–6pm daily",
    responseTime: "Usually replies within two days",
    photos: [{ ...PLACEHOLDER_PHOTO, alt: "Sample photo placeholder" }],
    notes:
      "This is a sample listing used to test the site. Its check is more than six months old, so it shows a lapsed badge. The provider does not exist.",
    contact: { phone: "+639175550103", whatsapp: "+639175550103" },
    feedback: [],
  },
  {
    slug: "sample-cebu-city-geriatric-clinic",
    name: "[Sample] Cebu City Geriatric Clinic",
    sample: true,
    category: "doctors-and-specialists",
    subcategories: ["geriatricians", "memory-dementia-assessment", "telehealth"],
    area: "cebu-city",
    checkLevel: "listed",
    services: [
      "Geriatric consultations in clinic and by video",
      "Memory assessments",
    ],
    suits: ["Parents with several conditions and long medication lists"],
    careModes: ["visit"],
    dementiaExperience: true,
    acceptsPhilHealth: true,
    acceptsHMO: true,
    price: { kind: "quote" },
    licences: [],
    languages: ["cebuano", "english"],
    hours: "Mon–Fri, 9am–4pm",
    responseTime: "Not yet known",
    photos: [],
    notes:
      "This is a sample listing used to test the site. It shows what a provider-added listing looks like before we check it. The provider does not exist.",
    contact: { phone: "+639175550104" },
    feedback: [],
  },
];
