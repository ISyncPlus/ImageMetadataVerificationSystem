import type { SVGProps } from "react";

/**
 * Provenance Custom Iconography System
 * 
 * Handcrafted 24x24 optical grid, 1.5 stroke width, round caps & joins.
 * Distinctive forensic, optical telemetry, and academic verification visual language.
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

/** Cryptographic provenance verification badge with embedded telemetry reticle */
export const ShieldCheck = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 2.5 L4.5 5.75 C4.5 12 7.5 17.75 12 21.5 C16.5 17.75 19.5 12 19.5 5.75 L12 2.5 Z" />
    <path d="M8.75 12 L11 14.25 L15.75 9.5" />
    <circle cx="12" cy="12" r="6.25" strokeDasharray="1.5 3" />
  </Icon>
);

/** Faceted forensic security shield with warning aperture */
export const ShieldAlert = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 2.5 L4.5 5.75 C4.5 12 7.5 17.75 12 21.5 C16.5 17.75 19.5 12 19.5 5.75 L12 2.5 Z" />
    <path d="M12 8 V12.5" />
    <circle cx="12" cy="16" r="0.75" fill="currentColor" stroke="none" />
  </Icon>
);

/** Solar theme glyph with concentric core and calibrated optical rays */
export const Sun = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="4.25" />
    <path d="M12 2.5 V4.5 M12 19.5 V21.5 M2.5 12 H4.5 M19.5 12 H21.5 M5.28 5.28 L6.7 6.7 M17.3 17.3 L18.72 18.72 M5.28 18.72 L6.7 17.3 M17.3 6.7 L18.72 5.28" />
  </Icon>
);

/** Lunar theme glyph with deep shadow curvature and orbital node */
export const Moon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M19.5 14.8 C18.2 15.6 16.7 16 15 16 C10.6 16 7 12.4 7 8 C7 6.3 7.4 4.8 8.2 3.5 C4.6 4.7 2 8.1 2 12.2 C2 17.6 6.4 22 11.8 22 C15.9 22 19.3 19.4 19.5 14.8 Z" />
    <circle cx="17" cy="6" r="1" fill="currentColor" stroke="none" />
  </Icon>
);

/** Ingest cradle: Optical sensor bay accepting camera photograph stream */
export const Upload = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 14.5 V18 C4 19.1 4.9 20 6 20 H18 C19.1 20 20 19.1 20 18 V14.5" />
    <path d="M12 3.5 V14 M7.5 8 L12 3.5 L16.5 8" />
    <path d="M9 14.5 H15" strokeDasharray="1.5 2" />
  </Icon>
);

/** Temporal Integrity: Precision camera sensor chronometer with 4-quadrant calibration marks */
export const Clock = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="8.75" />
    <path d="M12 4.25 V5.75 M12 18.25 V19.75 M4.25 12 H5.75 M18.25 12 H19.75" />
    <path d="M12 8 V12 L15 13.75" />
    <circle cx="12" cy="12" r="1.25" fill="currentColor" />
  </Icon>
);

/** Geospatial Proximity: Geodetic telemetry beacon with internal GPS coordinate target */
export const Pin = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 21.5 C12 21.5 4.5 14.5 4.5 9.5 A7.5 7.5 0 0 1 19.5 9.5 C19.5 14.5 12 21.5 12 21.5 Z" />
    <circle cx="12" cy="9.5" r="2.75" />
    <path d="M12 5.5 V7 M12 12 V13.5" strokeDasharray="1 1.5" />
  </Icon>
);

/** Geospatial Campus Map Location Marker */
export const MapPin = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 21.5 C12 21.5 4.5 14.5 4.5 9.5 A7.5 7.5 0 0 1 19.5 9.5 C19.5 14.5 12 21.5 12 21.5 Z" />
    <circle cx="12" cy="9.5" r="2.5" />
    <path d="M9.5 9.5 H14.5" />
  </Icon>
);

