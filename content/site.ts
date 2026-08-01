/* ---------------------------------------------------------------------------
   BackHome — single source of truth for all page copy.

   Everything the founders are likely to want to reword lives here, so the
   section components stay purely presentational. Edit text in this file; you
   should not need to touch any .tsx file to change wording.

   Image slots reference files in /public/placeholders — see that folder's
   README.md for the photo brief for each one.
--------------------------------------------------------------------------- */

export type IconName =
  | "calendar"
  | "check-in"
  | "wrench"
  | "recovery"
  | "shield"
  | "receipt"
  | "heart"
  | "scope"
  | "visit"
  | "pill"
  | "home"
  | "warning";

export const site = {
  name: "BackHome",
  tagline: "Trusted family support in Cebu",
  // PLACEHOLDER: replace with the real contact address before launch.
  contactEmail: "hello@backhome.example",
  serviceArea: "Cebu, Philippines",
} as const;

export const nav = {
  links: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Pilot services", href: "#pilot-services" },
    { label: "Why BackHome", href: "#why-backhome" },
  ],
  cta: { label: "Join the pilot", href: "#join" },
} as const;

export const hero = {
  eyebrow: "Australia to Cebu pilot",
  heading: "Trusted help in Cebu when you can't be there",
  body: "BackHome helps overseas Filipinos coordinate practical support for parents, relatives and homes in Cebu—from family check-ins and appointments to household tasks and property concerns.",
  primaryCta: { label: "Express interest in the pilot", href: "#join" },
  secondaryCta: { label: "See how it could work", href: "#how-it-works" },
  reassurance:
    "The pilot will initially be limited to a small number of Cebu families.",
  trustCard: "Someone local. Clear updates. Less worry from afar.",
  image: {
    // Full-bleed hero — needs a wide landscape crop.
    src: "/placeholders/hero-family-call.svg",
    width: 1920,
    height: 1080,
    alt: "An adult child living overseas on a video call with their parents at home in Cebu, both smiling.",
  },
} as const;

export const scenarios = {
  heading: "Being far away makes simple things difficult",
  intro:
    "Sending money home may be easy. Coordinating what actually needs to happen can be much harder.",
  cards: [
    {
      icon: "calendar" as IconName,
      title: "Mum needs help getting to an appointment",
      body: "You want someone reliable to accompany her, help with the practical details and let you know how everything went.",
    },
    {
      icon: "check-in" as IconName,
      title: "You need someone to check in",
      body: "A family member has not answered, something feels wrong, or you simply want reassurance that they are okay.",
    },
    {
      icon: "wrench" as IconName,
      title: "A repair needs to be organised",
      body: "You need someone local to coordinate the work, verify what was completed and provide photos or receipts.",
    },
    {
      icon: "recovery" as IconName,
      title: "Your family needs support after hospital",
      body: "There may be transport, medication, household or follow-up tasks that are difficult to manage remotely.",
    },
  ],
} as const;

export const process = {
  heading: "Practical support without coordinating everything yourself",
  steps: [
    {
      number: "01",
      title: "Tell us what your family needs",
      body: "Explain the situation, who needs support and what outcome you are trying to arrange.",
    },
    {
      number: "02",
      title: "BackHome coordinates locally",
      body: "A Cebu-based coordinator arranges the task directly or connects the right trusted local support.",
    },
    {
      number: "03",
      title: "You receive clear updates",
      body: "Get progress messages, photos, receipts and confirmation that the task has been completed.",
    },
  ],
  note: "The exact pilot service model is still being designed with participating families.",
} as const;

export const services = {
  heading: "Services being considered for the Cebu pilot",
  intro:
    "The initial pilot will focus on practical, clearly defined support that can be coordinated and verified.",
  cards: [
    {
      icon: "visit" as IconName,
      title: "Family welfare visits",
      body: "Respectful in-person check-ins and clear updates for overseas relatives.",
    },
    {
      icon: "calendar" as IconName,
      title: "Appointment accompaniment",
      body: "Practical support before, during and after selected appointments.",
    },
    {
      icon: "pill" as IconName,
      title: "Medication and essential pickups",
      body: "Coordination of approved collections and household essentials.",
    },
    {
      icon: "wrench" as IconName,
      title: "Home repair coordination",
      body: "Help sourcing providers, arranging access and verifying completion.",
    },
    {
      icon: "home" as IconName,
      title: "Property checks",
      body: "Photo-supported inspections for homes, units or family properties.",
    },
    {
      icon: "recovery" as IconName,
      title: "Post-hospital practical support",
      body: "Non-clinical coordination of transport, household tasks and follow-up needs.",
    },
  ],
  disclaimer:
    "BackHome will not provide emergency response, medical advice or regulated clinical services. Qualified professionals will be used where required.",
} as const;

