import React from "react";

type BrandMarkProps = {
  size?: number | string;
  className?: string;
  variant?: "vermilion" | "monochrome";
};

/**
 * PROVENANCE Official Brand Mark
 *
 * Geometric Rationale:
 * - A sharp, flat, monolithic frame symbolizing the image evidence.
 * - An internal negative-space provenance channel carving an abstract "P" (Provenance)
 *   and revealing the underlying data layer.
 * - A solid Vermilion (#E04B28) origin datum tile positioned at the focal anchor.
 * - Zero gradients. Zero glows. Zero AI tropes. 100% pure flat Swiss vector geometry.
 */
export function BrandMark({
  size = 32,
  className = "",
  variant = "vermilion",
}: BrandMarkProps) {
  const accentColor = variant === "monochrome" ? "currentColor" : "#E04B28";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* Outer Bounding Image Frame / Heavy Geometry */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 4H28V28H4V4ZM8 8H24V17H15V24H8V8Z"
        fill="currentColor"
      />

      {/* Origin Datum / Metadata Layer Tile */}
      <rect
        x="17"
        y="19"
        width="7"
        height="5"
        fill={accentColor}
      />
    </svg>
  );
}

type BrandLogoProps = {
  size?: "sm" | "md" | "lg" | "hero";
  showSubtitle?: boolean;
  subtitleText?: string;
  condensed?: boolean;
  className?: string;
  variant?: "vermilion" | "monochrome";
};

const SIZES = {
  sm: { mark: 22, text: "text-[14px]", sub: "text-[10px]" },
  md: { mark: 26, text: "text-[16px]", sub: "text-[11px]" },
  lg: { mark: 34, text: "text-[20px]", sub: "text-[12px]" },
  hero: { mark: 48, text: "text-[28px]", sub: "text-[13px]" },
};

/**
 * PROVENANCE Complete Editorial Wordmark Lockup
 */
export default function BrandLogo({
  size = "md",
  showSubtitle = true,
  subtitleText = "Image Metadata Verification",
  condensed = false,
  className = "",
  variant = "vermilion",
}: BrandLogoProps) {
  const config = SIZES[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className="text-ink flex items-center">
        <BrandMark size={config.mark} variant={variant} />
      </div>
      {!condensed && (
        <div className="flex flex-col justify-center leading-none">
          <span
            className={`font-bold tracking-[0.06em] text-ink uppercase ${config.text}`}
            style={{ letterSpacing: "0.07em" }}
          >
            Provenance
          </span>
          {showSubtitle && subtitleText && (
            <span
              className={`mt-1 font-medium tracking-[0.02em] text-ink-2 ${config.sub}`}
            >
              {subtitleText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
