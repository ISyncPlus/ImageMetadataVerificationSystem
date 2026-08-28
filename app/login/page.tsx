"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import PageShell from "../../components/PageShell";
import Card from "../../components/ui/Card";
import Reveal from "../../components/ui/Reveal";
import SegmentedControl from "../../components/ui/SegmentedControl";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/icons";
import { GoogleGlyph, GitHubGlyph } from "../../components/ui/ProviderGlyphs";
import { BrandMark } from "../../components/ui/BrandLogo";
import {
  authClient,
  enabledProviders,
  signIn,
  signUp,
  useSession,
} from "../../lib/auth-client";
import { fade, springMove } from "../../lib/motion";

type Mode = "signin" | "signup";
const MODES: readonly Mode[] = ["signin", "signup"];

const MODE_LABEL: Record<Mode, string> = {
  signin: "Sign in",
  signup: "Create account",
};

export default function LoginPage() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const { data: session, isPending } = useSession();

  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  // Everyone lands on /onboarding; it forwards on once a profile exists, and
  // it is the only place that knows whether onboarding is still outstanding.
  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace("/onboarding");
    }
  }, [isPending, session, router]);

  const oauth = async (provider: "google" | "github") => {
    setError(null);
    setBusy(provider);
    try {
      await signIn.social({
        provider,
        callbackURL: `${window.location.origin}/onboarding`,
      });
    } catch {
      setError(
        `Could not reach ${provider === "google" ? "Google" : "GitHub"}. Check that the server is running and the provider is configured.`
      );
      setBusy(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (mode === "signup" && name.trim().length < 3) {
      setError("Enter your full name.");
      return;
    }
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setBusy("email");
    const result =
      mode === "signup"
        ? await signUp.email({
            name: name.trim(),
            email: email.trim(),
            password,
          })
        : await authClient.signIn.email({ email: email.trim(), password });

    if (result.error) {
      setError(result.error.message ?? "Those details were not accepted.");
      setBusy(null);
      return;
    }
    router.replace("/onboarding");
  };

  const fieldClass =
    "t-callout min-h-11 w-full rounded-xl border border-line bg-well px-3.5 py-2.5 text-ink outline-none transition-colors duration-150 placeholder:text-ink-3 focus:border-accent";

  const anyOAuth = enabledProviders.google || enabledProviders.github;

  return (
    <PageShell width="narrow">
      <Reveal className="pt-4">
        <Card>
          <div className="flex flex-col items-center text-center">
            <BrandMark size={48} />
            <h1 className="t-title-2 mt-4 text-ink">Sign in to Provenance</h1>
            <p className="t-footnote mt-1.5 text-ink-2">
              Faculty of Physical Sciences, Nnamdi Azikiwe University
            </p>
          </div>

          <div className="mt-6">
            <SegmentedControl
              options={MODES}
              value={mode}
              onChange={(next) => {
                setMode(next);
                setError(null);
              }}
              label="Sign in or create an account"
              className="w-full"
              render={(option) => <span>{MODE_LABEL[option]}</span>}
            />
          </div>

          {anyOAuth ? (
            <>
              <div className="mt-5 flex flex-col gap-2.5">
                {enabledProviders.google ? (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    disabled={busy !== null}
                    onClick={() => void oauth("google")}
                  >
                    <GoogleGlyph size={18} />
                    {busy === "google" ? "Redirecting…" : "Continue with Google"}
                  </Button>
                ) : null}
                {enabledProviders.github ? (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    disabled={busy !== null}
                    onClick={() => void oauth("github")}
                  >
                    <GitHubGlyph size={18} />
                    {busy === "github" ? "Redirecting…" : "Continue with GitHub"}
                  </Button>
                ) : null}
              </div>

              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-line" />
                <span className="t-caption text-ink-3">or use email</span>
                <span className="h-px flex-1 bg-line" />
              </div>
            </>
          ) : null}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Height animates so the card grows into the extra field rather
                than jumping between two layouts. */}
            <AnimatePresence initial={false}>
              {mode === "signup" ? (
                <motion.label
                  initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  transition={reduced ? fade : springMove}
                  className="flex flex-col gap-1.5 overflow-hidden"
                >
                  <span className="t-footnote font-medium text-ink-2">
                    Full name
                  </span>
                  <input
                    type="text"
                    value={name}
                    autoComplete="name"
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Ada Obi"
                    className={fieldClass}
                  />
                </motion.label>
              ) : null}
            </AnimatePresence>

            <label className="flex flex-col gap-1.5">
              <span className="t-footnote font-medium text-ink-2">Email</span>
              <input
                type="email"
                value={email}
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@unizik.edu.ng"
                className={fieldClass}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="t-footnote font-medium text-ink-2">Password</span>
              <input
                type="password"
                value={password}
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                className={fieldClass}
              />
            </label>

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
              disabled={busy !== null}
            >
              {busy === "email" ? "Working…" : MODE_LABEL[mode]}
            </Button>
          </form>

          <p className="t-caption mt-6 text-center text-ink-3">
            New accounts start as students. Reviewer access is granted with a
            departmental invite code on the next step.
          </p>
        </Card>
      </Reveal>
    </PageShell>
  );
}
