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
  contactEmail: "hello@backhome.ph",
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
  eyebrow: "Starting in Cebu",
  heading: "Trusted help back home when you can't be there",
  body: "BackHome helps overseas Filipinos coordinate practical support for parents, relatives and homes in Cebu—from family check-ins and appointments to household tasks and property concerns.",
  primaryCta: { label: "Express interest in the pilot", href: "#join" },
  secondaryCta: { label: "See how it could work", href: "#how-it-works" },
  reassurance:
    "The pilot will initially be limited to a small number of Cebu families.",
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

export const scenarios = {
  /** Opens the section as a standalone statement line, above the heading. */
  lead: "Someone local. Clear updates. Less worry from afar.",
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
    "BackHome was created by Yahnee and Martin, a Filipino-Australian family preparing to move from Canberra to Cebu.",
    "The idea came from seeing how difficult it can be for families overseas to coordinate practical responsibilities back home. Too often, the only option is to send money, message a relative and hope someone has the time to follow through.",
    "BackHome is being designed as a more accountable alternative: trusted local coordination, respectful support and clear updates for families living abroad.",
  ],
  note: "We are starting carefully in Cebu and speaking directly with families before finalising the service.",
  /**
   * Real photograph, not a placeholder. Served with Cache-Control: immutable
   * (next.config.ts) — bump the version suffix on any change, and never
   * overwrite a version already served.
   *
   * NOTE: this is a pharmacy pickup, not a portrait of the founders. The alt
   * text describes what is actually in the frame rather than naming Yahnee and
   * Martin, because the people shown are not them. If a founder portrait
   * arrives later this slot should take it, and this image would sit more
   * naturally against the "Medication and essential pickups" service.
   */
  image: {
    src: "/media/pharmacy-pickup.v1.webp",
    width: 1280,
    height: 1280,
    alt: "A pharmacist handing a paper bag of medication across the counter to a customer collecting it.",
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
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  disclaimer:
    "BackHome is currently in pilot development. Services described are subject to change.",
} as const;
