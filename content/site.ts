import { hasPublishedGuides, type GuideSlug } from "@/content/guides";

/* ---------------------------------------------------------------------------
   BackHome — site-wide copy and homepage copy.

   Everything the founders are likely to want to reword lives here, so the
   section components stay presentational. Directory data (categories, areas,
   listings) lives in content/directory/; guides in content/guides.ts.

   Never claim a track record BackHome does not have: no invented provider
   counts, families helped, testimonials or review scores. The provider count
   and "Recently checked" are computed from the real listings.
--------------------------------------------------------------------------- */

export const site = {
  name: "BackHome",
  // The primary domain: backhome.ph redirects here.
  url: "https://www.backhome.ph",
  contactEmail: "hello@backhome.ph",
  serviceArea: "Metro Cebu, Philippines",
} as const;

export const nav = {
  links: [
    { label: "Find care", href: "/#find-care" },
    // Shown once the first guide is written.
    ...(hasPublishedGuides ? [{ label: "Guides", href: "/guides" }] : []),
    { label: "How we check", href: "/how-we-check" },
    { label: "For providers", href: "/for-providers" },
  ],
  cta: { label: "Get help finding care", href: "/help" },
} as const;

export const hero = {
  eyebrow: "Starting in Metro Cebu",
  heading: "Trusted elder care for your parents back home.",
  body: "Caregivers, home nurses, care homes and support services in Cebu. Each one is checked by our local team.",
  search: {
    needLabel: "What do they need?",
    needPlaceholder: "Choose a type of care",
    areaLabel: "Where?",
    areaAll: "All of Metro Cebu",
    button: "Search",
  },
  helpLink: { label: "Not sure what they need? Tell us what's happening", href: "/help" },
  /**
   * The existing hero still: an older parent's hands holding a phone as a call
   * comes through. Portrait crop; the card uses object-cover.
   */
  image: {
    src: "/media/hero-cebu-call-still.v1.jpg",
    width: 1440,
    height: 2618,
    alt: "An older parent in Cebu holding a phone as a call from family comes through.",
  },
} as const;

export const trustStrip = {
  points: [
    "Every listing shows how and when we checked it",
    "Permits and licences checked",
    "Families can report a problem on any listing",
  ],
  /** Shown instead of the count while no provider has a current check. */
  noneYet: "We're checking our first providers now.",
} as const;

export const findCare = {
  eyebrow: "Find care",
  heading: "What do they need?",
  comingSoon: "Coming soon",
} as const;

export const situations = {
  eyebrow: "Not sure where to start?",
  heading: "Start from what's happening",
  cta: "Read the guide",
  /** Used while a card's guide is still unwritten: the card links to /help. */
  ctaUnwritten: "Ask us for help",
  cards: [
    {
      title: "Dad's just been discharged",
      body: "What to arrange in the first two weeks at home, and who can help.",
      guide: "leaving-hospital",
    },
    {
      title: "Mum is getting forgetful",
      body: "Where to get a memory assessment, and how to find carers with dementia experience.",
      guide: "memory-loss-and-dementia",
    },
    {
      title: "Our caregiver quit suddenly",
      body: "Short-term cover while you find someone permanent.",
      guide: "when-a-caregiver-quits",
    },
    {
      title: "I need someone to check in each week",
      body: "Visiting carers, and BackHome check-in visits with updates for you.",
      guide: "weekly-check-ins",
    },
  ] satisfies { title: string; body: string; guide: GuideSlug }[],
} as const;

export const howWeCheck = {
  eyebrow: "How we check",
  heading: "You shouldn't have to take a stranger's word for it",
  steps: [
    {
      number: "01",
      title: "We call and visit",
      body: "Our Cebu team speaks to every provider, and visits in person before a listing gets the Visited badge.",
    },
    {
      number: "02",
      title: "We check permits and licences",
      body: "Business permits, PRC licences for nurses and therapists, and DOH or DSWD licences where they apply.",
    },
    {
      number: "03",
      title: "We re-check every 6 months",
      body: "Badges lapse if they aren't renewed. If a family reports a problem, the badge comes down until we've looked into it.",
    },
  ],
  key: [
    { level: "visited", label: "Visited", text: "Seen in person" },
    { level: "called", label: "Called", text: "Checked by phone and online" },
    { level: "listed", label: "Listed", text: "Added by the provider, not yet checked" },
  ],
  link: { label: "Read how we check", href: "/how-we-check" },
} as const;

export const recentlyChecked = {
  eyebrow: "The directory",
  heading: "Recently checked in Cebu",
  /** Shown while no provider has a current check. */
  empty:
    "Our first checks are under way. Providers will appear here as soon as our Cebu team has called or visited them.",
} as const;

export const paidHelp = {
  eyebrow: "BackHome help",
  heading: "Too far away to do the legwork?",
  body: "Tell us what's happening. We'll shortlist providers, visit them, and send you a report with photos and notes. Then we can arrange regular check-in visits.",
  points: [
    "A shortlist of 3 checked providers",
    "In-person visits, with photos and notes",
    "Check-in visits, and someone to go with your parent to appointments",
  ],
  cta: { label: "Get help finding care", href: "/help" },
  // PLACEHOLDER: set the real starting price.
  price: "From [YOUR PRICE]",
  sampleReport: {
    label: "Sample visit report",
    title: "What you receive",
    rows: ["Date visited", "Licences seen", "Nurse on site", "Price quoted"],
    note: "Two or three plain sentences from the person who visited.",
  },
} as const;

export const guidesSection = {
  eyebrow: "Guides",
  heading: "Plain answers for families",
  all: { label: "All guides", href: "/guides" },
  featured: [
    "elder-care-costs-cebu",
    "checking-a-caregiver-from-overseas",
    "leaving-hospital",
  ] satisfies GuideSlug[],
} as const;

export const founder = {
  eyebrow: "Our story",
  heading: "Built between Australia and Cebu",
  body: "BackHome was started by Yahnee and Martin, a Filipino-Australian family based in Australia. We know how hard it is to find care for a parent from far away, when the only options are a Facebook page and a relative's recommendation, so we're building the list we wished we had.",
  // No photo until a real founder portrait is supplied. To add one, put it in
  // public/media with a version suffix and add an `image` here, then render
  // it in components/home/founder-and-providers.tsx.
} as const;

export const providersCard = {
  eyebrow: "For providers",
  heading: "Run a care service in Cebu?",
  body: "Get listed for free. Families here and abroad are looking for caregivers, nurses and care homes they can trust.",
  cta: { label: "List your service", href: "/for-providers" },
} as const;

export const closing = {
  heading: "You may be overseas. Your responsibilities are still back home.",
  body: "Find checked elder care in Cebu, or let us help you find it.",
  primary: { label: "Find care in Cebu", href: "/#find-care" },
  secondary: { label: "Get help finding care", href: "/help" },
} as const;

export const footer = {
  description:
    "BackHome is a checked directory of elder care services in Cebu, for Filipino families near and far.",
  backhomeLinks: [
    ...(hasPublishedGuides ? [{ label: "Guides", href: "/guides" }] : []),
    { label: "How we check", href: "/how-we-check" },
    { label: "Get help finding care", href: "/help" },
    { label: "For providers", href: "/for-providers" },
  ],
  contactLinks: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  disclaimer:
    "BackHome is a directory, not a care provider. We don't provide medical or emergency services. Please make your own checks before hiring anyone.",
} as const;
