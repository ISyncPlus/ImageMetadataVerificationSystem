"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import PageShell from "../../components/PageShell";
import Card from "../../components/ui/Card";
import Reveal from "../../components/ui/Reveal";
import SegmentedControl from "../../components/ui/SegmentedControl";
import { Button } from "../../components/ui/Button";
import { Alert, ShieldCheck } from "../../components/ui/icons";
import { dashboardPathFor, loadSession, saveSession } from "../../lib/auth";
import type { UserRole } from "../../lib/auth";

const ROLES: readonly UserRole[] = ["student", "lecturer"];

type Errors = { name?: string; identifier?: string };

const validate = (
  role: UserRole,
  name: string,
  identifier: string
): Errors => {
  const errors: Errors = {};
  if (name.trim().length < 3) {
    errors.name = "Enter your full name.";
  }
  if (identifier.trim().length < 4) {
    errors.identifier =
      role === "student"
        ? "Enter a valid registration number."
        : "Enter a valid staff ID.";
  }
  return errors;
};

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("student");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const existing = loadSession();
    if (existing) {
      router.replace(dashboardPathFor(existing.role));
    }
  }, [router]);

  /* Once they have tried once, correct as they type rather than making them
     submit again to find out. */
  const revalidate = (next: { name?: string; identifier?: string }) => {
    if (!submitted) return;
    setErrors(
      validate(role, next.name ?? name, next.identifier ?? identifier)
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    const found = validate(role, name, identifier);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    saveSession({
      role,
      name: name.trim(),
      identifier: identifier.trim(),
      signedInAt: new Date().toISOString(),
    });
    router.replace(dashboardPathFor(role));
  };

  const fieldClass = (invalid?: string) =>
    `t-callout min-h-11 w-full rounded-xl border bg-well px-3.5 py-2.5 text-ink outline-none transition-colors duration-150 placeholder:text-ink-3 focus:border-accent ${
      invalid ? "border-bad" : "border-line"
    }`;

  return (
    <PageShell width="narrow">
      <Reveal className="pt-4">
        <Card>
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-ink">
              <ShieldCheck size={24} strokeWidth={1.7} />
            </span>
            <h1 className="t-title-2 mt-4 text-ink">Sign in to IMVS</h1>
            <p className="t-footnote mt-1.5 text-ink-2">
              Faculty of Physical Sciences, Nnamdi Azikiwe University
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <span className="t-footnote font-medium text-ink-2">
                I am signing in as
              </span>
              <SegmentedControl
                options={ROLES}
                value={role}
                onChange={(next) => {
                  setRole(next);
                  if (submitted) setErrors(validate(next, name, identifier));
                }}
                label="Account type"
                className="w-full"
                render={(option) => (
                  <span className="capitalize">{option}</span>
                )}
              />
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="t-footnote font-medium text-ink-2">Full name</span>
              <input
                type="text"
                value={name}
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                onChange={(event) => {
                  setName(event.target.value);
                  revalidate({ name: event.target.value });
                }}
                placeholder={role === "student" ? "Ada Obi" : "Dr. John Doe"}
                className={fieldClass(errors.name)}
              />
              {errors.name ? (
                <span className="t-caption flex items-center gap-1 text-bad">
                  <Alert size={13} strokeWidth={2} />
                  {errors.name}
                </span>
              ) : null}
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="t-footnote font-medium text-ink-2">
                {role === "student" ? "Registration number" : "Staff ID"}
              </span>
              <input
                type="text"
                value={identifier}
                aria-invalid={Boolean(errors.identifier)}
                onChange={(event) => {
                  setIdentifier(event.target.value);
                  revalidate({ identifier: event.target.value });
                }}
                placeholder={role === "student" ? "2021/248001" : "PHY/L/0042"}
                className={fieldClass(errors.identifier)}
              />
              {errors.identifier ? (
                <span className="t-caption flex items-center gap-1 text-bad">
                  <Alert size={13} strokeWidth={2} />
                  {errors.identifier}
                </span>
              ) : null}
            </label>

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Continue as {role}
            </Button>
          </form>

          <p className="t-caption mt-6 text-center text-ink-3">
            Authentication is simulated for this case study. Your details stay in
            this browser and are attached to the records you create.
          </p>
        </Card>
      </Reveal>
    </PageShell>
  );
}
