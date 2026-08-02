import type { SVGProps } from "react";

/**
 * One icon set, one construction: 24px grid, 1.5 stroke, round caps, currentColor.
 * Consistency here is what stops an interface from looking assembled from parts.
 */
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const Icon = ({ size = 20, children, ...props }: IconProps) => (
  <svg width={size} height={size} {...base} {...props}>
    {children}
  </svg>
);

export const ShieldCheck = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 3 5 6v5.5c0 4.2 2.9 8.1 7 9.5 4.1-1.4 7-5.3 7-9.5V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);

export const Sun = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Icon>
);

export const Moon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
  </Icon>
);

export const Upload = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 15V4m0 0L8 8m4-4 4 4" />
    <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
  </Icon>
);

export const Clock = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
);

export const Pin = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 21s6.5-5.5 6.5-10a6.5 6.5 0 1 0-13 0c0 4.5 6.5 10 6.5 10Z" />
    <circle cx="12" cy="11" r="2.25" />
  </Icon>
);

export const Camera = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2l1.1-2h8.4l1.1 2h2.2A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-9Z" />
    <circle cx="12" cy="13" r="3.25" />
  </Icon>
);

export const Hash = (props: IconProps) => (
  <Icon {...props}>
    <path d="M9 3.5 7.5 20.5M16.5 3.5 15 20.5M4 9h16M3.5 15h16" />
  </Icon>
);

export const Doc = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 3.5h7.5L19 9v11.5H6V3.5Z" />
    <path d="M13.5 3.5V9H19M9 13h6M9 16.5h4" />
  </Icon>
);

export const Check = (props: IconProps) => (
  <Icon {...props}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Icon>
);

export const Alert = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 4.5 2.8 20h18.4L12 4.5Z" />
    <path d="M12 10v4M12 17.2v.3" />
  </Icon>
);

export const Copies = (props: IconProps) => (
  <Icon {...props}>
    <rect x="8.5" y="8.5" width="12" height="12" rx="2.5" />
    <path d="M15.5 5.5A2 2 0 0 0 13.5 3.5h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2" />
  </Icon>
);

export const ChevronRight = (props: IconProps) => (
  <Icon {...props}>
    <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
  </Icon>
);

export const Search = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </Icon>
);

export const SignOut = (props: IconProps) => (
  <Icon {...props}>
    <path d="M15 8V5.5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V16" />
    <path d="M10 12h10m0 0-3-3m3 3-3 3" />
  </Icon>
);
