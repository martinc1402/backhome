/* ---------------------------------------------------------------------------
   Copy for /help and /for-providers. Edit wording here; the page components
   only lay it out.
--------------------------------------------------------------------------- */

export const helpPage = {
  title: "Get help finding care | BackHome",
  description:
    "Too far away to do the legwork? We shortlist checked care providers in Cebu, visit them, and send you a report with photos and notes.",
  eyebrow: "BackHome help",
  heading: "Get help finding care",
  intro:
    "The directory is free to use. If you're too far away to do the legwork yourself, our Cebu team can do it for you.",
  offer: {
    heading: "What we do",
    steps: [
      {
        title: "We shortlist 3 checked providers",
        body: "Based on what your parent needs, where they live and your budget.",
      },
      {
        title: "We visit them in person",
        body: "We see the place or meet the carer, check permits and licences, and ask the questions you would.",
      },
      {
        title: "You get a report with photos and notes",
        body: "Plain notes from the person who visited, so you can decide from wherever you are.",
      },
    ],
    ongoingHeading: "Once care is in place, we can also",
    ongoing: [
      "Visit your parent regularly and send you an update after each visit",
      "Go with your parent to doctor's appointments",
      "Collect medicines from the pharmacy",
      "Help in the first weeks after a hospital stay, while you arrange longer-term care",
    ],
    // PLACEHOLDER: set the real starting price.
    price: "From [YOUR PRICE]",
    priceNote:
      "We agree what you need and the price by email before any work starts. We never take payment through this website.",
  },
  next: {
    heading: "What happens next",
    steps: [
      "We read what you've sent and reply by email, usually with a few questions.",
      "We agree what you need and the price before anything starts.",
      "If you'd rather just use the directory, that's fine too. It's free.",
    ],
  },
  form: {
    heading: "Tell us what's happening",
    submit: "Send to BackHome",
    privacy:
      "We collect these details only to reply to you and help find care for your parent. We won't share them with any provider or anyone else without your permission.",
    success: {
      heading: "Thank you. We've got your message.",
      body: "We'll reply by email. If you gave a WhatsApp number we may message you there too.",
    },
    fromListing: "You're asking about",
  },
} as const;

export const providersPage = {
  title: "List your care service for free | BackHome",
  description:
    "Run a care service in Metro Cebu? Get listed on BackHome for free and reach families in Cebu and overseas who are looking for care they can trust.",
  eyebrow: "For providers",
  heading: "Run a care service in Cebu? Get listed for free.",
  intro:
    "Families in Cebu and overseas use BackHome to find caregivers, nurses, doctors and care homes they can trust. Listing is free.",
  who: {
    heading: "Who can list",
    body: "Caregivers and caregiver agencies, home nurses and therapists, doctors who see older patients, care homes, assisted living and day centres in Cebu City, Mandaue, Lapu-Lapu and Talisay. If you offer something else for older people, tell us anyway.",
  },
  how: {
    heading: "How listing works",
    steps: [
      {
        title: "Tell us about your service",
        body: "Fill in the form below. We'll reply by email.",
      },
      {
        title: "We check your details",
        body: "We confirm your details with you before anything is published. Your listing shows how we checked it: by phone, or in person.",
      },
      {
        title: "We keep it current",
        body: "We re-check every 6 months. If a family reports a problem, we'll talk to you before deciding what to do.",
      },
    ],
    documents:
      "Have your business permit and any DOH, DSWD, DOLE or PRC licences ready. We check these before a listing gets a badge.",
  },
  form: {
    heading: "List your service",
    submit: "Send listing request",
    privacy:
      "We collect these details only to contact you about listing your service. We publish a listing only after confirming the details with you, and we won't share your personal contact details without your permission.",
    success: {
      heading: "Thank you. We've got your details.",
      body: "We'll reply by email to confirm your details and arrange a call or visit.",
    },
  },
} as const;

export const howWeCheckPage = {
  title: "How we check care providers in Cebu | BackHome",
  description:
    "What the Visited, Called and Listed badges mean, which permits and licences we look at, how often we re-check, and what happens when a family reports a problem.",
  eyebrow: "How we check",
  heading: "Every listing shows how and when we checked it",
  intro:
    "You shouldn't have to take a stranger's word for it. Each listing in the directory carries one of three levels, with the date we last checked it, so you can see exactly how much we know.",
  levels: [
    {
      level: "visited",
      label: "Visited",
      title: "Seen in person",
      body: "Someone from our Cebu team has been to the provider: the care home, the clinic, or the agency's office. We've met the people in charge, checked their permits and licences, asked the questions a family would ask, and taken photos.",
    },
    {
      level: "called",
      label: "Called",
      title: "Checked by phone and online",
      body: "We've spoken to the provider by phone, confirmed what they offer and roughly what it costs, and checked the permits and licences we can verify online. We haven't been in person yet.",
    },
    {
      level: "listed",
      label: "Listed",
      title: "Not checked yet",
      body: "The provider sent us their details and we've published them, but we haven't called or visited. Treat these as a starting point and do your own checks.",
    },
  ],
  documents: {
    heading: "What we look at",
    intro: "Which documents apply depends on the kind of service. Where they apply, we ask to see:",
    items: [
      "A current business or mayor's permit from the city",
      "PRC licences for nurses, therapists and doctors",
      "A DOH licence for facilities that need one",
      "DSWD registration or accreditation for residential care and day centres, where it applies",
      "DOLE registration for agencies that place caregivers",
    ],
    // [CHECK] Confirm with the Cebu team which licence applies to which kind
    // of provider before publishing this list as final.
    note: "Each listing shows the licences we checked, their numbers, and the date we checked them. [CHECK: confirm which licence applies to which kind of provider.]",
  },
  lifecycle: {
    heading: "Keeping checks current",
    items: [
      {
        title: "We re-check every 6 months",
        body: "A check is a snapshot. Prices, staff and licences change, so each badge is valid for 6 months from the date shown.",
      },
      {
        title: "Badges lapse automatically",
        body: "If we haven't re-checked a provider in 6 months, the badge changes to \"Check lapsed\" and shows when we last checked. The listing stays up, but it's no longer shown as checked.",
      },
      {
        title: "Problems take the badge down",
        body: "If a family reports a problem, we take the badge down and show the listing as \"Under review\" until we've looked into it. We talk to the family and the provider before deciding what to do.",
      },
    ],
  },
  limits: {
    heading: "What a check is not",
    body: "A check tells you what we saw and were told on the date shown. It isn't a guarantee about the quality of care, and it isn't medical advice. Please confirm prices and details with the provider, and visit or arrange a video call before you commit.",
  },
  money: {
    heading: "Providers can't pay for a badge",
    // [CHECK] Confirm this stays true.
    body: "Listing is free, and a provider's check level and position in the directory don't depend on payment. [CHECK: confirm providers never pay to be listed, for placement or a referral fee.]",
  },
  report: {
    heading: "Seen something wrong?",
    body: "If a listing is out of date, or you've had a problem with a provider, tell us. Every listing has a \"Report a problem\" link, or you can email us directly.",
  },
} as const;
