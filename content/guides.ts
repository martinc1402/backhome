/* ---------------------------------------------------------------------------
   Guides. The homepage links to these; /guides/[slug] renders them.

   Slugs are permanent once published. The bodies are still to be written.
--------------------------------------------------------------------------- */

export type Guide = {
  slug: string;
  title: string;
  /** Short topic label shown above the title on cards. */
  topic: string;
  summary: string;
};

export const GUIDES = [
  {
    slug: "elder-care-costs-cebu",
    title: "What elder care costs in Cebu",
    topic: "Costs",
    summary:
      "Caregivers, home nurses and care homes, and what's usually included.",
  },
  {
    slug: "checking-a-caregiver-from-overseas",
    title: "How to check out a caregiver from overseas",
    topic: "Hiring",
    summary: "Questions to ask, documents to see, and warning signs.",
  },
  {
    slug: "leaving-hospital",
    title: "Leaving hospital: what to arrange",
    topic: "After hospital",
    summary: "Medicines, equipment, follow-up visits and help at home.",
  },
  {
    slug: "memory-loss-and-dementia",
    title: "When a parent is getting forgetful",
    topic: "Memory",
    summary:
      "Getting a memory assessment at home, and how to find carers with dementia experience.",
  },
  {
    slug: "when-a-caregiver-quits",
    title: "When your caregiver quits suddenly",
    topic: "Caregivers",
    summary: "Short-term cover while you find someone permanent.",
  },
  {
    slug: "weekly-check-ins",
    title: "Arranging someone to check in each week",
    topic: "Check-ins",
    summary: "Visiting carers, and BackHome check-in visits with updates for you.",
  },
] as const satisfies readonly Guide[];

export type GuideSlug = (typeof GUIDES)[number]["slug"];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
