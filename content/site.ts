/* ---------------------------------------------------------------------------
   BackHome — single source of truth for all page copy.

   Everything the founders are likely to want to reword lives here, so the
   section components stay purely presentational. Edit text in this file; you
   should not need to touch any .tsx file to change wording.

   Nothing on this page may claim a track record BackHome does not have yet: no
   facility counts, no families helped, no testimonials, no partner logos, no
   review scores. Nothing is listed and nobody has signed up. Every line here
   has to stay true on the day it is read.
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
  tagline: "Find trusted senior care in Cebu",
  contactEmail: "hello@backhome.ph",
  serviceArea: "Cebu, Philippines",
} as const;

export const nav = {
  links: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Care types", href: "#care-types" },
    { label: "Why BackHome", href: "#why-backhome" },
  ],
  cta: { label: "Get a shortlist", href: "#get-a-shortlist" },
} as const;

export const hero = {
  eyebrow: "Starting in Cebu",
  heading: "Find trusted care back home when you can't be there",
  body: "BackHome helps overseas Filipinos find senior care in Cebu — nursing homes, assisted living, live-in caregivers and home-care agencies — with real monthly prices and visits in person, so you can choose with confidence from anywhere.",
  primaryCta: { label: "Get a shortlist", href: "#get-a-shortlist" },
  secondaryCta: { label: "See how it works", href: "#how-it-works" },
  reassurance:
    "We are starting in Metro Cebu and will grow as we verify more options.",
  /**
   * Full-bleed hero background. Exactly one asset is fetched per viewport,
   * never both — the gate is `<source media>`, not CSS, because a CSS-hidden
   * <video> or <img> still downloads. See components/hero-media.tsx.
   *
   * The clip is a single one-shot reveal: an older parent's phone screen
   * lighting up as a call comes through. It plays once and holds on the lit
   * final frame. It has no audio track and is deliberately never looped —
   * looping would hard-cut back to a dark screen every five seconds.
   *
   * Regenerate from the masters with the commands in design/README.md. Bump
   * the .v1 suffix here and in the filename on any change: these are served
   * with Cache-Control: immutable (next.config.ts).
   */
  media: {
    /** ≥768px only. */
    video: {
      src: "/media/hero-cebu-call.v1.mp4",
      type: "video/mp4",
      width: 1920,
      height: 1070,
      /** Documentation and QA only; the component does not read this. */
      durationSeconds: 5.04,
    },
    /**
     * The clip's FIRST frame, phone screen dark. Must be the first frame —
     * a poster of the lit end state would visibly jump back to dark the
     * instant playback starts.
     */
    poster: {
      src: "/media/hero-cebu-call-poster.v1.jpg",
      width: 960,
      height: 536,
    },
    /**
     * <768px. The clip's LAST frame, phone screen lit, pre-cropped to a
     * portrait box around the hands. The crop is baked at asset-prep time
     * because object-cover on the full landscape frame keeps only ~26% of its
     * width on a phone and centres on empty wall.
     */
    mobileStill: {
      src: "/media/hero-cebu-call-still.v1.jpg",
      width: 1440,
      height: 2618,
    },
    /**
     * The media layer is decorative — the still carries alt="" and the video
     * is aria-hidden (see components/hero-media.tsx). This is a brief for
     * whoever recuts the footage, not rendered copy.
     */
    description:
      "An older parent in Cebu sitting with a phone held in both hands; the screen lights up as a call comes through from family overseas. Warm sunlit wall behind.",
  },
} as const;

export const problem = {
  /** Opens the section as a standalone statement line, above the heading. */
  lead: "Visited in person. Real prices. Less guesswork from afar.",
  heading: "Choosing care from overseas is harder than it should be",
  intro:
    "Most homes and agencies in Cebu only exist on Facebook. Prices are rarely published. Visiting is not an option when you are thousands of kilometres away.",
  cards: [
    {
      icon: "check-in" as IconName,
      title: "Mum can't live alone anymore",
      body: "You need to know which homes take her care level, what they cost, and whether they have a place.",
    },
    {
      icon: "recovery" as IconName,
      title: "Dad is coming out of hospital",
      body: "You need care in place within days, without knowing who is reliable.",
    },
    {
      icon: "visit" as IconName,
      title: "We need a live-in caregiver",
      body: "Agencies, freelancers and referrals from relatives all cost different amounts, and you cannot check them yourself.",
    },
    {
      icon: "home" as IconName,
      title: "We're comparing homes from overseas",
      body: "Photos on a Facebook page do not tell you about staffing, cleanliness or what is billed as extra.",
    },
  ],
} as const;

export const process = {
  heading: "The legwork you'd do yourself if you were there",
  steps: [
    {
      number: "01",
      title: "Tell us about your parent",
      body: "Where they are, what care they need, your timing and budget.",
    },
    {
      number: "02",
      title: "We shortlist verified options",
      body: "Places and agencies we have called and visited, with monthly prices and what is included.",
    },
    {
      number: "03",
      title: "You choose, we arrange",
      body: "Video tours, introductions and the practical next steps.",
    },
  ],
  note: "During the pilot we handle each family personally.",
} as const;