/** Hardware Fingerprint: Rangefinder camera body with concentric optical lens and aperture diaphragm */
export const Camera = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 8 C3 6.89 3.89 6 5 6 H7.5 L9 4 H15 L16.5 6 H19 C20.1 6 21 6.89 21 8 V17.5 C21 18.6 20.1 19.5 19 19.5 H5 C3.89 19.5 3 18.6 3 17.5 Z" />
    <circle cx="12" cy="12.75" r="4.25" />
    <circle cx="12" cy="12.75" r="1.75" />
    <circle cx="17.75" cy="8.25" r="0.75" fill="currentColor" stroke="none" />
  </Icon>
);

/** Cryptographic Hash: SHA-256 binary lattice matrix with interconnected verification nodes */
export const Hash = (props: IconProps) => (
  <Icon {...props}>
    <path d="M8.5 3.5 V20.5 M15.5 3.5 V20.5 M3.5 8.5 H20.5 M3.5 15.5 H20.5" />
    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
    <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" />
  </Icon>
);

/** Archival Audit Sheet: Institutional verified document with security ribbon seal */
export const Doc = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5.5 3.5 H14.5 L19.5 8.5 V19.5 C19.5 20.6 18.6 21.5 17.5 21.5 H5.5 C4.4 21.5 3.5 20.6 3.5 19.5 V5.5 C3.5 4.4 4.4 3.5 5.5 3.5 Z" />
    <path d="M14 3.5 V9 H19.5" />
    <path d="M7.5 13 H15.5 M7.5 16.5 H13 M7.5 9.5 H10.5" />
  </Icon>
);

/** Telemetry Text File Record */
export const FileText = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5.5 3.5 H14.5 L19.5 8.5 V19.5 C19.5 20.6 18.6 21.5 17.5 21.5 H5.5 C4.4 21.5 3.5 20.6 3.5 19.5 V5.5 C3.5 4.4 4.4 3.5 5.5 3.5 Z" />
    <path d="M14 3.5 V9 H19.5" />
    <path d="M8 13.5 H15 M8 17 H12" />
  </Icon>
);

/** Precision Verification Checkmark */
export const Check = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4.5 12.5 L9.5 17.5 L19.5 6.5" />
  </Icon>
);

/** Certified Audit Pass Stamp */
export const CheckCircle2 = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.25 L10.75 15 L16 9.5" />
  </Icon>
);

/** Telemetry Warning / Anomaly Alert */
export const Alert = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 3.25 L2.5 19.5 C2.25 19.9 2.5 20.5 3.1 20.5 H20.9 C21.5 20.5 21.75 19.9 21.5 19.5 L12 3.25 Z" />
    <path d="M12 9 V13.5" />
    <circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none" />
  </Icon>
);

/** Duplicate Detection: Registered comparative photo frames in forensic scan */
export const Copies = (props: IconProps) => (
  <Icon {...props}>
    <rect x="7.5" y="3.5" width="13" height="13" rx="2.5" />
    <path d="M16.5 16.5 V18.5 A2 2 0 0 1 14.5 20.5 H5.5 A2 2 0 0 1 3.5 18.5 V9.5 A2 2 0 0 1 5.5 7.5 H7.5" />
    <path d="M10.5 10 L13 12.5 L17.5 8" strokeDasharray="1.5 1.5" />
  </Icon>
);

/** Optical Loupe / Departmental Ledger Search */
export const Search = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="10.5" cy="10.5" r="6.75" />
    <path d="M15.5 15.5 L20.5 20.5" />
    <path d="M8 10.5 H13 M10.5 8 V13" strokeDasharray="1 1.5" />
  </Icon>
);

