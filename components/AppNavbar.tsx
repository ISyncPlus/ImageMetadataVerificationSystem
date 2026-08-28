"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSyncExternalStore } from "react";
import { signOut } from "../lib/auth-client";
import type { Profile } from "../lib/api";
import { ButtonLink } from "./ui/Button";
import ThemeToggle from "./ui/ThemeToggle";
import { SignOut } from "./ui/icons";
import { BrandMark } from "./ui/BrandLogo";
import { fade, springMove } from "../lib/motion";

type AppNavbarProps = {
  session?: Profile | null;
};

/* Scroll position is browser state, so it is read as an external store rather
   than mirrored into React with an effect. Reading it as a snapshot also means
   a page opened at an anchor — or restored mid-scroll — starts in the right
   state, instead of waiting for a scroll event that never comes. */
const CONDENSE_ABOVE = 36;
const RELEASE_BELOW = 12;
let isCondensed = false;

const subscribeToScroll = (callback: () => void): (() => void) => {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
};

/* Two thresholds, so a bar parked right on the line doesn't flutter. */
const getCondensedSnapshot = (): boolean => {
  const y = window.scrollY;
  isCondensed = isCondensed ? y > RELEASE_BELOW : y > CONDENSE_ABOVE;
  return isCondensed;
};

const getServerCondensed = (): boolean => false;

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

/**
 * At the top of the page the bar is the full content width and completely
 * transparent — there is nothing behind it yet to separate from. Once content
 * starts passing underneath it draws itself in as a glass pill and pulls in its
 * width, shedding the labels it no longer has room for.
 */
export default function AppNavbar({ session }: AppNavbarProps) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const condensed = useSyncExternalStore(
    subscribeToScroll,
    getCondensedSnapshot,
    getServerCondensed
  );

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    // flex, not block: otherwise the pill's top margin collapses through the
    // sticky header and the gap it is meant to create disappears.
    <header className="sticky top-0 z-40 flex justify-center px-4">
      <motion.nav
        animate={{
          maxWidth: condensed ? 750 : 1152,
          marginTop: condensed ? 18 : 0,
          borderRadius: condensed ? 999 : 0,
          paddingLeft: condensed ? 14 : 16,
          paddingRight: condensed ? 14 : 16,
        }}
        initial={false}
        transition={reduced ? { duration: 0 } : springMove}
        className="relative mx-auto flex w-full items-center gap-2 py-2.5 sm:gap-3"
      >
        {/* The material itself, faded in only once it has a job to do. */}
        <motion.span
          aria-hidden
          initial={false}
          animate={{ opacity: condensed ? 1 : 0 }}
          transition={reduced ? { duration: 0 } : fade}
          className="material material-pill absolute inset-0 rounded-[inherit] border border-material-edge backdrop-blur-[15px] backdrop-saturate-[190%]"
        />

        <Link
          href="/"
          className="relative flex min-w-0 items-center gap-2.5 rounded-full py-1 pr-2 transition-transform duration-150 active:scale-[0.98]"
        >
          <BrandMark size={32} />
          <span className="min-w-0">
            <span className="t-callout on-material block font-semibold tracking-tight text-ink">
              Provenance
            </span>
            <AnimatePresence initial={false}>
              {!condensed ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fade}
                  className="t-caption hidden truncate text-ink-2 sm:block"
                >
                  Image Metadata &amp; Verification
                </motion.span>
              ) : null}
            </AnimatePresence>
          </span>
        </Link>

        <div className="relative ml-auto flex items-center gap-2">
          {session ? (
            <>
              <AnimatePresence initial={false}>
                {!condensed ? (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={reduced ? { duration: 0 } : springMove}
                    className="hidden overflow-hidden whitespace-nowrap text-right sm:block"
                  >
                    <span className="t-footnote on-material block truncate font-semibold text-ink">
                      {session.name}
                    </span>
                    <span className="t-caption block truncate capitalize text-ink-2">
                      {session.role}
                      {session.identifier ? ` · ${session.identifier}` : ""}
                    </span>
                  </motion.span>
                ) : null}
              </AnimatePresence>

              <span
                title={`${session.name}${session.identifier ? ` · ${session.identifier}` : ""}`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-wash"
              >
                <span className="t-caption font-semibold text-accent">
                  {initials(session.name)}
                </span>
              </span>

              <ThemeToggle />

              <motion.button
                type="button"
                onClick={() => void handleSignOut()}
                aria-label="Sign out"
                whileTap={reduced ? { opacity: 0.7 } : { scale: 0.92 }}
                transition={springMove}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-2 transition-colors duration-150 hover:border-bad hover:text-bad"
              >
                <SignOut size={16} />
              </motion.button>
            </>
          ) : (
            <>
              <ThemeToggle />
              <ButtonLink href="/login" variant="primary" size="sm">
                Sign in
              </ButtonLink>
            </>
          )}
        </div>
      </motion.nav>
    </header>
  );
}