export const careTypes = {
  heading: "Care we are verifying in Metro Cebu",
  intro:
    "For each option we confirm monthly rates, care levels accepted, nurse coverage and vacancies, and visit in person where we can.",
  /**
   * Four categories, not a service menu. These are deliberately NOT links:
   * there are no listing pages yet, and a tile that goes nowhere is worse than
   * a tile that plainly does not move. See components/care-types-section.tsx.
   */
  cards: [
    {
      icon: "home" as IconName,
      title: "Nursing homes and assisted living",
      body: "Residential places where your parent lives on site, with staff on hand day and night.",
    },
    {
      icon: "visit" as IconName,
      title: "Live-in caregivers",
      body: "One carer who lives in the family home and looks after your parent day to day.",
    },
    {
      icon: "calendar" as IconName,
      title: "Home-care agencies (shift-based)",
      body: "Carers who come to the house for set hours or shifts, arranged through an agency.",
    },
    {
      icon: "recovery" as IconName,
      title: "Post-hospital care",
      body: "Short-term care after a hospital stay, at home or in a residential place, while your parent recovers.",
    },
  ],
  disclaimer:
    "BackHome is not a care provider. We do not give medical advice, provide emergency response or regulated clinical services. We verify options and help you choose.",
} as const;

export const trust = {
  heading: "You should not have to choose from a Facebook page",
  principles: [
    {
      icon: "visit" as IconName,
      title: "Visited in person",
      body: "Dated visit notes and photos, staff on shift, what the place is actually like.",
    },
    {
      icon: "receipt" as IconName,
      title: "Real prices",
      body: "Monthly rates confirmed by phone, including what is billed as extra.",
    },
    {
      icon: "heart" as IconName,
      title: "Honest about money",
      body: "Facilities may pay us a referral fee. Families never pay, and fees never change what we show you.",
    },
    {
      icon: "scope" as IconName,
      title: "Clear boundaries",
      body: "We are not a care provider and will say so when a need is beyond what we can help with.",
    },
  ],
  /**
   * Real photograph, not a placeholder. Served with Cache-Control: immutable
   * (next.config.ts), so bump the version suffix on any recrop or re-export.
   *
   * v3 trims 64px off the right edge of the delivered frame. The master ends
   * on a sunlit door jamb — flat, blown out and almost featureless — which at
   * the container's crop read as a white border rather than as part of the
   * room. See design/README.md for the crop command.
   */
  image: {
    src: "/media/trust-coordinator.v3.webp",
    width: 1216,
    height: 1589,
    alt: "A local coordinator sitting and laughing with an older couple on the shaded porch of their home in Cebu.",
  },
} as const;

export const founder = {
  heading: "Built between Australia and Cebu",
  paragraphs: [
    "BackHome was created by Yahnee and Martin, a Filipino-Australian family based in Australia.",
    "The idea came from seeing how hard it is to find and compare care for a parent from overseas, when the only options are a Facebook page and a relative's recommendation.",
    "We visit Cebu regularly and are building BackHome by calling and visiting homes and agencies ourselves.",
  ],
  note: "We are starting in Cebu, visiting homes ourselves and speaking with families before we list anything.",
  /**
   * Real photograph, not a placeholder. Served with Cache-Control: immutable
   * (next.config.ts) — bump the version suffix on any change, and never
   * overwrite a version already served.
   *
   * NOTE: this is a pharmacy pickup, not a portrait of the founders. The alt
   * text describes what is actually in the frame rather than naming Yahnee and
   * Martin, because the people shown are not them. It stays here as the only
   * remaining slot for it now that the old services section is gone; if a real
   * founder portrait arrives, this slot should take it.
   */
  image: {
    src: "/media/pharmacy-pickup.v1.webp",
    width: 1280,
    height: 1280,
    alt: "A pharmacist handing a paper bag of medication across the counter to a customer collecting it.",
  },
} as const;

export const enquiry = {
  heading: "Tell us about your parent",
  intro:
    "We will send verified options as we confirm them, and can talk it through on a call. There is no cost to families.",
  submitLabel: "Get a shortlist",
  submittingLabel: "Sending…",
  footnote: "No payment is required. We will reply personally.",
  success: {
    heading: "Thank you — we have your details",
    body: "We will send verified care options as we confirm them, and we will reply personally. If you asked for a call, we will suggest a time.",
    footnote: "There is no cost to families and no payment is required.",
  },
  // Two things people reasonably want to know before typing anything: who pays
  // us, and where we actually operate. Both are settled, so this block states
  // them rather than hedging. Shown beside the form in both its empty and
  // submitted states.
  practicalities: {
    label: "Practical details",
    items: [
      {
        title: "How we are paid",
        body: "Facilities may pay us a referral fee once a resident has settled in. Families never pay, and a fee never affects what we show you or the order we show it in.",
      },
      {
        title: "Service area",
        body: "Metro Cebu for now — Cebu City, Mandaue, Lapu-Lapu and the towns around them. We will grow as we verify more of the province.",
      },
    ],
  },
} as const;

export const finalCta = {
  heading: "You may be overseas. Your responsibilities are still back home.",
  body: "BackHome does the legwork in Cebu so you can choose care with confidence.",
  cta: { label: "Tell us about your parent", href: "#get-a-shortlist" },
  note: "No cost to families. No obligation.",
} as const;

export const footer = {
  description:
    "BackHome helps overseas Filipinos find senior care in Cebu — nursing homes, assisted living, live-in caregivers and home-care agencies — with real prices and visits in person.",
  serviceAreaLabel: "Service area",
  links: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  disclaimer:
    "BackHome is not a care provider. We are starting in Metro Cebu and nothing is listed yet.",
} as const;