/** Authenticated Session Portal Disconnect */
export const SignOut = (props: IconProps) => (
  <Icon {...props}>
    <path d="M13 6 V4.5 A2 2 0 0 0 11 2.5 H5 A2 2 0 0 0 3 4.5 V19.5 A2 2 0 0 0 5 21.5 H11 A2 2 0 0 0 13 19.5 V18" />
    <path d="M9 12 H21 M17.5 8.5 L21 12 L17.5 15.5" />
  </Icon>
);

/** Directional Kinetic Arrow Right */
export const ArrowRight = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 12 H20 M14 6 L20 12 L14 18" />
  </Icon>
);

/** Directional Kinetic Arrow Left */
export const ArrowLeft = (props: IconProps) => (
  <Icon {...props}>
    <path d="M20 12 H4 M10 18 L4 12 L10 6" />
  </Icon>
);

/** External Navigational Vector */
export const ArrowUpRight = (props: IconProps) => (
  <Icon {...props}>
    <path d="M7 17 L17 7 M7 7 H17 V17" />
  </Icon>
);

/** External Resource Reference */
export const ExternalLink = (props: IconProps) => (
  <Icon {...props}>
    <path d="M18 13 V19 C18 20.1 17.1 21 16 21 H5 C3.9 21 3 20.1 3 19 V8 C3 6.9 3.9 6 5 6 H11" />
    <path d="M15 3 H21 V9 M10 14 L21 3" />
  </Icon>
);

/** Navigation Chevrons */
export const ChevronRight = (props: IconProps) => (
  <Icon {...props}>
    <path d="M9 6 L15 12 L9 18" />
  </Icon>
);

export const ChevronUp = (props: IconProps) => (
  <Icon {...props}>
    <path d="M18 15 L12 9 L6 15" />
  </Icon>
);

export const ChevronDown = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 9 L12 15 L18 9" />
  </Icon>
);

/** Institutional University Faculty Monolith */
export const Building = (props: IconProps) => (
  <Icon {...props}>
    <rect x="5.5" y="3" width="13" height="18" rx="1.5" />
    <path d="M2.5 10.5 H5.5 V21 H2.5 Z M18.5 10.5 H21.5 V21 H18.5 Z" />
    <path d="M9 7.5 H10 M14 7.5 H15 M9 11.5 H10 M14 11.5 H15 M9 15.5 H10 M14 15.5 H15" />
    <path d="M10 21 V18.5 H14 V21" />
  </Icon>
);

/** Academic Degree & Research Fieldwork Cap */
export const GraduationCap = (props: IconProps) => (
  <Icon {...props}>
    <polygon points="12,3.5 22.5,8.5 12,13.5 1.5,8.5" />
    <path d="M5.5 10.5 V15.5 C5.5 17.5 8.5 19.5 12 19.5 C15.5 19.5 18.5 17.5 18.5 15.5 V10.5" />
    <path d="M21 9 V16 C21 16.6 20.5 17.2 20 17.5" />
  </Icon>
);

/** Geodetic Surveying & Azimuth Compass */
export const Compass = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3 V5.5 M12 18.5 V21 M3 12 H5.5 M18.5 12 H21" />
    <polygon points="12,6.5 15,12 12,17.5 9,12" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </Icon>
);

/** Instant Execution & <50ms Response SLA Impulse */
export const Zap = (props: IconProps) => (
  <Icon {...props}>
    <polygon points="13,2.5 4.5,13.5 11.5,13.5 10.5,21.5 19.5,10.5 12.5,10.5" />
  </Icon>
);

/** Client-Side Cryptographic Burst & WebAssembly Engine */
export const Sparkles = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 2.5 Q12 9 5.5 12 Q12 15 12 21.5 Q12 15 18.5 12 Q12 9 12 2.5 Z" />
    <path d="M4 4.5 Q4 6.5 2 7.5 Q4 8.5 4 10.5 Q4 8.5 6 7.5 Q4 6.5 4 4.5 Z" />
    <path d="M19 14.5 Q19 16.5 17 17.5 Q19 18.5 19 20.5 Q19 18.5 21 17.5 Q19 16.5 19 14.5 Z" />
  </Icon>
);