export const trust = {
  heading: "You should not have to rely on vague updates",
  principles: [
    {
      icon: "shield" as IconName,
      title: "Someone accountable",
      body: "BackHome becomes the clear point of contact responsible for coordinating the agreed task.",
    },
    {
      icon: "receipt" as IconName,
      title: "Proof of completion",
      body: "Receive photos, receipts, status updates and a clear summary where appropriate.",
    },
    {
      icon: "heart" as IconName,
      title: "Respect for your family",
      body: "Support should feel helpful and dignified—not intrusive or controlling.",
    },
    {
      icon: "scope" as IconName,
      title: "Clear service boundaries",
      body: "Every task will have a defined scope, price and expected outcome before work begins.",
    },
  ],
  image: {
    src: "/placeholders/trust-coordinator.svg",
    width: 900,
    height: 1100,
    alt: "A friendly local coordinator sitting and talking with an older family member in a Cebu home.",
  },
} as const;

export const founder = {
  heading: "Built between Australia and Cebu",
  paragraphs: [
    "BackHome is being created by Martin and his wife, a Filipino-Australian family preparing to move from Canberra to Cebu.",
    "The idea came from seeing how difficult it can be for families overseas to coordinate practical responsibilities back home. Too often, the only option is to send money, message a relative and hope someone has the time to follow through.",
    "BackHome is being designed as a more accountable alternative: trusted local coordination, respectful support and clear updates for families living abroad.",
  ],
  note: "We are starting carefully in Cebu and speaking directly with families before finalising the service.",
  image: {
    src: "/placeholders/founders.svg",
    width: 1000,
    height: 1000,
    alt: "Martin and his wife, the founders of BackHome, photographed together at home.",
  },
} as const;

export const interest = {
  heading: "Help shape the BackHome Cebu pilot",
  intro:
    "We are inviting overseas Filipinos with parents, relatives or property in Cebu to express interest and tell us what support would be most useful.",
  submitLabel: "Express interest",
  submittingLabel: "Sending…",
  footnote:
    "No payment is required. Expressing interest does not commit you to joining the pilot.",
  success: {
    heading: "Thank you — we have your details",
    body: "We will be in touch as the Cebu pilot takes shape. If you offered a short research call, we may reach out to hear more about your situation.",
    footnote: "Nothing is committed and no payment is required.",
  },
  // Two things the pilot genuinely has not settled yet. Stated plainly so
  // nobody infers a price or a service area that has not been committed to.
  // Shown beside the form in both its empty and submitted states.
  stillDeciding: {
    label: "Still being decided",
    items: [
      {
        title: "Pricing",
        body: "Pilot pricing has not been finalised. We are researching whether families prefer one-off task pricing, monthly support plans, or a combination of both.",
      },
      {
        title: "Service area",
        body: "The initial service area will depend on pilot demand and local operating capacity. That is why we ask where your family is — it directly shapes where we start.",
      },
    ],
  },
} as const;

export const finalCta = {
  heading: "You may be overseas. Your responsibilities are still back home.",
  body: "BackHome is being built so you no longer have to coordinate everything alone.",
  cta: { label: "Join the Cebu pilot waitlist", href: "#join" },
  note: "Limited initial pilot. No obligation to participate.",
} as const;

export const footer = {
  description:
    "BackHome helps overseas Filipinos coordinate practical support for parents, relatives and homes in Cebu.",
  serviceAreaLabel: "Pilot service area",
  links: [
    // PLACEHOLDER: point these at real policy pages before collecting live data.
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
  disclaimer:
    "BackHome is currently in pilot development. Services described are subject to change.",
} as const;
