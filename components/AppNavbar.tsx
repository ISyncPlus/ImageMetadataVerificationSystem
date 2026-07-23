"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearSession } from "../lib/auth";
import type { Session } from "../lib/auth";

type AppNavbarProps = {
  session: Session;
};

export default function AppNavbar({ session }: AppNavbarProps) {
  const router = useRouter();

  const handleSignOut = () => {
    clearSession();
    router.replace("/login");
  };

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur">
      <Link href="/" className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-400/10 text-sm font-bold text-cyan-200">
          IV
        </span>
        <span className="text-sm font-semibold tracking-wide text-white">
          IMVS
          <span className="ml-2 hidden text-xs font-normal text-white/40 sm:inline">
            Image Metadata Verification System
          </span>
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-white">{session.name}</p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300/70">
            {session.role} · {session.identifier}
          </p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:border-rose-400/50 hover:text-rose-200"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