/** Departmental Cohorts & Review Board */
export const Users = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="9" cy="8" r="3.75" />
    <path d="M3 19.5 C3 15.5 6 14 9 14 C12 14 15 15.5 15 19.5" />
    <circle cx="17.5" cy="8" r="2.75" strokeDasharray="1.5 1.5" />
    <path d="M15.5 14.5 C17.5 14.8 20.5 16 20.5 19.5" strokeDasharray="1.5 1.5" />
  </Icon>
);

/** Individual Researcher / Student Profile */
export const User = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="8" r="4.25" />
    <path d="M4.5 20 C4.5 15.5 8 14 12 14 C16 14 19.5 15.5 19.5 20" />
  </Icon>
);

/** Knowledge Base / FAQ Inquirer */
export const HelpCircle = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9 C9.5 7.6 10.6 6.5 12 6.5 C13.4 6.5 14.5 7.6 14.5 9 C14.5 11 12 11.5 12 13.5" />
    <circle cx="12" cy="16.75" r="0.75" fill="currentColor" stroke="none" />
  </Icon>
);

/** Telemetry Specification Notice */
export const Info = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="8" r="0.8" fill="currentColor" stroke="none" />
    <path d="M12 11 V16.5 M10.5 16.5 H13.5" />
  </Icon>
);

/** Institutional Email Channel */
export const Mail = (props: IconProps) => (
  <Icon {...props}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <path d="M3.5 6 L12 12.5 L20.5 6" />
  </Icon>
);

/** Telephony Channel */
export const Phone = (props: IconProps) => (
  <Icon {...props}>
    <path d="M21.5 16.8 V19.8 A2 2 0 0 1 19.3 21.8 C10.5 21.3 3.5 14.3 3 5.5 A2 2 0 0 1 5 3.3 H8 A2 2 0 0 1 10 4.9 L10.8 7.3 A2 2 0 0 1 10.3 9.4 L8.8 10.7 C10.2 13.5 12.5 15.8 15.3 17.2 L16.6 15.7 A2 2 0 0 1 18.7 15.2 L21.1 16 A2 2 0 0 1 21.5 16.8 Z" />
  </Icon>
);

/** Archival Certificate PDF Download */
export const Download = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 15.5 V18.5 C4 19.6 4.9 20.5 6 20.5 H18 C19.1 20.5 20 19.6 20 18.5 V15.5" />
    <path d="M12 3.5 V14.5 M7.5 10 L12 14.5 L16.5 10" />
  </Icon>
);

/** Ledger Provenance Share */
export const Share2 = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="17.5" cy="5.5" r="2.75" />
    <circle cx="6.5" cy="12" r="2.75" />
    <circle cx="17.5" cy="18.5" r="2.75" />
    <path d="M9.1 10.7 L14.9 7.8 M9.1 13.3 L14.9 16.2" />
  </Icon>
);

/** Tactical Hamburger Navigation */
export const Menu = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3.5 6.5 H20.5 M3.5 12 H16.5 M3.5 17.5 H20.5" />
  </Icon>
);

/** Tactical Close Glyph */
export const Close = (props: IconProps) => (
  <Icon {...props}>
    <path d="M18 6 L6 18 M6 6 L18 18" />
  </Icon>
);

/** Visibility Eye Glyph */
export const Eye = (props: IconProps) => (
  <Icon {...props}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

/** Hidden Visibility Eye-Off Glyph */
export const EyeOff = (props: IconProps) => (
  <Icon {...props}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </Icon>
);

/** Clipboard Copy Glyph */
export const Copy = (props: IconProps) => (
  <Icon {...props}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </Icon>
);

/** Floating Contact Message Glyph */
export const MessageSquare = (props: IconProps) => (
  <Icon {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Icon>
);

