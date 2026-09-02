import type { ElementType, ReactNode } from "react";

type Tone = "paper" | "ink" | "accent";

type FieldProps = {
  children: ReactNode;
  /**
   * Which palette the section stands on. `ink` and `accent` re-declare every
   * colour token for their whole subtree (see globals.css → Fields), so the
   * cards, badges, meters and tables inside them invert with no variant prop
   * and no `dark:` duplication.
   */
  tone?: Tone;
  /** Break out of the reading column to the full width of the page. */
  bleed?: boolean;
  /** Vertical breathing room. Bands want more air than in-column sections. */
  pad?: "none" | "sm" | "md" | "lg";
  id?: string;
  as?: ElementType;
  className?: string;
  /** Applied to the inner column rather than the band itself. */
  innerClassName?: string;
};

const PAD: Record<NonNullable<FieldProps["pad"]>, string> = {
  none: "",
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-24",
  lg: "py-24 sm:py-32 lg:py-40",
};

/**
 * A field is a horizontal band of the dossier.
 *
 * Paper fields are the default reading ground. Ink and accent fields are the
 * structural use of colour the design turns on: a section does not merely
 * *contain* vermilion, it *is* vermilion, edge to edge, and everything placed
 * on it re-reads its palette from the band. Alternating them is what gives the
 * page its rhythm without a single decorative divider.
 */
export default function Field({
  children,
  tone = "paper",
  bleed = false,
  pad = "md",
  id,
  as: Tag = "section",
  className = "",
  innerClassName = "",
}: FieldProps) {
  const body = (
    <div className={`${bleed ? "bleed-inner" : ""} ${innerClassName}`.trim()}>
      {children}
    </div>
  );

  return (
    <Tag
      id={id}
      data-field={tone === "paper" ? undefined : tone}
      className={`${bleed ? "bleed" : ""} ${PAD[pad]} ${
        tone === "paper" ? "" : "relative isolate"
      } ${className}`.trim()}
    >
      {/* Ink and accent bands get a hairline top edge so the transition from
          paper reads as a fold in the page rather than a colour accident. */}
      {tone !== "paper" ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-line-strong"
        />
      ) : null}
      {bleed || innerClassName ? body : children}
    </Tag>
  );
}
