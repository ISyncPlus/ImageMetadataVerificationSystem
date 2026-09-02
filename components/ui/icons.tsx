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

export const ChevronUp = (props: IconProps) => (
  <Icon {...props}>
    <path d="m18.5 14.5-6.5-6.5-6.5 6.5" />
  </Icon>
);

export const ChevronDown = (props: IconProps) => (
  <Icon {...props}>
    <path d="m5.5 9.5 6.5 6.5 6.5-6.5" />
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

export const ArrowRight = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 12h14m-6-6 6 6-6 6" />
  </Icon>
);

export const ArrowLeft = (props: IconProps) => (
  <Icon {...props}>
    <path d="M19 12H5m6 6-6-6 6-6" />
  </Icon>
);

export const ArrowUpRight = (props: IconProps) => (
  <Icon {...props}>
    <path d="M7 17 17 7M7 7h10v10" />
  </Icon>
);

export const MapPin = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 21s-6-5.333-6-10a6 6 0 1 1 12 0c0 4.667-6 10-6 10Z" />
    <circle cx="12" cy="11" r="2.5" />
  </Icon>
);

export const Building = (props: IconProps) => (
  <Icon {...props}>
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
  </Icon>
);

export const GraduationCap = (props: IconProps) => (
  <Icon {...props}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5Z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </Icon>
);

export const HelpCircle = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
  </Icon>
);

export const Info = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v.01M12 11v5" />
  </Icon>
);

export const Compass = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </Icon>
);

export const Zap = (props: IconProps) => (
  <Icon {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </Icon>
);

export const Sparkles = (props: IconProps) => (
  <Icon {...props}>
    <path d="m12 3-1.9 4.8L5.3 9.7l4.8 1.9L12 16.4l1.9-4.8 4.8-1.9-4.8-1.9L12 3Z" />
    <path d="m5 3-.9 2.1L2 6l2.1.9L5 9l.9-2.1L8 6l-2.1-.9L5 3ZM19 15l-.9 2.1L16 18l2.1.9.9 2.1.9-2.1 2.1-.9-2.1-.9-.9-2.1Z" />
  </Icon>
);

export const Users = (props: IconProps) => (
  <Icon {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </Icon>
);

export const User = (props: IconProps) => (
  <Icon {...props}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Icon>
);

export const ExternalLink = (props: IconProps) => (
  <Icon {...props}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
  </Icon>
);

export const FileText = (props: IconProps) => (
  <Icon {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </Icon>
);

export const CheckCircle2 = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);

export const ShieldAlert = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 3 5 6v5.5c0 4.2 2.9 8.1 7 9.5 4.1-1.4 7-5.3 7-9.5V6l-7-3Z" />
    <path d="M12 8v4M12 16h.01" />
  </Icon>
);

export const Mail = (props: IconProps) => (
  <Icon {...props}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </Icon>
);

export const Phone = (props: IconProps) => (
  <Icon {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Icon>
);

export const Download = (props: IconProps) => (
  <Icon {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </Icon>
);

export const Share2 = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </Icon>
);

