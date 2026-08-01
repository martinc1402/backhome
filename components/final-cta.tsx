import { finalCta } from "@/content/site";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";

export function FinalCta() {
  return (
    <Section tone="lime" compact>
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="type-h2 text-forest">{finalCta.heading}</h2>
        <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-forest/80">
          {finalCta.body}
        </p>
        <div className="mt-10">
          <ButtonLink
            href={finalCta.cta.href}
            variant="solid"
            size="lg"
            className="w-full sm:w-auto"
          >
            {finalCta.cta.label}
          </ButtonLink>
        </div>
        <p className="mt-6 text-sm text-forest/75">{finalCta.note}</p>
      </div>
    </Section>
  );
}
