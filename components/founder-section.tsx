import { founder } from "@/content/site";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { PlaceholderImage } from "@/components/ui/placeholder-image";
import { QuoteBlock } from "@/components/quote-block";

export function FounderSection() {
  return (
    <>
      <Section tone="cream">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1fr] lg:items-center lg:gap-20">
          <PlaceholderImage
            src={founder.image.src}
            alt={founder.image.alt}
            width={founder.image.width}
            height={founder.image.height}
            sizes="(min-width: 1024px) 28rem, 100vw"
            className="aspect-square"
          />

          <div>
            <SectionHeading eyebrow="Founder story" heading={founder.heading} />

            <div className="mt-8 space-y-6">
              {founder.paragraphs.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-bark">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* The founders' own words in the oversized pull-quote treatment.
          Not a customer testimonial — BackHome has no customers yet. */}
      <Section tone="base" compact>
        <div className="mx-auto max-w-3xl">
          <QuoteBlock attribution="Martin" role="co-founder, BackHome">
            {founder.note}
          </QuoteBlock>
        </div>
      </Section>
    </>
  );
}
