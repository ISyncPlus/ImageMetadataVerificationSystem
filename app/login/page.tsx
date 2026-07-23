"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import PageShell from "../../components/PageShell";
import {
  dashboardPathFor,
  loadSession,
  saveSession,
} from "../../lib/auth";
import type { UserRole } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("student");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const existing = loadSession();
    if (existing) {
      router.replace(dashboardPathFor(existing.role));
    }
  }, [router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedIdentifier = identifier.trim();

    if (trimmedName.length < 3) {
      setError("Please enter your full name.");
      return;
    }
    if (trimmedIdentifier.length < 4) {
      setError(
        role === "student"
          ? "Please enter a valid registration number."
          : "Please enter a valid staff ID."
      );
      return;
    }

    saveSession({
      role,
      name: trimmedName,
      identifier: trimmedIdentifier,
      signedInAt: new Date().toISOString(),
    });
    router.replace(dashboardPathFor(role));
  };

  return (
    <PageShell>
      <div className="mx-auto flex w-full max-w-md flex-col gap-8 pt-6 md:pt-16">
        <Link
          href="/"
          className="text-center text-xs uppercase tracking-[0.3em] text-white/40 transition hover:text-cyan-200"
        >
          ← Back to home
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-400/10 text-base font-bold text-cyan-200">
              IV
            </span>
            <h1 className="mt-4 text-xl font-semibold text-white">
              Sign in to IMVS
            </h1>
            <p className="mt-2 text-xs text-white/50">
              Image Metadata Verification System — Faculty of Physical Sciences
            </p>
          </div>

          {/* Role selector */}
          <div className="mt-8 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/20 p-1.5">
            {(["student", "lecturer"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setRole(option);
                  setError(null);
                }}
                className={`rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                  role === option
                    ? "border border-cyan-400/50 bg-cyan-400/20 text-cyan-100"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-white/50">
                Full name
              </span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={role === "student" ? "e.g. Ada Obi" : "e.g. Dr. John Doe"}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-cyan-400/60"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-white/50">
                {role === "student" ? "Registration number" : "Staff ID"}
              </span>
              <input
                type="text"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder={role === "student" ? "e.g. 2021/248001" : "e.g. PHY/L/0042"}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-cyan-400/60"
              />
            </label>

            {error ? (
              <div className="rounded-2xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-xs text-rose-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              className="mt-2 rounded-2xl border border-cyan-400/50 bg-cyan-400/20 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100 transition hover:bg-cyan-400/30"
            >
              Sign in as {role}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] leading-relaxed text-white/35">
            Prototype note: authentication is simulated for the case study.
            Your details are stored only in this browser and attached to your
            verification records.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
