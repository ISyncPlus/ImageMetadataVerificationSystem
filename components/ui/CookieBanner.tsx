"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ShieldCheck, Close } from "./icons";
import { Button } from "./Button";
import { fade, springMove } from "../../lib/motion";

const COOKIE_CONSENT_KEY = "provenance_privacy_consent_v1";

export default function CookieBanner() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  /* `visible` doubles as the mounted guard: it starts false on the server and
     on the client's first paint, and only the timer below can turn it true —
     which cannot happen before hydration. An extra `mounted` flag set
     synchronously here would render the whole tree a second time for nothing. */
  useEffect(() => {
    if (localStorage.getItem(COOKIE_CONSENT_KEY)) return;
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "essential_only");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          role="region"
          aria-label="Privacy and cookies"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
          transition={springMove}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl rounded-xl border border-material-edge bg-surface p-4 shadow-lift backdrop-blur-2xl sm:bottom-6 sm:left-6 sm:right-auto sm:p-5"
        >
          <div className="flex items-start gap-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-wash text-accent-deep border border-accent-edge">
              <ShieldCheck size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="t-mark text-ink font-semibold">
                  Zero Telemetry Tracking
                </h3>
                <button
                  type="button"
                  onClick={decline}
                  className="rounded p-1 text-ink-3 hover:text-ink transition-colors"
                  aria-label="Close cookie notice"
                >
                  <Close size={14} />
                </button>
              </div>
              <p className="t-caption mt-1.5 text-ink-2 text-pretty">
                Provenance processes all photographs locally on your machine. We only use functional session cookies for departmental authentication and essential audit logging.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <Button size="sm" variant="primary" onClick={accept}>
                  Accept Essential Cookies
                </Button>
                <Link
                  href="/privacy"
                  className="t-mark text-ink-3 hover:text-ink underline transition-colors px-2 py-1 text-[0.6875rem]"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
