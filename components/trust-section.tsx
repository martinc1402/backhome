import { trust } from "@/content/site";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Icon } from "@/components/ui/icon";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

export function TrustSection() {
  return (
    <Section id="why-backhome" tone="forest">
      <div className="grid gap-14 lg:grid-cols-[1fr_0.72fr] lg:items-center lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Trust and accountability"
            heading={trust.heading}
            onDark
          />

          <ul className="mt-14 grid gap-10 sm:grid-cols-2 sm:gap-x-10">
            {trust.principles.map((principle) => (
              <li key={principle.title} className="border-t border-cream/20 pt-6">
                <span className="text-lime">
                  <Icon name={principle.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-serif text-xl text-cream">
                  {principle.title}
                </h3>
                <p className="mt-3 leading-relaxed text-cream/75">
                  {principle.body}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <PlaceholderImage
          src={trust.image.src}
          alt={trust.image.alt}
          width={trust.image.width}
          height={trust.image.height}
          sizes="(min-width: 1024px) 26rem, 100vw"
          className="aspect-4/5 lg:aspect-3/4"
        />
      </div>
    </Section>
  );
}
