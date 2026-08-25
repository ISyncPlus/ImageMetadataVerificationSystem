import type { ReactNode } from "react";
import AppNavbar from "./AppNavbar";
import RaysBackground from "./ui/RaysBackground";
import ScrollControls from "./ui/ScrollControls";
import type { Session } from "../lib/auth";

type PageShellProps = {
  children: ReactNode;
  session?: Session | null;
  /** Narrow column for single-task pages like sign-in. */
  width?: "wide" | "narrow";
};

export default function PageShell({
  children,
  session,
  width = "wide",
}: PageShellProps) {
  return (
    <div className="relative min-h-dvh bg-canvas text-ink">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div className="ambient absolute inset-0" />
        <RaysBackground />
      </div>

      {/* A sheet pushes this layer back; the sheet itself is portalled out, so
          the transform never becomes its containing block. */}
      <div data-page-content className="relative z-10">
        <AppNavbar session={session} />
        <main
          className={`mx-auto flex w-full flex-col gap-6 px-5 pb-24 pt-6 sm:gap-8 sm:px-8 ${
            width === "narrow" ? "max-w-md" : "max-w-6xl"
          }`}
        >
          {children}
        </main>
      </div>

      <ScrollControls />
    </div>
  );
}
