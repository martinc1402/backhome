import type { CSSProperties } from "react";

import { trust } from "@/content/site";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Icon } from "@/components/ui/icon";
import { RevealList } from "@/components/ui/reveal-list";
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

          <RevealList className="mt-14 grid gap-10 sm:grid-cols-2 sm:gap-x-10">
            {trust.principles.map((principle, index) => (
              <li
                key={principle.title}
                className="border-t border-cream/20 pt-6"
                // Reading order, 100ms apart. Consumed by the scroll reveal
                // rules in globals.css.
                style={{ "--reveal-delay": `${index * 100}ms` } as CSSProperties}
              >
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
          </RevealList>
        </div>

        <PlaceholderImage
          src={trust.image.src}
          alt={trust.image.alt}
          width={trust.image.width}
          height={trust.image.height}
          sizes="(min-width: 1024px) 26rem, (min-width: 31rem) 28rem, 100vw"
          // The two-column layout only starts at lg, so between sm and lg this
          // panel would otherwise run the full container width at a 4/5
          // portrait crop — 689×861 at 768px, i.e. taller than the viewport,
          // and 1.44x the height of the text beside it. Worse as the screen
          // widens, because the principles list goes two-up at sm and gets
          // shorter while the image gets taller.
          //
          // Capping at 28rem holds the image to 448×560 there, level with the
          // text column. The cap is unconditional rather than sm:-gated on
          // purpose — it only bites once the container passes 448px (viewport
          // ~488px), so real phones are untouched (335×419 at 390px) while the
          // awkward 500–640px range is covered too. Gating it at sm left a
          // spike of 584×730 — 86% of the screen — at 639px.
          // w-full is load-bearing, not decoration: mx-auto takes the grid item
          // off `justify-self: stretch` and onto shrink-to-fit, and the only
          // child is a w-full image, so the intrinsic width would resolve to 0
          // and the panel would vanish entirely between sm and lg.
          className="mx-auto aspect-4/5 w-full max-w-md lg:mx-0 lg:max-w-none lg:aspect-3/4"
          // Real photograph — drops the corner badge.
          isPlaceholder={false}
        />
      </div>
    </Section>
  );
}
