type SectionHeadingProps = {
  eyebrow?: string;
  heading: string;
  intro?: string;
  /** Forest sections need inverted text colours. */
  onDark?: boolean;
  align?: "left" | "center";
  /** Use the larger display size for the page's most important sections. */
  size?: "h2" | "display";
};

/**
 * The h2 plus optional eyebrow and intro used at the top of every section.
 * The page's single h1 lives in the hero and is not rendered here.
 *
 * Note the absence of any font-weight class — the huts.com register is
 * entirely weight 400, with hierarchy carried by size and colour.
 */
export function SectionHeading({
  eyebrow,
  heading,
  intro,
  onDark = false,
  align = "left",
  size = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-3xl text-center"
          : "max-w-3xl text-left"
      }
    >
      {eyebrow ? (
        <p
          className={`type-label mb-6 tracking-[0.16em] uppercase ${
            onDark ? "text-lime" : "text-moss"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}

      <h2
        className={`${size === "display" ? "type-display" : "type-h2"} ${
          onDark ? "text-cream" : "text-forest"
        }`}
      >
        {heading}
      </h2>

      {intro ? (
        <p
          className={`mt-6 max-w-xl text-lg leading-relaxed ${
            align === "center" ? "mx-auto" : ""
          } ${onDark ? "text-cream/75" : "text-bark"}`}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}
