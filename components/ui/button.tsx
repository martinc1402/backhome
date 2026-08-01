import type { ComponentProps, ReactNode } from "react";

type Variant = "solid" | "outline" | "lime" | "onDark" | "link";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill " +
  "motion-safe:transition-colors motion-safe:duration-200 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

// Weight stays at 400 throughout — see the note in globals.css.
const variants: Record<Variant, string> = {
  solid: "bg-forest text-cream hover:bg-forest-deep",
  outline: "border border-bark/35 text-bark hover:border-forest hover:text-forest",
  lime: "bg-lime text-forest hover:bg-lime-deep",
  onDark: "bg-cream text-forest hover:bg-lime",
  // No colour of its own — it inherits, or takes whatever the caller passes.
  // Declaring text-inherit here would fight the caller's className, since
  // Tailwind resolves same-property utilities by stylesheet order, not by the
  // order they appear in the class attribute.
  link: "underline decoration-current/40 decoration-1 underline-offset-[6px] hover:decoration-current",
};

const sizes: Record<Size, string> = {
  // min-h keeps every target comfortably tappable on a phone.
  md: "min-h-11 px-6 py-2.5 text-sm",
  lg: "min-h-14 px-8 py-4 text-base",
};

type ButtonBaseProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

function classesFor({
  variant = "solid",
  size = "md",
  className = "",
}: Omit<ButtonBaseProps, "children">) {
  // The link variant is inline text, so it takes no button padding.
  const sizing = variant === "link" ? "" : sizes[size];
  return `${base} ${variants[variant]} ${sizing} ${className}`.trim();
}

type ButtonLinkProps = ButtonBaseProps & ComponentProps<"a">;

/**
 * Anchor styled as a button. Used for every in-page CTA — all navigation on
 * this single-page site is hash-based, so next/link adds nothing here.
 */
export function ButtonLink({
  variant,
  size,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a className={classesFor({ variant, size, className })} {...props}>
      {children}
    </a>
  );
}

type ButtonProps = ButtonBaseProps & ComponentProps<"button">;

export function Button({
  variant,
  size,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classesFor({ variant, size, className })}
      {...props}
    >
      {children}
    </button>
  );
}
