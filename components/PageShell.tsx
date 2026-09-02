import type { CSSProperties, ReactNode } from "react";
import AppNavbar from "./AppNavbar";
import DossierRail from "./ui/DossierRail";
import type { RailMark } from "./ui/DossierRail";
import RaysBackground from "./ui/RaysBackground";
import ScrollControls from "./ui/ScrollControls";
import ScrollProgressBar from "./ScrollProgressBar";
import CookieBanner from "./ui/CookieBanner";
import FloatingContact from "./FloatingContact";
import StickyMobileCta from "./StickyMobileCta";
import type { Profile } from "../lib/api";

type PageShellProps = {
  children: ReactNode;
  session?: Profile | null;
  /** Narrow column for single-task pages like sign-in. */
  width?: "wide" | "narrow";
  /** Section marks tracked by the index rail. */
  rail?: readonly RailMark[];
  /** Vertical stamp on the rail. Names the file you are reading. */
  stamp?: string;
  /** The mobile CTA belongs to the marketing surface, not to signed-in work. */
  showMobileCta?: boolean;
};

/**
 * The document frame.
 *
 * Children are placed directly onto the dossier grid, so any of them can opt
 * out of the reading column and run the full width of the page by carrying
 * `bleed` (see `Field`). That is the whole point of the grid: the alternative
 * - a centred wrapper plus negative viewport-unit margins - breaks the moment
 * a scrollbar or a reserved rail changes what "centre" means.
 */
export default function PageShell({
  children,
  session,
  width = "wide",
  rail,
  stamp,
  showMobileCta = false,
}: PageShellProps) {
  return (
    <div className="relative min-h-dvh bg-canvas text-ink">
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink focus:shadow-lift focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Spring Physics Top Scroll Progress Bar */}
      <ScrollProgressBar />

      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div className="ambient absolute inset-0" />
        <RaysBackground />
      </div>

      {/* A sheet pushes this layer back; the sheet itself is portalled out, so
          the transform never becomes its containing block. */}
      <div data-page-content className="relative z-10">
        <DossierRail marks={rail} {...(stamp ? { stamp } : {})} />
        <AppNavbar session={session} />

        <main
          id="main-content"
          className="dossier pb-0"
          style={
            width === "narrow"
              ? ({ "--measure": "26rem" } as CSSProperties)
              : undefined
          }
        >
          {children}
        </main>
      </div>

      {showMobileCta ? <StickyMobileCta /> : null}
      <ScrollControls />
      <FloatingContact raised={showMobileCta} />
      <CookieBanner />
    </div>
  );
}
