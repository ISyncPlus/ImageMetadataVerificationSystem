"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import PageShell from "../../components/PageShell";
import Card from "../../components/ui/Card";
import Reveal from "../../components/ui/Reveal";
import { Button } from "../../components/ui/Button";
import { Alert, Check, ShieldCheck } from "../../components/ui/icons";
import { BrandMark } from "../../components/ui/BrandLogo";
import { ApiError, completeOnboarding } from "../../lib/api";
import { useProfile } from "../../lib/useProfile";
import { fade, springMove } from "../../lib/motion";
import Breadcrumbs from "../../components/ui/Breadcrumbs";

/**
 * Claims a registration number or staff ID after sign-in.
 *
 * Note there is no "I am a lecturer" control. Reviewer access is requested by
 * entering a code the department issues, and granted — or refused — by the
 * server. A role the client can simply assert is a role every student assigns
 * themselves (ARCHITECTURE.md, Decision 3).
 */
export default function OnboardingPage() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const { profile, loading } = useProfile();

  const [identifier, setIdentifier] = useState("");
  const [wantsReviewer, setWantsReviewer] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!profile) {
      router.replace("/login");
      return;
    }
    if (profile.onboarded) {
      router.replace(profile.role === "lecturer" ? "/lecturer" : "/student");
    }
  }, [loading, profile, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const trimmed = identifier.trim();
    if (trimmed.length < 4) {
      setError("Enter a valid registration number or staff ID.");
      return;
    }
    if (wantsReviewer && !inviteCode.trim()) {
      setError("Enter the reviewer invite code, or continue as a student.");
      return;
    }

    setSubmitting(true);
    try {
      const updated = await completeOnboarding({
        identifier: trimmed,
        ...(wantsReviewer ? { inviteCode: inviteCode.trim() } : {}),
      });
      router.replace(updated.role === "lecturer" ? "/lecturer" : "/student");
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Could not save your profile. Please try again."
      );
      setSubmitting(false);
    }
  };

  if (loading || !profile) {
    return (
      <PageShell width="narrow">
        <div className="pt-4">
          <Card>
            <div className="flex flex-col gap-3">
              <div className="shimmer h-6 w-40 rounded-md bg-well" />
              <div className="shimmer h-11 w-full rounded-xl bg-well" />
              <div className="shimmer h-11 w-full rounded-xl bg-well" />
            </div>
          </Card>
        </div>
      </PageShell>
    );
  }

  const fieldClass =
    "t-callout min-h-11 w-full rounded-xl border border-line bg-well px-3.5 py-2.5 text-ink outline-none transition-colors duration-150 placeholder:text-ink-3 focus:border-accent";

  return (
    <PageShell width="narrow">
      <div className="py-2">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Onboarding" },
          ]}
        />
      </div>

      <Reveal className="pt-2">
        <Card>
          <div className="flex flex-col items-center text-center">
            <BrandMark size={44} />
            <h1 className="t-title-2 mt-4 text-ink">One more step</h1>
            <p className="t-footnote mt-1.5 text-ink-2">
              Signed in as {profile.email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5">
            <label className="flex flex-col gap-1.5">
              <span className="t-footnote font-medium text-ink-2">
                Registration number or staff ID
              </span>
              <input
                type="text"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="2021/248001"
                autoFocus
                className={fieldClass}
              />
              <span className="t-caption text-ink-3">
                This is attached to every submission you make, so a reviewer can
                identify your work.
              </span>
            </label>

            {/* Reviewer access is opt-in and code-gated. */}
            <div className="rounded-xl border border-line bg-well p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={wantsReviewer}
                  onChange={(event) => {
                    setWantsReviewer(event.target.checked);
                    setError(null);
                  }}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--brand)]"
                />
                <span className="min-w-0">
                  <span className="t-footnote flex items-center gap-1.5 font-medium text-ink">
                    <ShieldCheck size={14} />
                    I am a departmental reviewer
                  </span>
                  <span className="t-caption mt-0.5 block text-ink-2">
                    Requires the invite code issued by the department. Without
                    it you will continue as a student.
                  </span>
                </span>
              </label>

              <AnimatePresence initial={false}>
                {wantsReviewer ? (
                  <motion.div
                    initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                    transition={reduced ? fade : springMove}
                    className="overflow-hidden"
                  >
                    <input
                      type="password"
                      value={inviteCode}
                      onChange={(event) => setInviteCode(event.target.value)}
                      placeholder="Reviewer invite code"
                      className={`${fieldClass} mt-3`}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <AnimatePresence initial={false}>
              {error ? (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={fade}
                  className="t-footnote flex items-start gap-1.5 rounded-xl border border-bad/30 bg-bad-wash px-3.5 py-2.5 text-bad"
                >
                  <Alert size={14} strokeWidth={2} className="mt-0.5 shrink-0" />
                  {error}
                </motion.p>
              ) : null}
            </AnimatePresence>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? (
                "Saving…"
              ) : (
                <>
                  <Check size={16} />
                  Continue
                </>
              )}
            </Button>
          </form>
        </Card>
      </Reveal>
    </PageShell>
  );
}
