/* ---------------------------------------------------------------------------
   Guides. The homepage links to these; /guides/[slug] renders them.

   Slugs are permanent once published. The bodies are still to be written:
   each guide is a shell with an outline marked [TO WRITE].

   Shells are noindexed and left out of the sitemap. When a guide is written,
   replace its outline with the real sections and set `written: true`.
--------------------------------------------------------------------------- */

export type Guide = {
  slug: string;
  title: string;
  /** Short topic label shown above the title on cards. */
  topic: string;
  summary: string;
  /** False while the guide is a shell. Unwritten guides are noindexed. */
  written: boolean;
  /** Section headings, each with a note on what it should cover. */
  sections: readonly { heading: string; toWrite: string }[];
};

export const GUIDES = [
  {
    slug: "elder-care-costs-cebu",
    title: "What elder care costs in Cebu",
    topic: "Costs",
    summary:
      "Caregivers, home nurses and care homes, and what's usually included.",
    written: false,
    sections: [
      {
        heading: "Caregivers at home",
        toWrite: "Live-in and hourly rates, what's usually included (food, days off, SSS, PhilHealth and Pag-IBIG contributions), and agency versus direct hire.",
      },
      {
        heading: "Home nurses and therapists",
        toWrite: "Per-visit and per-session costs, and when a nurse is needed rather than a caregiver.",
      },
      {
        heading: "Care homes and day centres",
        toWrite: "Monthly fees, what's included, and common extras.",
      },
      {
        heading: "What PhilHealth and HMOs cover",
        toWrite: "What they do and don't pay for.",
      },
      {
        heading: "Getting a quote",
        toWrite: "What to ask so quotes can be compared fairly.",
      },
    ],
  },
  {
    slug: "checking-a-caregiver-from-overseas",
    title: "How to check out a caregiver from overseas",
    topic: "Hiring",
    summary: "Questions to ask, documents to see, and warning signs.",
    written: false,
    sections: [
      {
        heading: "Before the interview",
        toWrite: "What to ask for in advance: ID, NBI clearance, references, any TESDA certificate.",
      },
      {
        heading: "The video interview",
        toWrite: "Questions to ask, and how to include your parent.",
      },
      {
        heading: "Checking references and documents",
        toWrite: "How to verify them from abroad.",
      },
      {
        heading: "Warning signs",
        toWrite: "Things that should make you pause.",
      },
      {
        heading: "The first weeks",
        toWrite: "Trial periods, check-ins, and who to call if something goes wrong.",
      },
    ],
  },
  {
    slug: "leaving-hospital",
    title: "Leaving hospital: what to arrange",
    topic: "After hospital",
    summary: "Medicines, equipment, follow-up visits and help at home.",
    written: false,
    sections: [
      {
        heading: "Before discharge",
        toWrite: "Questions to ask the hospital team, and paperwork to collect.",
      },
      {
        heading: "Medicines and equipment",
        toWrite: "Getting prescriptions filled, and renting or buying equipment.",
      },
      {
        heading: "Follow-up visits",
        toWrite: "Doctor's appointments, and home nurse or therapy visits.",
      },
      {
        heading: "Help at home",
        toWrite: "Short-term caregivers while you arrange longer-term care.",
      },
      {
        heading: "When you're overseas",
        toWrite: "Who can be there on the day.",
      },
    ],
  },
  {
    slug: "memory-loss-and-dementia",
    title: "When a parent is getting forgetful",
    topic: "Memory",
    summary:
      "Getting a memory assessment at home, and how to find carers with dementia experience.",
    written: false,
    sections: [
      {
        heading: "Signs to look out for",
        toWrite: "Everyday changes families notice first.",
      },
      {
        heading: "Getting an assessment",
        toWrite: "Who does memory assessments in Cebu, including at home.",
      },
      {
        heading: "Carers with dementia experience",
        toWrite: "What to ask, and how the directory's dementia filter works.",
      },
      {
        heading: "Keeping your parent safe at home",
        toWrite: "Simple changes that help.",
      },
      {
        heading: "Support for the family",
        toWrite: "Where to find help for yourselves.",
      },
    ],
  },
  {
    slug: "when-a-caregiver-quits",
    title: "When your caregiver quits suddenly",
    topic: "Caregivers",
    summary: "Short-term cover while you find someone permanent.",
    written: false,
    sections: [
      {
        heading: "The first 48 hours",
        toWrite: "Who can step in straight away.",
      },
      {
        heading: "Short-term cover",
        toWrite: "Agencies, relief caregivers and family rotas.",
      },
      {
        heading: "Finding someone permanent",
        toWrite: "How to avoid rushing the decision.",
      },
      {
        heading: "What you owe the caregiver who left",
        toWrite: "Final pay and documents. [CHECK against Kasambahay Law rules]",
      },
      {
        heading: "Making the next arrangement last",
        toWrite: "What helps caregivers stay.",
      },
    ],
  },
  {
    slug: "weekly-check-ins",
    title: "Arranging someone to check in each week",
    topic: "Check-ins",
    summary: "Visiting carers, and BackHome check-in visits with updates for you.",
    written: false,
    sections: [
      {
        heading: "Why regular check-ins help",
        toWrite: "Catching small problems early.",
      },
      {
        heading: "Who can do them",
        toWrite: "Family, neighbours, visiting carers, or BackHome check-in visits.",
      },
      {
        heading: "What a good check-in covers",
        toWrite: "A simple list to agree on.",
      },
      {
        heading: "Getting updates when you're abroad",
        toWrite: "Photos, messages and video calls.",
      },
      {
        heading: "When a check-in raises a concern",
        toWrite: "What to do next.",
      },
    ],
  },
] as const satisfies readonly Guide[];

export type GuideSlug = (typeof GUIDES)[number]["slug"];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
