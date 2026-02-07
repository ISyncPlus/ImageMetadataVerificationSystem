import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.12),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 grid-bg" />

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16">
        {children}
      </main>
    </div>
  );
}
