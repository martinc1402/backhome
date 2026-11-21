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
