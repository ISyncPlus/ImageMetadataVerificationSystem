import Link from "next/link";
import PageShell from "../components/PageShell";
import Field from "../components/ui/Field";
import Reveal from "../components/ui/Reveal";
import { ButtonLink } from "../components/ui/Button";
import { ArrowUpRight, Compass, Doc, HelpCircle } from "../components/ui/icons";

export const metadata = {
  title: "404: Record Not Found | Provenance",
  description:
    "The requested page, verification record, or audit ledger document could not be located in the Provenance system.",
};

const RECOVERY = [
  {
    href: "/case-studies",
    icon: Doc,
    index: "01",
    title: "Case studies",
    detail: "Geology, physics and chemistry audits already run at UNIZIK.",
  },
  {
    href: "/student",
    icon: Compass,
    index: "02",
    title: "Student inspector",
    detail: "Check a coursework photograph against its own metadata.",
  },
  {
    href: "/privacy",
    icon: HelpCircle,
    index: "03",
    title: "Privacy policy",
    detail: "What is read on the device, and what is filed on the server.",
  },
];

export default function NotFound() {
  return (
    <PageShell stamp="Provenance — Record Not Found">
      <Field pad="lg" className="pt-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4">
              <span className="t-mark text-warn">Status 404</span>
              <span className="t-mark text-ink-2">Telemetry miss</span>
              <span className="rule-draw h-px flex-1 bg-rule" />
            </div>

            <Reveal>
              <h1 className="t-display mt-8 text-balance text-ink">
                No record at this address.
              </h1>
            </Reveal>

            <Reveal index={1}>
              <p className="t-body mt-7 max-w-lg text-pretty text-ink-2">
                The certificate, audit sheet or route you asked for is not in the
                file. It may have been removed from the ledger, relocated, or
                simply mistyped.
              </p>
            </Reveal>

            <Reveal index={2} className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/" variant="primary" size="lg" arrow>
                Back to the file
              </ButtonLink>
              <ButtonLink href="/login" size="lg" variant="secondary">
                Sign in
              </ButtonLink>
            </Reveal>
          </div>

          {/* The 404 set as an oversized outlined figure — the same marginal
              numeral the exhibits use, at the scale the error deserves. */}
          <div className="hidden lg:col-span-5 lg:flex lg:items-center lg:justify-end">
            <span
              aria-hidden
              className="numeral-ghost select-none text-[13rem] leading-none"
            >
              404
            </span>
          </div>
        </div>

        <div className="ruled mt-20 border-y border-rule">
          {RECOVERY.map((item) => {
            const Glyph = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex items-center gap-5 py-6"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 -left-4 w-0.5 origin-top scale-y-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 lg:-left-8"
                />
                <span className="t-num shrink-0 text-[0.8125rem] text-ink-3">
                  {item.index}
                </span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-well text-ink-2 ring-1 ring-line transition-colors duration-300 group-hover:bg-accent-wash group-hover:text-accent-deep">
                  <Glyph size={17} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="t-title-3 block text-ink">{item.title}</span>
                  <span className="t-footnote mt-1 block text-ink-2">
                    {item.detail}
                  </span>
                </span>
                <ArrowUpRight
                  size={16}
                  className="shrink-0 text-ink-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            );
          })}
        </div>
      </Field>
    </PageShell>
  );
}
